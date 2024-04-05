import { useEffect, useState } from 'react';
import {
  Conversation,
  Message,
  Paginator,
  Client as ConversationsClient
} from '@twilio/conversations';
import { GetUserInfo } from '../components/auth';
import API_URL from '../util/apiURL';
import { useAuth0 } from '@auth0/auth0-react';

interface ConversationsState {
  identity: string;
  token: string;
  status: string;
  statusString: string;
  conversationsReady: boolean;
  conversations: Conversation[];
  selectedConversationSid: string;
  newMessage: string;
}
export default function ChatPage() {
  const [state, setState] = useState<ConversationsState>({
    identity: GetUserInfo()?.sub || '',
    token: '',
    status: '',
    statusString: '',
    conversationsReady: false,
    conversations: [],
    selectedConversationSid: '',
    newMessage: ''
  });

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      const authToken = await getAccessTokenSilently();
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
  }, [state.identity, state.token, getAccessTokenSilently]);

  const setToken = (newToken: string) => {
    setState((prevState) => ({
      ...prevState,
      token: newToken
    }));
  };

  useEffect(() => {
    if (!state.token) {
      return;
    }
    const initClient = () => {
      const conversationsClient = new ConversationsClient(state.token);
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
  }, [state.token, state.conversations]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [conversationContent, setConversationContent] = useState<
    Paginator<Message> | undefined
  >(undefined);

  useEffect(() => {
    console.log('getting messages');
    const fetchContent = async () => {
      const content = await selectedConversation?.getMessages();
      setConversationContent(content);
    };
    fetchContent();
  }, [selectedConversation]);

  useEffect(() => {
    setSelectedConversation(state.conversations[0]);
  }, [state.conversations]);

  return (
    <>
      {conversationContent?.items.map((message) => <div>{message.body}</div>)}
    </>
  );
}
