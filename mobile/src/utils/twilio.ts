import { getAuth0User, getUserCredentials } from './auth';
import {
  type Conversation,
  type Client as ConversationsClient,
  type Paginator
} from '@twilio/conversations';
import { type User } from '@prisma/client';

/**
 * Fetches Twilio token from the server.
 * @returns {Promise<object | boolean>} The user data if successful, otherwise false.
 */
export const fetchTwilioToken = async () => {
  try {
    const user = await getAuth0User();
    const userCredentials = await getUserCredentials();
    if (user && userCredentials) {
      const accessToken = userCredentials.accessToken;

      if (accessToken) {
        const apiResponse = await fetch(
          process.env.EXPO_PUBLIC_API_URL +
            '/twilio/token?identity=' +
            (user as { sub: string }).sub,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const json = await apiResponse.json();
        const twilioToken = json.token;
        return twilioToken;
      }
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
  }
};

export const getPaginatorItems = <T>(paginator: Paginator<T>) => {
  const items: T[] = [];
  items.push(...paginator.items);
  while (paginator.hasNextPage) {
    items.push(...paginator.items);
  }
  return items;
};

export const makeConversation = async (
  conversationsClient: ConversationsClient,
  uid: string
) => {
  const newConversation: Conversation =
    await conversationsClient.createConversation();
  await newConversation.join();
  try {
    await newConversation.add(uid);
  } catch {
    void newConversation.delete();
  }
};

export const hasParticipant = async (
  conversation: Conversation,
  uid: string
) => {
  return (await conversation.getParticipants()).some(
    (participant) => participant.identity === uid
  );
};

export const hasConversationWith = async (
  conversationsClient: ConversationsClient,
  user: User
) => {
  const paginator = await conversationsClient.getSubscribedConversations();
  const conversations: Conversation[] = getPaginatorItems(paginator);
  const participants = (
    await Promise.all(
      conversations.map(
        async (conversation) => await conversation.getParticipants()
      )
    )
  ).flat();
  const hasConversation = participants.some(
    (participant) => participant.identity === user.userId
  );
  return hasConversation;
};
