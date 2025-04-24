import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
// import CoursesIcon from '@mui/icons-material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {
  EventNote as CoursesIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Box
        sx={{
          padding: 4,
          background: 'linear-gradient(to right, #e0f2fe, #f8fafc)',
          minHeight: '100vh',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#1E3A8A',
            mb: 2,
            fontFamily: 'Heebo, sans-serif',
            textAlign: 'center',
          }}
        >
          ברוכים הבאים למערכת ניהול החוגים
        </Typography>

        <Typography variant="h6" sx={{ color: '#334155', textAlign: 'center', mb: 5 }}>
          מערכת חכמה לניהול תלמידים, מדריכים וחוגים – הכל במקום אחד, בקלות וביעילות
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} component={Link} to="/students">
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: '#ffffff',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transform: 'scale(1.03)',
                },
              }}
            >
              <GroupIcon sx={{ fontSize: 50, color: '#3B82F6' }} />
              <Typography variant="h6" sx={{ mt: 2, color: '#1E3A8A', fontWeight: 'bold' }}>
                ניהול תלמידים
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                הוספה, עריכה ומחיקה של תלמידים, כולל פרטים אישיים ומעקב.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} component={Link} to="/instructors">
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: '#ffffff',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transform: 'scale(1.03)',
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 50, color: '#10B981' }} />
              <Typography variant="h6" sx={{ mt: 2, color: '#1E3A8A', fontWeight: 'bold' }}>
                ניהול מדריכים
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                שמירה על פרטי מדריכים, שיבוץ, וניהול קל של הצוות.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={Link} to="/courses"
          >
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: '#ffffff',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transform: 'scale(1.03)',
                },
              }}
            >
              <CoursesIcon sx={{ fontSize: 50, color: '#10B981' }} />
              <Typography variant="h6" sx={{ mt: 2, color: '#1E3A8A', fontWeight: 'bold' }}>
                ניהול חוגים
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                פרטי החוגים, שיבוץ, וניהול קל  .
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} component={Link} to="/entrollStudent"
          >
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: 3,
                textAlign: 'center',
                background: '#ffffff',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transform: 'scale(1.03)',
                },
              }}
            >
              <EventAvailableIcon sx={{ fontSize: 50, color: '#F59E0B' }} />
              <Typography variant="h6" sx={{ mt: 2, color: '#1E3A8A', fontWeight: 'bold' }}>
                שיבוץ לחוגים
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B' }}>
                כלי חכם לשיבוץ תלמידים לחוגים בהתאמה אישית ויעילה.
              </Typography>
            </Paper>

          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#1E3A8A',
              borderRadius: '30px',
              px: 5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: '#3B82F6',
              },
            }}

          >
            התחל בניהול המערכת
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Home;
