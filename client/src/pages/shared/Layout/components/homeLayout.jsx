import { Box } from '@mui/material';
import Navbar from '../../../Navbar/navbar.jsx';
import { motion } from 'framer-motion';

export  const HomeLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* תפריט עליון בלבד */}
      <Navbar />
      
      {/* תוכן ראשי ללא רקע ו-padding */}
      <Box sx={{ flex: 1, mt: '62px' }}>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ 
            flex: 1,
            minHeight: 'calc(100vh - 70px)',
            overflowY: 'auto',
            overflowX: 'hidden', // למנוע גלילה אופקית
          }}
        >
          {children}
        </motion.main>
      </Box>
    </Box>
  );
};

export default HomeLayout;
