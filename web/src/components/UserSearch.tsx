import { Autocomplete } from '@mui/joy';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { API_URL } from '../util/environment';

interface User {
  userId: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
}

export default function UserSearch(onChange: (user: User | null) => void) {
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

  const handleChange = (event: React.SyntheticEvent, newUser: User | null) => {
    onChange(newUser);
  };

  return (
    <Autocomplete
      onChange={handleChange}
      placeholder="Search Users"
      getOptionLabel={(user) =>
        user.first_name + ' ' + user.last_name + ' ' + user.email
      }
      options={usersData}
    />
  );
}
