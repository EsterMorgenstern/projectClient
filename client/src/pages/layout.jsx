import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar/Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* תפריט עליון */}
      <Navbar />
      
      {/* תוכן ראשי */}
      <Box sx={{ display: 'flex', flex: 1, mt: '70px' }}> {/* mt: margin-top לפצות על גובה התפריט */}
        <motion.main
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{ 
            flex: 1, 
            padding: '30px', 
            background: 'linear-gradient(115deg,rgba(59, 131, 246, 0.83) 0%, #fffcdc 100%)', 
            overflowY: 'auto',
            minHeight: 'calc(100vh - 70px)' // גובה מלא פחות גובה התפריט
          }}
        >
          {children}
        </motion.main>
        
        {/* Sidebar - אם אתה רוצה לשמור עליו */}
        {/* <Sidebar /> */}
      </Box>
    </Box>
  );
};

export default Layout;
