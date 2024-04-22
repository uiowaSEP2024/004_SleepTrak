import { useAuth0 } from '@auth0/auth0-react';
import ClientCard from '../components/ClientCard';
import Grid from '@mui/joy/Grid';
import Item from '@mui/joy/Grid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../util/apiURL';
import { User } from '@prisma/client';
import { UserWithBabies } from '../types/schemaExtensions';

function CoachPage() {
  const [usersData, setUsersData] = useState<UserWithBabies[]>([]);
  const [coachData, setCoachData] = useState<User | null>(null);
  const { coachId } = useParams();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchCoachData = async () => {
      const token = await getAccessTokenSilently();

      const coachResponse = await fetch(`${API_URL}/users/${coachId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const coachDataJson = await coachResponse.json();
      setCoachData(coachDataJson);
    };

    fetchCoachData();
    const fetchUsersData = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log(data);
      setUsersData(data);
    };

    fetchUsersData();
  }, [getAccessTokenSilently, coachId]);

  // TODO: filter so that the the page only shows current user's clients
  return (
    <>
      <h2>
        Clients of {coachData?.first_name} {coachData?.last_name}
      </h2>
      <Grid
        container
        spacing={3}
        sx={{ flexGrow: 1 }}>
        {usersData
          .filter((object) => object.role == 'client')
          .filter((object) => object?.coachId == coachId)
          .map((object, index) => (
            <Grid
              xs="auto"
              key={index}>
              <Item>
                <ClientCard
                  avatarSrc="testAvatar"
                  clientName={object.first_name + ' ' + object.last_name}
                  babyNames={object.babies.map((baby) => baby.name).join(' ')}
                  clientId={object.userId || ''}
                  babyId={
                    object.babies.length > 0
                      ? object.babies[0].babyId || ''
                      : ''
                  }
                  adminOptions={true}
                />
              </Item>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default CoachPage;
