import Box from '@mui/joy/Box';
import ScheduleCreateButton from './ScheduleCreateButton';
import RecommendedSchedule from './RecommendedSchedule';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function RecommendedSchedules() {
  const [RecommendedSchedules, setRecommendedSchedules] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  const fetchRecommendedSchedules = async () => {
    const token = await getAccessTokenSilently();

    const response = await fetch('http://localhost:3000/plans/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
      {RecommendedSchedules.map((schedule, index) => (
        <RecommendedSchedule
          name={'Schedule ' + (index + 1)}
          schedule={schedule}
          onChange={fetchRecommendedSchedules}
        />
      ))}
    </Box>
  );
}
