import { useEffect, useRef, useState } from 'react';
import {
  Conversation,
  Message,
  Paginator,
  Client as ConversationsClient
} from '@twilio/conversations';
import { GetUserInfo } from '../components/auth';
import {
  Input,
  Button,
  List,
  ListItem,
  Box,
  Typography,
  Stack
} from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import ConversationAdder from '../components/ConversationAdder';
import API_URL from '../util/apiURL';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '@prisma/client';
import { getName, readableDate } from '../util/utils';
import { getPaginatorItems, hasParticipant } from '../util/twilioUtils';
import { colors } from '../../public/colors';

interface ConversationsState {
  identity: string;
  token: string;
  status: string;
  statusString: string;
  conversationsReady: boolean;
  conversations: Conversation[];
  selectedConversationSid: string;
}
export default function ChatPage() {
  const [state, setState] = useState<ConversationsState>({
    identity: GetUserInfo()?.sub || '',
    token: '',
    status: '',
    statusString: '',
    conversationsReady: false,
    conversations: [],
    selectedConversationSid: ''
  });

  const [conversationsClient, setConversationsClient] =
    useState<ConversationsClient | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  const [authToken, setAuthToken] = useState<string>('');
  useEffect(() => {
    const getAuthToken = async () => {
      const token = await getAccessTokenSilently();
      setAuthToken(token);
    };
    getAuthToken();
  }, [getAccessTokenSilently]);

  const [currUser, setCurrUser] = useState<User | null>(null);
  useEffect(() => {
    if (!authToken) return;
    const getCurrUser = async () => {
      const response = await fetch(`${API_URL}/users/${state.identity}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      setCurrUser(data);
    };
    getCurrUser();
  }, [state.identity, authToken]);

  useEffect(() => {
    if (!authToken) return;
    const getToken = async () => {
      const response = await fetch(
        encodeURI(`${API_URL}/twilio/token?identity=${state.identity}`),
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      const data = await response.json();
      setToken(data.token);
    };

    getToken();
  }, [state.identity, state.token, authToken]);

  const setToken = (newToken: string) => {
    setState((prevState) => ({
      ...prevState,
      token: newToken
    }));
  };

  useEffect(() => {
    if (!state.token) return;
    const createClient = () => {
      setConversationsClient(new ConversationsClient(state.token));
    };
    createClient();
  }, [state.token]);

  useEffect(() => {
    const initClient = async () => {
      if (!conversationsClient) return;
      const subscribedConversationsPaginator =
        await conversationsClient.getSubscribedConversations();
      const subscribedConversations = getPaginatorItems(
        subscribedConversationsPaginator
      );
      setState((prevState) => ({
        ...prevState,
        conversations: subscribedConversations
      }));

      conversationsClient.on('connectionStateChanged', (clientState) => {
        if (clientState === 'connecting')
          setState((prevState) => ({
            ...prevState,
            statusString: 'Connecting to Twilio…',
            status: 'default'
          }));
        if (clientState === 'connected') {
          setState((prevState) => ({
            ...prevState,
            statusString: 'You are connected.',
            status: 'success'
          }));
        }
        if (clientState === 'disconnecting')
          setState((prevState) => ({
            ...prevState,
            statusString: 'Disconnecting from Twilio…',
            conversationsReady: false,
            status: 'default'
          }));
        if (clientState === 'disconnected')
          setState((prevState) => ({
            ...prevState,
            statusString: 'Disconnected.',
            conversationsReady: false,
            status: 'warning'
          }));
        if (clientState === 'denied')
          setState((prevState) => ({
            ...prevState,
            statusString: 'Failed to connect.',
            conversationsReady: false,
            status: 'error'
          }));
      });
      conversationsClient.on('conversationJoined', (conversation) => {
        setState((prevState) => ({
          ...prevState,
          conversations: [...state.conversations, conversation]
        }));
      });
      conversationsClient.on('conversationLeft', (conversation) => {
        setState((prevState) => ({
          ...prevState,
          conversations: [
            ...prevState.conversations.filter((it) => it !== conversation)
          ]
        }));
      });
    };

    initClient();
  }, [conversationsClient]);

  const [contacts, setContacts] = useState<User[]>([]);
  useEffect(() => {
    if (!currUser || !authToken) return;
    const fetchContactsData = async () => {
      const response = await fetch(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (currUser.role == 'coach') {
        setContacts(
          data.filter((user: User) => {
            return (
              user.coachId === state.identity ||
              (user.role != 'client' && user.userId != state.identity)
            );
          })
        );
      } else if (currUser.role == 'owner') {
        setContacts(data.filter((user: User) => user.userId != state.identity));
      }
    };

    fetchContactsData();
  }, [state.identity, currUser, authToken]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [conversationContent, setConversationContent] = useState<
    Paginator<Message> | undefined
  >(undefined);

  useEffect(() => {
    const fetchContent = async () => {
      const messagePaginator = await selectedConversation?.getMessages();
      setConversationContent(messagePaginator);
    };
    fetchContent();
  }, [selectedConversation]);

  // relies on the property that we only have one conversation between any two users
  const handleSelectConversation = async (uid: string) => {
    await Promise.all(
      state.conversations.map(async (conversation) => {
        // filters for conversations with uid as participant
        return (await hasParticipant(conversation, uid)) ? conversation : null;
      })
    ).then((conversations) =>
      setSelectedConversation(conversations.filter(Boolean)[0])
    );
    const response = await fetch(`${API_URL}/users/${uid}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    setSelectedUser(data);
  };

  const [messageContent, setMessageContent] = useState<string>('');
  const handleChangeMessageContent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMessageContent(event.target.value);
  };

  const handleSubmitMessage = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (messageContent === '') {
      return;
    }
    setMessageContent('');

    await selectedConversation?.sendMessage(messageContent);
    const messagePaginator = await selectedConversation?.getMessages();
    setConversationContent(messagePaginator);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversationContent]);

  if (conversationsClient) {
    return (
      <>
        <Stack
          sx={{
            display: 'flex',
            height: '90vh',
            width: '100%',
            overflow: 'hidden'
          }}>
          <Box
            sx={{
              display: 'flex',
              height: '90%',
              width: '100%',
              border: 2,
              borderRadius: 5,
              boxShadow: 'lg',
              borderColor: colors.silverGrey,
              margin: 'auto'
            }}>
            <List
              sx={{ overflow: 'auto', marginTop: 1, marginBottom: 1 }}
              data-testid="ContactsList">
              {contacts.map((contact) => (
                <ListItem key={contact.userId}>
                  <Button
                    onClick={() => {
                      handleSelectConversation(contact.userId);
                    }}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}>
                    {getName(contact)}
                  </Button>
                </ListItem>
              ))}
            </List>
            <Box
              sx={{
                width: '80%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
              <Typography
                variant="outlined"
                level="title-lg"
                sx={{
                  margin: 1,
                  padding: 1,
                  borderRadius: 5
                }}>
                {!selectedUser
                  ? 'Please select a User to view Conversation'
                  : !selectedConversation
                    ? 'No Pre-existing Conversation with ' +
                      getName(selectedUser)
                    : getName(selectedUser)}
              </Typography>
              <List
                sx={{ overflow: 'auto' }}
                data-testid="MessagesList">
                {conversationContent?.items.map((message) => (
                  <ListItem
                    key={message.index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems:
                        message.author === state.identity
                          ? 'flex-end'
                          : 'flex-start'
                    }}>
                    <Box
                      sx={{
                        padding: 2,
                        border: 1,
                        borderRadius: 5,
                        backgroundColor:
                          message.author === state.identity
                            ? 'primary.main'
                            : 'grey.300',
                        borderColor:
                          message.author === state.identity
                            ? colors.skyBlue
                            : colors.paleOrange,
                        maxWidth: '80%',
                        wordWrap: 'break-word'
                      }}>
                      <Typography sx={{ color: colors.textGray }}>
                        {readableDate(message.dateUpdated)}
                      </Typography>
                      <Typography>{message.body}</Typography>
                    </Box>
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
              <Box
                sx={{
                  marginTop: 'auto',
                  marginBottom: 1,
                  width: '100%'
                }}>
                <form
                  onSubmit={handleSubmitMessage}
                  data-testid="MessageForm">
                  <Input
                    sx={{
                      width: '100%'
                    }}
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={handleChangeMessageContent}
                    endDecorator={
                      <Button
                        type="submit"
                        variant="plain">
                        <SendIcon />
                      </Button>
                    }
                  />
                </form>
              </Box>
            </Box>
          </Box>
          <ConversationAdder conversationsClient={conversationsClient} />
        </Stack>
      </>
    );
  } else {
    return <h1>Twilio Conversations client failed to initialize!</h1>;
  }
}
