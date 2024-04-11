import { useEffect, useState } from 'react';
import {
  Conversation,
  Message,
  Paginator,
  Client as ConversationsClient
} from '@twilio/conversations';
import { GetUserInfo } from '../components/auth';
import ConversationAdder from '../components/ConversationAdder';
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
  useEffect(() => {
  useEffect(() => {
    if (authToken === '') {
      return;
    }
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
    if (!state.token) {
      return;
    }
    const initClient = () => {
      setConversationsClient(new ConversationsClient(state.token));
      if (!conversationsClient) {
        return;
      }
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
    const fetchContent = async () => {
      const content = await selectedConversation?.getMessages();
      setConversationContent(content);
    };
    fetchContent();
  }, [selectedConversation]);

  useEffect(() => {
    setSelectedConversation(state.conversations[0]);
    console.log(state.conversations);
  }, [state.conversations]);

  if (conversationsClient) {
    return (
      <>
        <ConversationAdder conversationsClient={conversationsClient} />
        {conversationContent?.items.map((message) => <div>{message.body}</div>)}
      </>
    );
  }
}
