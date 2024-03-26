import { Button, styled } from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom';

interface ClientAdminOptionsProps {
  userId: string;
}

// prevent the Link styling from overriding the Button highlight color
const Link = styled(RouterLink)`
  &:hover {
    color: inherit;
  }
`;

const ClientAdminOptions: React.FC<ClientAdminOptionsProps> = ({ userId }) => {
  return (
    <>
      <Button
        component={Link}
        to={`/clients/${userId}/assign`}
        type="button"
        size="sm"
        variant="soft"
        color="danger"
        sx={{ m: 2 }}>
        Reassign Client
      </Button>
    </>
  );
};

export default ClientAdminOptions;
