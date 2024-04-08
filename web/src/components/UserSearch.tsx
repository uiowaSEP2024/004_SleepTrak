import { Autocomplete } from '@mui/joy';
import { useState, useEffect } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';
import { API_URL } from '../util/environment';

export default function UserSearch(handleChange: () => void) {
  const [usersData, setUsersData] = useState<User[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchClientsData = async () => {
      const token = await getAccessTokenSilently();

      const response = await fetch(`http://${API_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setUsersData(data);
    };

    fetchClientsData();
  }, [getAccessTokenSilently]);

  return (
    <Autocomplete
      onChange={handleChange}
      placeholder="Search Users"
      options={usersData.map(
        (user) => user.first_name + ' ' + user.last_name + ' ' + user.email
      )}
    />
  );
}
