import { Box, Button } from '@mui/joy';
import { useState } from 'react';
import {
  Conversation,
  Client as ConversationsClient
} from '@twilio/conversations';
import UserSearch from '../components/UserSearch';
import { User } from '@prisma/client';

interface ConversationAdderProps {
  conversationsClient: ConversationsClient;
}

const ConversationAdder: React.FC<ConversationAdderProps> = ({
  conversationsClient
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSearchSelection = (user: User | null) => {
    setSelectedUser(user);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUser) {
      console.log('No user selected');
      return;
    }
    if (await hasConversationWith(selectedUser)) {
      console.log('Already have conversation with user');
      return;
    }
    const newConversation: Conversation =
      await conversationsClient.createConversation();
    await newConversation.join();
    try {
      await newConversation.add(selectedUser.userId);
    } catch {
      console.log(`Failed to add ${selectedUser.userId}`);
      newConversation.delete();
    }
  };

  async function hasConversationWith(user: User) {
    const paginator = await conversationsClient.getSubscribedConversations();
    const conversations: Conversation[] = [];
    conversations.push(...paginator.items);
    while (paginator.hasNextPage) {
      conversations.push(...paginator.items);
    }
    const participants = (
      await Promise.all(
        conversations.map((conversation) => conversation.getParticipants())
      )
    ).flat();
    const hasConversation = participants.some(
      (participant) => participant.identity == user.userId
    );
    return hasConversation;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          alignItems="center">
          <Button
            type="submit"
            variant="soft"
            sx={{ margin: 2 }}>
            Create Conversation with
          </Button>
          <UserSearch onChange={handleUserSearchSelection} />
        </Box>
      </form>
    </>
  );
};

export default ConversationAdder;
