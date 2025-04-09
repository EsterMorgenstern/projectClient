import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
     
      <motion.main
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
        style={{ flex: 1, padding: '30px', background: 'linear-gradient(115deg,rgba(59, 131, 246, 0.83) 0%, #fffcdc 100%)', overflowY: 'auto' }}
      >
        {children}
      </motion.main> <Sidebar />
    </Box>
  );
};

export default Layout;
