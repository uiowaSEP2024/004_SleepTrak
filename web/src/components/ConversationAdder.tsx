import { Box, Button } from '@mui/joy';
import { useState } from 'react';
import { Client as ConversationsClient } from '@twilio/conversations';
import UserSearch from '../components/UserSearch';
import { User } from '@prisma/client';
import { hasConversationWith, makeConversation } from '../util/twilioUtils';

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
    if (await hasConversationWith(conversationsClient, selectedUser)) {
      console.log('Already have conversation with user');
      return;
    }
    makeConversation(conversationsClient, selectedUser.userId);
  };

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
