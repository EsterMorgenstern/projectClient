import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button,
  Box, Typography, TableContainer, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Avatar, Divider,
  Card, CardContent, Grid, IconButton, Fade, Slide
} from '@mui/material';
import {
  Add, Check as CheckIcon, Close as CloseIcon, 
  School as CourseIcon, Info as InfoIcon, Person as PersonIcon,
  Schedule as ScheduleIcon, LocationOn as LocationIcon,
  Group as GroupIcon, CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon, AccountCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StudentCoursesDialog = ({ 
  open, 
  onClose, 
  student, 
  studentCourses = [], 
  showAddButton = true,
  title = null,
  subtitle = null
}) => {
  const navigate = useNavigate();

  // אם אין תלמיד נבחר, לא להציג כלום
  if (!student) return null;

  const dialogTitle = title || `החוגים של ${student.firstName} ${student.lastName}`;
  const dialogSubtitle = subtitle || `ת"ז: ${student.id}`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xl"
          fullWidth
          sx={{
            direction: 'rtl',
            '& .MuiDialog-paper': {
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              maxWidth: '1200px',
              width: '95vw',
              maxHeight: '90vh',
            },
          }}
          TransitionComponent={Slide}
          TransitionProps={{
            direction: 'up',
            timeout: 400
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header מעוצב */}
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: 0,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  opacity: 0.3
                }}
              />
              
              <Box sx={{ 
                position: 'relative', 
                zIndex: 1, 
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        mb: 0.5
                      }}
                    >
                      {dialogTitle}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        opacity: 0.9,
                        fontSize: '1.1rem'
                      }}
                    >
                      {dialogSubtitle}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {showAddButton && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => {
                        navigate('/entrollStudent');
                        onClose();
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        borderRadius: '25px',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 16px rgba(79, 172, 254, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #43a3f5 0%, #00e8f5 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 20px rgba(79, 172, 254, 0.5)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      הוסף חוג חדש
                    </Button>
                  )}
                  
                  <IconButton
                    onClick={onClose}
                    sx={{
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'rotate(90deg)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, background: '#f8fafc' }}>
              {studentCourses && studentCourses.length > 0 ? (
                <Box sx={{ p: 3 }}>
                  {/* סטטיסטיקות מהירות */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: '15px',
                          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CourseIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {studentCourses.length}
                            </Typography>
                            <Typography variant="body2">
                              חוגים רשומים
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                          color: '#8b4513',
                          borderRadius: '15px',
                          boxShadow: '0 8px 16px rgba(252, 182, 159, 0.3)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <CheckIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {studentCourses.filter(c => c.isActive).length}
                            </Typography>
                            <Typography variant="body2">
                              חוגים פעילים
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Card sx={{ 
                          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                          color: '#2d3748',
                          borderRadius: '15px',
                          boxShadow: '0 8px 16px rgba(168, 237, 234, 0.3)'
                        }}>
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <LocationIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">
                              {new Set(studentCourses.map(c => c.branchName)).size}
                            </Typography>
                            <Typography variant="body2">
                              סניפים שונים
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </motion.div>

                  {/* טבלת החוגים המעוצבת */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card sx={{ 
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      background: 'white'
                    }}>
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: 2,
                        textAlign: 'center'
                      }}>
                        <Typography variant="h6" fontWeight="bold">
                          פירוט החוגים
                        </Typography>
                      </Box>
                      
                      <TableContainer sx={{ maxHeight: '400px' }}>
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <CourseIcon sx={{ color: '#667eea' }} />
                                  שם החוג
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <GroupIcon sx={{ color: '#667eea' }} />
                                  קבוצה
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <LocationIcon sx={{ color: '#667eea' }} />
                                  סניף
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <PersonIcon sx={{ color: '#667eea' }} />
                                  מדריך
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <ScheduleIcon sx={{ color: '#667eea' }} />
                                  יום ושעה
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <CalendarIcon sx={{ color: '#667eea' }} />
                                  תאריך התחלה
                                </Box>
                              </TableCell>
                              <TableCell 
                                align="right" 
                                sx={{ 
                                  fontWeight: 'bold', 
                                  fontSize: '1rem',
                                  background: '#f8fafc',
                                  borderBottom: '2px solid #e2e8f0'
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                  <AssignmentIcon sx={{ color: '#667eea' }} />
                                  סטטוס
                                </Box>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <AnimatePresence>
                              {studentCourses.map((course, index) => (
                                <motion.tr
                                  key={course.groupStudentId || index}
                                  component={TableRow}
                                  custom={index}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  whileHover={{ 
                                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                    scale: 1.01
                                  }}
                                  transition={{ duration: 0.2 }}
                                  sx={{
                                    cursor: 'pointer',
                                    '&:nth-of-type(even)': { 
                                      backgroundColor: 'rgba(248, 250, 252, 0.8)' 
                                    },
                                    '&:hover': {
                                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                                    },
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'flex-end', 
                                      gap: 2 
                                    }}>
                                      <Box sx={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '50%',
                                        p: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                        <CourseIcon sx={{ color: 'white', fontSize: 20 }} />
                                      </Box>
                                      <Typography 
                                        sx={{ 
                                          fontWeight: 'bold',
                                          fontSize: '1.1rem',
                                          color: '#2d3748'
                                        }}
                                      >
                                        {course.courseName}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Chip
                                      label={course.groupName}
                                      sx={{
                                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                        color: '#8b4513',
                                        fontWeight: 'bold',
                                        borderRadius: '15px'
                                      }}
                                    />
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                      <LocationIcon sx={{ color: '#667eea', fontSize: 18 }} />
                                      <Typography sx={{ fontWeight: 'medium' }}>
                                        {course.branchName}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                      <Avatar sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                        color: '#2d3748',
                                        fontSize: '0.8rem'
                                      }}>
                                        {course.instructorName?.charAt(0)}
                                      </Avatar>
                                      <Typography sx={{ fontWeight: 'medium' }}>
                                        {course.instructorName}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Box sx={{ 
                                      background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                                      borderRadius: '10px',
                                      p: 1,
                                      textAlign: 'center'
                                    }}>
                                      <Typography sx={{ 
                                        fontWeight: 'bold',
                                        color: '#3730a3',
                                        fontSize: '0.9rem'
                                      }}>
                                        {course.dayOfWeek}
                                      </Typography>
                                      <Typography sx={{ 
                                        fontSize: '0.8rem',
                                        color: '#5b21b6'
                                      }}>
                                        {course.hour}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Typography sx={{ 
                                      fontWeight: 'medium',
                                      color: '#4a5568'
                                    }}>
                                      {course.enrollmentDate}
                                    </Typography>
                                  </TableCell>
                                  
                                  <TableCell align="right" sx={{ py: 2 }}>
                                    <Chip
                                      icon={course.isActive === true ? <CheckIcon /> : <CloseIcon />}
                                      label={course.isActive ? 'פעיל' : 'לא פעיל'}
                                      color={course.isActive === true ? "success" : "error"}
                                      variant="outlined"
                                      sx={{
                                        fontWeight: 'bold',
                                        borderWidth: '2px',
                                        '&.MuiChip-colorSuccess': {
                                          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                          borderColor: '#10b981',
                                          color: '#065f46'
                                        },
                                        '&.MuiChip-colorError': {
                                          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                          borderColor: '#ef4444',
                                          color: '#991b1b'
                                        }
                                      }}
                                    />
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Card>
                  </motion.div>
                </Box>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 8,
                      px: 4
                    }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Box sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                      }}>
                        <InfoIcon sx={{ fontSize: 60, color: 'white' }} />
                      </Box>
                    </motion.div>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#2d3748',
                        mb: 2,
                        textAlign: 'center'
                      }}
                    >
                      אין חוגים רשומים לתלמיד זה
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#718096',
                        textAlign: 'center',
                        mb: 4,
                        maxWidth: '400px'
                      }}
                    >
                      התלמיד עדיין לא רשום לאף חוג. ניתן לרשום אותו לחוגים חדשים דרך כפתור "הוסף חוג חדש"
                    </Typography>

                    {showAddButton && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => {
                          navigate('/entrollStudent');
                          onClose();
                        }}
                        sx={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          borderRadius: '25px',
                          px: 4,
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          boxShadow: '0 8px 16px rgba(79, 172, 254, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #43a3f5 0%, #00e8f5 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 20px rgba(79, 172, 254, 0.5)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        הוסף חוג ראשון
                      </Button>
                    )}
                  </Box>
                </motion.div>
              )}
            </DialogContent>

            <Divider sx={{ background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />

            <DialogActions sx={{ 
              p: 3, 
              background: 'white',
              justifyContent: 'center',
              gap: 2
            }}>
              <Button
                onClick={onClose}
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderWidth: '2px',
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#5a67d8',
                    background: 'rgba(102, 126, 234, 0.05)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                סגור
              </Button>
            </DialogActions>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default StudentCoursesDialog;
