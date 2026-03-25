import { Box } from '@mui/material';
import StudentDetailsPanel from './components/StudentDetailsPanel';

const StudentDetailsPage = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #f8fafc, #eff6ff)',
        minHeight: '100vh',
        py: 3,
        borderRadius: 8
      }}
    >
      <StudentDetailsPanel />
    </Box>
  );
};

export default StudentDetailsPage;
