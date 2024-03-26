import { useAuth0 } from '@auth0/auth0-react';
import ClientCard from '../components/ClientCard';
import Grid from '@mui/joy/Grid';
import Item from '@mui/joy/Grid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API_URL from '../util/apiURL';

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
}

function CoachPage() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [coachData, setCoachData] = useState<User | null>(null);
  const { coachId } = useParams();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchCoachData = async () => {
      const token = await getAccessTokenSilently();

      const coachResponse = await fetch(`http://${API_URL}/users/${coachId}`, {
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

      const response = await fetch(`http://${API_URL}/users/all`, {
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
                  title={object.first_name + ' ' + object.last_name}
                  body={object.babies.map((baby) => baby.name).join(' ')}
                  babyId={
                    object.babies.length > 0
                      ? object.babies[0].babyId || ''
                      : ''
                  }
                />
              </Item>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default CoachPage;
