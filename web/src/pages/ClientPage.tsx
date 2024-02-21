import BabyDropdown from '../components/BabyDropdown';
import BabyTab from '../components/BabyTab';
import Box from '@mui/system/Box';

export default function ClientPage() {
  return (
    <>
      <h2>Client 1</h2>
      <Box display="flex">
        <BabyDropdown />
      </Box>
      <Box display="flex">
        <BabyTab />
      </Box>
    </>
  );
}
