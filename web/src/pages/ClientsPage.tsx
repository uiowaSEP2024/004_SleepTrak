import { useAuth0 } from '@auth0/auth0-react';
import ClientCard from '../components/ClientCard';
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
  Babies: Baby[];
}

function ClientsPage() {
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
      setUsersData(data);
    };

    fetchData();
  }, [getAccessTokenSilently]);

  // TODO: filter so that the the page only shows current user's clients
  return (
    <>
      <h2>Clients</h2>
      <Grid
        container
        spacing={3}
        sx={{ flexGrow: 1 }}>
        {usersData
          .filter((object) => object.role == 'client')
          .map((object, index) => (
            <Grid
              xs="auto"
              key={index}>
              <Item>
                <ClientCard
                  avatarSrc="testAvatar"
                  title={object.first_name + ' ' + object.last_name}
                  body={object.Babies.map((baby) => baby.name).join(' ')}
                  babyId={
                    object.Babies.length > 0
                      ? object.Babies[0].babyId || ''
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

export default ClientsPage;
