import Box from '@mui/joy/Box';
import ScheduleCreateButton from './ScheduleCreateButton';
import RecommendedSchedule from './RecommendedSchedule';

interface RowData {
  activity: string;
  time: string;
}

const rows: RowData[] = [
  { activity: 'Morning Rise', time: '6:30 AM' },
  { activity: 'Morning Nap', time: '9:15AM - 10:45 AM' },
  { activity: 'Afternoon Nap', time: '2:15PM - 3:45 PM' },
  { activity: 'Get Ready for bed', time: '6:45 PM' },
  { activity: 'Asleep', time: '7:15 PM' }
];

export default function RecommendedSchedules() {
  return (
    <Box sx={{ width: '60%' }}>
      <Box
        display="flex"
        justifyContent="space-between">
        <h2>Recommended Schedule</h2>
        <ScheduleCreateButton />
      </Box>
      <RecommendedSchedule
        name="Schedule 1"
        schedule={rows}
      />
    </Box>
  );
}
