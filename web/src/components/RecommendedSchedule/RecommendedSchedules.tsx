import Box from '@mui/joy/Box';
import ScheduleCreateButton from './ScheduleCreateButton';
import RecommendedSchedule from './RecommendedSchedule';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function RecommendedSchedules() {
  const [RecommendedSchedules, setRecommendedSchedules] = useState([]);
  const [rerender, setRerender] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleRerender = () => {
    setRerender(!rerender);
  };

  useEffect(() => {
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

    fetchRecommendedSchedules();
  }, [getAccessTokenSilently, rerender]);

  return (
    <Box sx={{ width: '60%' }}>
      <Box
        display="flex"
        justifyContent="space-between">
        <h2>Recommended Schedule</h2>
        <ScheduleCreateButton />
      </Box>
      {RecommendedSchedules.map((schedule, index) => (
        <RecommendedSchedule
          name={'Schedule ' + (index + 1)}
          schedule={schedule}
          onChange={handleRerender}
        />
      ))}
    </Box>
  );
}
