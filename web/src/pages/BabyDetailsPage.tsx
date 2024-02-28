import { useParams } from 'react-router-dom';
import BabyDropdown from '../components/BabyDropdown';
import BabyTab from '../components/BabyTab';
import Box from '@mui/system/Box';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Baby {
  dob: string;
  babyId: string;
  name: string;
  parentId: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  Babies: Baby[];
}

export default function BabyDetailsPage() {
  const [babyData, setBabyData] = useState<Baby | null>(null);
  const [clientData, setClientData] = useState<User | null>(null);

  const { getAccessTokenSilently } = useAuth0();
  const { babyId } = useParams(); // Access the babyId from the route parameters

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();

      const babyResponse = await fetch(
        `http://localhost:3000/babies/${babyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const babyDataJson = await babyResponse.json();
      setBabyData(babyDataJson);

      const parentId = babyDataJson.parentId;
      const clientResponse = await fetch(
        `http://localhost:3000/users/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const clientDataJson = await clientResponse.json();
      setClientData(clientDataJson);
    };

    fetchData();
  }, [getAccessTokenSilently, babyId]);

  if (clientData && clientData.first_name && clientData.Babies && babyData) {
    return (
      <Box>
        <h2>{clientData.first_name + ' ' + clientData.last_name}</h2>
        <Box display="flex">
          <BabyDropdown babies={clientData.Babies} />
        </Box>
        <BabyTab />
      </Box>
    );
  }
}
