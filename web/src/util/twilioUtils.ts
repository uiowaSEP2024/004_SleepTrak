import {
  Conversation,
  Client as ConversationsClient,
  Paginator
} from '@twilio/conversations';
import { User } from '@prisma/client';

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
    newConversation.delete();
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
      conversations.map((conversation) => conversation.getParticipants())
    )
  ).flat();
  const hasConversation = participants.some(
    (participant) => participant.identity == user.userId
  );
  return hasConversation;
};
