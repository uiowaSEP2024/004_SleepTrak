import { useParams } from 'react-router-dom';
import { Box, Grid, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import CoachCard from '../components/CoachCard';
import API_URL from '../util/apiURL';
import { UserWithBabies } from '../types/schemaExtensions';

export default function AssignPage() {
  const [clientData, setClientData] = useState<UserWithBabies | null>(null);
  const { clientId } = useParams();

  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();

      const clientResponse = await fetch(
        `http://${API_URL}/users/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const clientDataJson = await clientResponse.json();
      setClientData(clientDataJson);
    };

    fetchData();
  }, [getAccessTokenSilently, clientId]);

  const [usersData, setUsersData] = useState<User[]>([]);

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

  // partial application wizardy to get the right function type for onClick
  const handleAssign = (coachId: string | null) => () => {
    const assignCoach = async (coachId: string | null) => {
      const token = await getAccessTokenSilently();

      const response = await fetch(
        `http://${API_URL}/users/${clientId}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            coachId
          })
        }
      );

      const data = await response.json();
      console.log(data);

      navigate('/admin');
    };

    assignCoach(coachId);
  };

  if (clientData && clientData.first_name && clientData.babies) {
    return (
      <Box>
        <h2>
          Reassign {clientData.first_name + ' ' + clientData.last_name} To:
        </h2>
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
                    onClick={handleAssign(object.userId)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'darkred'
                      }
                    }}
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
        <Button
          onClick={handleAssign(null)}
          type="button"
          size="sm"
          variant="soft"
          color="danger"
          sx={{ m: 2 }}>
          Unassign {clientData.first_name + ' ' + clientData.last_name}
        </Button>
      </Box>
    );
  }
}
