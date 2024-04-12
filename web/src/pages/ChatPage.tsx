import { useEffect, useState } from 'react';
import {
  Conversation,
  Message,
  Paginator,
  Client as ConversationsClient
} from '@twilio/conversations';
import { GetUserInfo } from '../components/auth';
import { Input, Button, List, ListItem, Box } from '@mui/joy';
import SendIcon from '@mui/icons-material/Send';
import ConversationAdder from '../components/ConversationAdder';
import API_URL from '../util/apiURL';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '@prisma/client';

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
      const response = await fetch(
        `http://${API_URL}/users/${state.identity}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      const data = await response.json();
      setCurrUser(data);
    };
    getCurrUser();
  }, [state.identity, authToken]);

  useEffect(() => {
    if (!authToken) return;
    const getToken = async () => {
      const response = await fetch(
        encodeURI(`http://${API_URL}/twilio/token?identity=${state.identity}`),
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
      console.log(subscribedConversations);
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
    if (!currUser) {
      return;
    }
    const fetchContactsData = async () => {
      const response = await fetch(`http://${API_URL}/users/all`, {
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
        // setContacts(data);
      }
    };

    fetchContactsData();
  }, [state.identity, currUser, authToken]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [conversationContent, setConversationContent] = useState<
    Paginator<Message> | undefined
  >(undefined);

  useEffect(() => {
    const fetchContent = async () => {
      const content = await selectedConversation?.getMessages();
      setConversationContent(content);
    };
    fetchContent();
  }, [selectedConversation]);

  // relies on the property that we only have one conversation between any two users
  const handleSelectConversation = (uid: string) => {
    setSelectedConversation(
      state.conversations.filter(async (conversation) => {
        (await conversation.getParticipants()).some((participant) => {
          participant.identity === uid;
        });
      })[0]
    );
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

    console.log(selectedConversation);
    await selectedConversation?.sendMessage(messageContent);
  };

  if (conversationsClient) {
    return (
      <>
        <ConversationAdder conversationsClient={conversationsClient} />
        <Box sx={{ display: 'flex', height: '80vh' }}>
          <List sx={{ overflow: 'auto' }}>
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
                  {contact.first_name + ' ' + contact.last_name}
                </Button>
              </ListItem>
            ))}
          </List>
          <Box sx={{ width: '80vw' }}>
            <List>
              <ListItem key="header">Conversation</ListItem>
              {conversationContent?.items.map((message) => (
                <ListItem key={message.index}>
                  {message.author + ': ' + message.body}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        {conversationContent?.items.map((message) => <div>{message.body}</div>)}
        <form onSubmit={handleSubmitMessage}>
          <Input
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
      </>
    );
  }
}
