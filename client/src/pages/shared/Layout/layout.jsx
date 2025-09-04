import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './components/navbar';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* תפריט עליון */}
      <Navbar />

      
      {/* תוכן ראשי */}
      <Box sx={{ display: 'flex', flex: 1, mt: '62px' }}> {/* שינוי מ-70px ל-64px */}
        <motion.main
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{ 
            flex: 1, 
            padding: '20px', // שינוי מ-30px ל-20px
            background: 'linear-gradient(115deg,rgba(59, 131, 246, 0.83) 0%, #fffcdc 100%)', 
            overflowY: 'auto',
            minHeight: 'calc(100vh - 64px)' // שינוי מ-70px ל-64px
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
