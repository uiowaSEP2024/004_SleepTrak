import { useParams } from 'react-router-dom';
import BabyDropdown from '../components/BabyDropdown';
import BabyTab from '../components/BabyTab';
import Box from '@mui/system/Box';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import API_URL from '../util/apiURL';
import { UserWithBabies } from '../types/schemaExtensions';
import { getName } from '../util/utils';

export default function BabyDetailsPage() {
  const [clientData, setClientData] = useState<UserWithBabies | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const { userId } = useParams(); // Access the userId from the route parameters

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getAccessTokenSilently();

      const clientResponse = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const clientDataJson = await clientResponse.json();
      setClientData(clientDataJson);
    };

    fetchUserData();
  }, [getAccessTokenSilently, userId]);

  if (clientData && clientData.first_name && clientData.babies) {
    return (
      <Box>
        <h2>{getName(clientData)}</h2>
        <Box display="flex">
          <BabyDropdown babies={clientData.babies} />
        </Box>
        <BabyTab />
      </Box>
    );
  }
}
