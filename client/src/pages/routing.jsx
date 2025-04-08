// src/Routing.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import StudentsTable from './studentTable'; 
import  Home  from './home';
import AnimatedTable from '../componentse/AnimatedTable';
// בעתיד ניצור גם עמודי מדריכים, קורסים וכו'

export default function Routing() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          padding: 5,
        }}
      >
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold', mb: 5 }}>
          ניהול חוגים
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" size="large" component={Link} to="/students" sx={{ borderRadius: '20px', fontSize: '20px', padding: '10px 30px' }}>
            ניהול תלמידים
          </Button>

          <Button variant="contained" color="secondary" size="large" disabled sx={{ borderRadius: '20px', fontSize: '20px', padding: '10px 30px' }}>
            ניהול מדריכים
          </Button>

          <Button variant="contained" color="success" size="large" disabled sx={{ borderRadius: '20px', fontSize: '20px', padding: '10px 30px' }}>
            ניהול חוגים
          </Button>

          <Button variant="contained" color="warning" size="large" disabled sx={{ borderRadius: '20px', fontSize: '20px', padding: '10px 30px' }}>
            חוגים פעילים
          </Button>

          <Button variant="contained" color="error" size="large" disabled sx={{ borderRadius: '20px', fontSize: '20px', padding: '10px 30px' }}>
            שיבוץ תלמידים לחוגים
          </Button>
        </Box>

        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentsTable />} />
          {/* בעתיד נוסיף גם ניתובים נוספים */}
        </Routes>
      </Box>
    </Router>
  );
}
