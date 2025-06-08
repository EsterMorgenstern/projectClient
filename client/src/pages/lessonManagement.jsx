import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
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
import AttendanceReports from './attendanceManagement/components/attendanceReports'; // יצירת הקומפוננטה

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
      <Box sx={{ p: 3, direction: 'rtl' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A8A', mb: 4 }}>
          ניהול שיעורים
        </Typography>

        <Grid container spacing={3}>
          {/* ביטולי שיעורים */}
          <Grid item xs={12} md={6} lg={4}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Cancel sx={{ fontSize: 60, color: '#DC2626', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ביטולי שיעורים
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  נהל ביטולי שיעורים, צפה בסיכומים חודשיים וחשב תשלומים
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setCancellationManagerOpen(true)}
                  sx={{
                    bgcolor: '#DC2626',
                    '&:hover': { bgcolor: '#B91C1C' },
                    borderRadius: 2,
                    px: 4
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
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <Assessment sx={{ fontSize: 60, color: '#059669', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  דוחות נוכחות
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  צפה בדוחות נוכחות מפורטים לתלמידים וקבוצות
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setAttendanceReportsOpen(true)}
                  sx={{
                    bgcolor: '#059669',
                    '&:hover': { bgcolor: '#047857' },
                    borderRadius: 2,
                    px: 4
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
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                <CalendarToday sx={{ fontSize: 60, color: '#3B82F6', mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  לוח שנה
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  צפה בלוח השנה של השיעורים והאירועים
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/attendance-calendar')}
                  sx={{
                    bgcolor: '#3B82F6',
                    '&:hover': { bgcolor: '#2563EB' },
                    borderRadius: 2,
                    px: 4
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
      </Box>
    </motion.div>
  );
};

export default LessonManagement;