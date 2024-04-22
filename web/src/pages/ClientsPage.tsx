import { useAuth0 } from '@auth0/auth0-react';
import ClientCard from '../components/ClientCard';
import Grid from '@mui/joy/Grid';
import Item from '@mui/joy/Grid';
import { useEffect, useState } from 'react';
import API_URL from '../util/apiURL';
import { UserWithBabies } from '../types/schemaExtensions';

function ClientsPage() {
  const [usersData, setUsersData] = useState<UserWithBabies[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchClientsData = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setUsersData(data);
    };

    fetchClientsData();
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
                  clientName={object.first_name + ' ' + object.last_name}
                  babyNames={object.babies.map((baby) => baby.name).join(' ')}
                  clientId={object.userId}
                  babyId={
                    object.babies.length > 0
                      ? object.babies[0].babyId || ''
                      : ''
                  }
                  adminOptions={false}
                />
              </Item>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default ClientsPage;
