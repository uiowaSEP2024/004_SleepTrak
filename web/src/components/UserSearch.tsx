import { Autocomplete } from '@mui/joy';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { API_URL } from '../util/environment';
import { User } from '@prisma/client';
import { getName } from '../util/utils';

interface UserSearchProps {
  onChange: (user: User | null) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onChange }) => {
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

  const handleChange = (_: React.SyntheticEvent, newUser: User | null) => {
    onChange(newUser);
  };

  return (
    <Autocomplete
      onChange={handleChange}
      placeholder="Search Users"
      getOptionLabel={(user) => getName(user) + ' ' + user.email}
      options={usersData}
      data-testid="UserSearch"
    />
  );
};

export default UserSearch;
