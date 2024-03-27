import { useAuth0 } from '@auth0/auth0-react';
import CoachCard from '../components/CoachCard';
import ClientCard from '../components/ClientCard';
import { Grid, Box } from '@mui/joy';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { Button, styled } from '@mui/joy';
import { Link as RouterLink } from 'react-router-dom';
import API_URL from '../util/apiURL';

// prevent the Link styling from overriding the Button highlight color
const Link = styled(RouterLink)`
  &:hover {
    color: inherit;
  }
`;

interface Baby {
  name: string;
  babyId: string;
}

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  role: string;
  babies: Baby[];
  coachId?: string;
  clients: User[];
}

function AdminPage() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data);
      setUsersData(data);
    };

    fetchData();
  }, [getAccessTokenSilently]);

  const [coachOpen, setCoachOpen] = useState(true);

  const handleCoachExpandClick = () => {
    setCoachOpen(!coachOpen);
  };

  const [clientOpen, setClientOpen] = useState(true);

  const handleClientExpandClick = () => {
    setClientOpen(!clientOpen);
  };

  // TODO: filter so that the the page only shows current user's clients
  return (
    <>
      <Box
        onClick={handleCoachExpandClick}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <h2>Coaches</h2>
        <ExpandMoreIcon
          sx={{
            transform: coachOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}
        />
      </Box>
      <Collapse in={coachOpen}>
        <Button
          component={Link}
          to="/coaches/new"
          type="button"
          size="sm"
          variant="soft"
          color="danger"
          sx={{ m: 2 }}>
          Authorize New Coach
        </Button>
        <Grid
          container
          spacing={3}
          sx={{ flexGrow: 1 }}>
          {usersData
            .filter((object) => object.role == 'coach')
            .map((object, index) => (
              <Grid
                xs="auto"
                key={index}>
                <Box>
                  <CoachCard
                    avatarSrc="testAvatar"
                    title={object.first_name + ' ' + object.last_name}
                    coachId={object.userId}
                    numClients={
                      usersData.filter(
                        (client) => client.coachId == object.userId
                      ).length
                    }
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Collapse>

      <Box
        onClick={handleClientExpandClick}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <h2>Unassigned Clients</h2>
        <ExpandMoreIcon
          sx={{
            transform: clientOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s'
          }}
        />
      </Box>
      <Collapse in={clientOpen}>
        <Grid
          container
          spacing={3}
          sx={{ flexGrow: 1 }}>
          {usersData
            .filter((object) => object.role == 'client')
            .filter((object) => !object.coachId)
            .map((object, index) => (
              <Grid
                xs="auto"
                key={index}>
                <Box>
                  <ClientCard
                    avatarSrc="testAvatar"
                    title={object.first_name + ' ' + object.last_name}
                    body={object.babies.map((baby) => baby.name).join(' ')}
                    userId={object.userId || ''}
                    babyId={
                      object.babies.length > 0
                        ? object.babies[0].babyId || ''
                        : ''
                    }
                    adminOptions={true}
                  />
                </Box>
              </Grid>
            ))}
        </Grid>
      </Collapse>
    </>
  );
}

export default AdminPage;
