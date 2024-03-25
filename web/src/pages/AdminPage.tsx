import { useAuth0 } from '@auth0/auth0-react';
import CoachCard from '../components/CoachCard';
import Grid from '@mui/joy/Grid';
import Item from '@mui/joy/Grid';
import { useEffect, useState } from 'react';

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
}

function AdminPage() {
  const [usersData, setUsersData] = useState<User[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch('http://localhost:3000/users/all', {
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

  // TODO: filter so that the the page only shows current user's clients
  return (
    <>
      <h2>Coaches</h2>
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
              <Item>
                <CoachCard
                  avatarSrc="testAvatar"
                  title={object.first_name + ' ' + object.last_name}
                />
              </Item>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default AdminPage;
