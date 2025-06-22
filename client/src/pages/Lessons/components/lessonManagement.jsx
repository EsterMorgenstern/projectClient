import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Container
} from '@mui/material';
import {
  Cancel,
  Assessment,
  CalendarToday,
  Group
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LessonCancellationManager from './lessonCancell';
import AttendanceReports from '../../Attendance/components/attendanceReports';

const LessonManagement = () => {
  const [cancellationManagerOpen, setCancellationManagerOpen] = useState(false);
  const [attendanceReportsOpen, setAttendanceReportsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}>
        <Container maxWidth="lg" >
          {/* כותרת במרכז */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                background: '#1E3A8A',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              ניהול שיעורים
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748B',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              מרכז הבקרה לניהול השיעורים, נוכחות ודיווחים
            </Typography>
          </Box>

          <Grid container spacing={4} sx={{ direction: 'rtl' }}>
            {/* ביטולי שיעורים */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                component={motion.div}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)'
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  height: '100%',
                  width:'350px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(220, 38, 38, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #DC2626, #EF4444)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                    }}
                  >
                    <Cancel sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                    ביטולי שיעורים
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    נהל ביטולי שיעורים, צפה בסיכומים חודשיים וחשב תשלומים
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setCancellationManagerOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #B91C1C, #DC2626)',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    פתח ניהול ביטולים
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* דוחות נוכחות */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                component={motion.div}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(5, 150, 105, 0.2)'
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(5, 150, 105, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #059669, #10B981)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #059669, #10B981)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(5, 150, 105, 0.3)'
                    }}
                  >
                    <Assessment sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                    דוחות נוכחות
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    צפה בדוחות נוכחות מפורטים לתלמידים וקבוצות
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setAttendanceReportsOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #059669, #10B981)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #047857, #059669)',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 4px 15px rgba(5, 150, 105, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    צפה בדוחות
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* לוח שנה */}
            <Grid item xs={12} md={6} lg={4}>
              <Card
                component={motion.div}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)'
                }}
                transition={{ duration: 0.3 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                    לוח שנה
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                    צפה בלוח השנה של השיעורים והאירועים
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/attendanceCalendar')}
                    sx={{
                      background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                        transform: 'translateY(-2px)'
                      },
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    פתח לוח שנה
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          {/* רכיב ניהול ביטולי שיעורים */}
          <LessonCancellationManager
            open={cancellationManagerOpen}
            onClose={() => setCancellationManagerOpen(false)}
          />

          {/* רכיב דוחות נוכחות */}
          <AttendanceReports
            open={attendanceReportsOpen}
            onClose={() => setAttendanceReportsOpen(false)}
          />
        </Container>
      </Box>
    </motion.div>
  );
};

export default LessonManagement;
