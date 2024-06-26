import Box from '@mui/joy/Box';
import ScheduleCreateButton from './ScheduleCreateButton';
import RecommendedSchedule from './RecommendedSchedule';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import API_URL from '../../util/apiURL';

export default function RecommendedSchedules() {
  const [RecommendedSchedules, setRecommendedSchedules] = useState([]);
  const { getAccessTokenSilently } = useAuth0();
  const { userId } = useParams(); // TODO: make plan related to babies not clients

  const fetchRecommendedSchedules = async () => {
    const token = await getAccessTokenSilently();

    const searchParams = {
      clientId: userId
    };

    const response = await fetch(`${API_URL}/plans/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(searchParams)
    });

    const data = await response.json();
    setRecommendedSchedules(data);
  };
  useEffect(() => {
    fetchRecommendedSchedules();
  }, [getAccessTokenSilently]);

  return (
    <Box sx={{ width: '60%' }}>
      <Box
        display="flex"
        justifyContent="space-between">
        <h2>Recommended Schedule</h2>
        <ScheduleCreateButton onSubmit={fetchRecommendedSchedules} />
      </Box>
      {!RecommendedSchedules.length ? (
        <h4> This Client Does Not Have a Recommended Schuedule Yet.</h4>
      ) : (
        RecommendedSchedules.map((schedule, index) => (
          <RecommendedSchedule
            name={'Schedule ' + (index + 1)}
            schedule={schedule}
            onChange={fetchRecommendedSchedules}
          />
        ))
      )}
    </Box>
  );
}
