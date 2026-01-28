
import { Box } from '@mui/material';
import GroupDetailsPanel from './components/GroupDetailsPanel';

const GroupDetailsPage = () => {
  return (
    <Box sx={{
      background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
      minHeight: '100vh',
      py: 4,
      borderRadius: 8
    }}>
      <GroupDetailsPanel />
    </Box>
  );
};

export default GroupDetailsPage;
