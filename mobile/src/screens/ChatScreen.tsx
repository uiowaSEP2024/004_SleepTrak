import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { type User } from 'react-native-auth0';
import { fetchUserData, fetchCoachData } from '../utils/db';
import {
  fetchTwilioToken,
  getPaginatorItems,
  hasParticipant
} from '../utils/twilio';
import {
  type Conversation,
  type Message,
  type Paginator,
  Client as ConversationsClient
} from '@twilio/conversations';
import { getAuth0User } from '../utils/auth';

interface ConversationsState {
  identity: string;
  token: string;
  status: string;
  statusString: string;
  conversationsReady: boolean;
  conversations: Conversation[];
  selectedConversationSid: string;
}

function ChatScreen() {
  const [state, setState] = useState<ConversationsState>({
    identity: '',
    token: '',
    status: '',
    statusString: '',
    conversationsReady: false,
    conversations: [],
    selectedConversationSid: ''
  });

  const [conversationsClient, setConversationsClient] =
    useState<ConversationsClient | null>(null);

  const [currUser, setCurrUser] = useState<User | null>(null);
  useEffect(() => {
    const getCurrUser = async () => {
      const data = await fetchUserData();
      const user = await getAuth0User();
      setCurrUser(data);
      setState((prevState) => ({
        ...prevState,
        identity: (user as { sub: string }).sub
      }));
    };
    void getCurrUser();
  }, [state.identity]);

  useEffect(() => {
    const getToken = async () => {
      const token = await fetchTwilioToken();
      setToken(token);
    };
    void getToken();
  }, [state.identity, state.token]);

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

    void initClient();
  }, [conversationsClient]);

  const [contact, setContact] = useState<User | undefined>(undefined);
  useEffect(() => {
    if (!currUser) return;
    const fetchContactData = async () => {
      const coachData = await fetchCoachData();
      setContact(coachData);
    };

    void fetchContactData();
  }, [state.identity, currUser]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [conversationContent, setConversationContent] = useState<
    Paginator<Message> | undefined
  >(undefined);

  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedConversation) return; // Ensure selected conversation is set
      const messagePaginator = await selectedConversation.getMessages();
      setConversationContent(messagePaginator);
    };

    const handleSelectConversation = async () => {
      const conversations = await Promise.all(
        state.conversations.map(async (conversation) => {
          return (await hasParticipant(conversation, contact?.userId))
            ? conversation
            : null;
        })
      );
      const selected = conversations.filter(Boolean)[0];
      setSelectedConversation(selected);
      if (selected) {
        await fetchContent(); // Fetch content after setting selected conversation
      }
    };

    const conversationInit = async () => {
      await handleSelectConversation();
    };
    void conversationInit();
  }, [selectedConversation, contact, state.conversations]);

  // Update conversation content when a new message is added
  useEffect(() => {
    const updateMessages = async () => {
      if (selectedConversation) {
        selectedConversation.on('messageAdded', (message) => {
          console.log(message);
          setConversationContent((prevContent) => {
            if (!prevContent) {
              return;
            }
            // Check if the message already exists in the conversation content
            if (!prevContent.items.find((item) => item.sid === message.sid)) {
              return { ...prevContent, items: [...prevContent.items, message] };
            }
            // If the message already exists, return the previous content without changes
            return prevContent;
          });
        });
      }
    };

    void updateMessages();
  }, [selectedConversation]);

  const [messageContent, setMessageContent] = useState<string>('');
  const handleChangeMessageContent = (input: string) => {
    setMessageContent(input);
  };

  const onSubmitInput = () => {
    const handleSubmitMessage = async () => {
      if (messageContent === '') {
        return;
      }
      setMessageContent('');

      await selectedConversation?.sendMessage(messageContent);
      const messagePaginator = await selectedConversation?.getMessages();
      setConversationContent(messagePaginator);
    };

    void handleSubmitMessage();
  };

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  });

  if (conversationsClient) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Chat</Text>
        </View>
        <View style={styles.chatContainer}>
          {conversationContent && scrollViewRef ? (
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              style={styles.scrollView}>
              {conversationContent.items.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.message,
                    {
                      backgroundColor:
                        message.author === state.identity
                          ? 'lightblue'
                          : 'lightgreen',
                      alignSelf:
                        message.author === state.identity
                          ? 'flex-end'
                          : 'flex-start'
                    }
                  ]}>
                  <Text style={styles.messageText}>
                    {message.body?.toString()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text>Loading…</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={messageContent}
            onChangeText={handleChangeMessageContent}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={onSubmitInput}
            style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return <Text>Twilio Conversations client failed to initialize!</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  chatContainer: {
    flex: 1,
    padding: 16
  },
  scrollView: {
    flex: 1
  },
  message: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 4
  },
  messageText: {
    fontSize: 16
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9'
  },
  textInput: {
    flex: 1,
    marginRight: 16,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'blue'
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default ChatScreen;
