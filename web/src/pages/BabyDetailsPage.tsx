import { useParams } from 'react-router-dom';
import BabyDropdown from '../components/BabyDropdown';
import BabyTab from '../components/BabyTab';
import Box from '@mui/system/Box';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export interface Baby {
  dob: string;
  babyId: string;
  name: string;
  parentId: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  babies: Baby[];
}

export default function BabyDetailsPage() {
  const [clientData, setClientData] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const { userId } = useParams(); // Access the userId from the route parameters

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();

      const clientResponse = await fetch(
        `http://localhost:3000/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const clientDataJson = await clientResponse.json();
      setClientData(clientDataJson);
    };

    fetchUserData();
  }, [getAccessTokenSilently]);

  if (clientData && clientData.first_name && clientData.babies) {
    return (
      <Box>
        <h2>{clientData.first_name + ' ' + clientData.last_name}</h2>
        <Box display="flex">
          <BabyDropdown babies={clientData.babies} />
        </Box>
        <BabyTab />
      </Box>
    );
  }
}
