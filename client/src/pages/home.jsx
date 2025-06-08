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

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Paper,
//   Avatar,
//   Chip,
//   IconButton,
//   Divider,
//   LinearProgress,
//   Badge
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as StudentsIcon,
//   School as CoursesIcon,
//   Group as GroupsIcon,
//   Person as InstructorsIcon,
//   LocationOn as BranchesIcon,
//   Assignment as EnrollIcon,
//   Assessment as ReportsIcon,
//   Today as TodayIcon,
//   CalendarMonth as CalendarIcon,
//   TrendingUp as StatsIcon,
//   Notifications as NotificationsIcon,
//   Schedule as ScheduleIcon,
//   CheckCircle as AttendanceIcon,
//   Add as AddIcon,
//   ArrowForward as ArrowIcon
// } from '@mui/icons-material';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchStudents } from '../store/student/studentGetAllThunk';
// import { fetchCourses } from '../store/course/CoursesGetAllThunk';
// import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';

// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   // Redux state
//   const students = useSelector(state => state.students.students || []);
//   const courses = useSelector(state => state.courses.courses || []);
//   const instructors = useSelector(state => state.instructors.instructors || []);

//   // Local state
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [todayStats, setTodayStats] = useState({
//     totalLessons: 8,
//     completedLessons: 5,
//     attendanceRate: 87,
//     activeStudents: 156
//   });

//   useEffect(() => {
//     // טעינת נתונים בסיסיים
//     dispatch(fetchStudents());
//     dispatch(fetchCourses());
//     dispatch(fetchInstructors());

//     // עדכון שעה כל דקה
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     return () => clearInterval(timer);
//   }, [dispatch]);

//   // נתונים סטטיסטיים
//   const stats = [
//     {
//       title: 'סה״כ תלמידים',
//       value: students.length,
//       icon: StudentsIcon,
//       color: '#3B82F6',
//       gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
//       change: '+12%',
//       changeType: 'positive'
//     },
//     {
//       title: 'חוגים פעילים',
//       value: courses.length,
//       icon: CoursesIcon,
//       color: '#10B981',
//       gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
//       change: '+5%',
//       changeType: 'positive'
//     },
//     {
//       title: 'מדריכים',
//       value: instructors.length,
//       icon: InstructorsIcon,
//       color: '#F59E0B',
//       gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
//       change: '+2%',
//       changeType: 'positive'
//     },
//     {
//       title: 'אחוז נוכחות היום',
//       value: `${todayStats.attendanceRate}%`,
//       icon: AttendanceIcon,
//       color: '#8B5CF6',
//       gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
//       change: '+3%',
//       changeType: 'positive'
//     }
//   ];

//   // תפריט ראשי
//   const mainMenuItems = [
//     {
//       title: 'ניהול תלמידים',
//       description: 'הוספה, עריכה וצפיה בפרטי תלמידים',
//       icon: StudentsIcon,
//       path: '/students',
//       color: '#3B82F6',
//       gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
//     },
//     {
//       title: 'ניהול חוגים',
//       description: 'ניהול חוגים, קבוצות וסניפים',
//       icon: CoursesIcon,
//       path: '/courses',
//       color: '#10B981',
//       gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
//     },
//     {
//       title: 'ניהול מדריכים',
//       description: 'הוספה ועריכת פרטי מדריכים',
//       icon: InstructorsIcon,
//       path: '/instructors',
//       color: '#F59E0B',
//       gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
//     },
//     {
//       title: 'שיבוץ תלמידים',
//       description: 'רישום תלמידים לחוגים וקבוצות',
//       icon: EnrollIcon,
//       path: '/entrollStudent',
//       color: '#EF4444',
//       gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
//     },
//     {
//       title: 'ניהול נוכחות',
//       description: 'רישום נוכחות ומעקב אחר השתתפות',
//       icon: TodayIcon,
//       path: '/attendance',
//       color: '#8B5CF6',
//       gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
//     },
//     {
//       title: 'דוחות וסטטיסטיקות',
//       description: 'דוחות מפורטים ואנליטיקה',
//       icon: ReportsIcon,
//       path: '/reports',
//       color: '#06B6D4',
//       gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
//     }
//   ];

//   // פעולות מהירות
//   const quickActions = [
//     {
//       title: 'הוסף תלמיד חדש',
//       icon: AddIcon,
//       action: () => navigate('/students'),
//       color: '#3B82F6'
//     },
//     {
//       title: 'שבץ תלמיד לחוג',
//       icon: EnrollIcon,
//       action: () => navigate('/entrollStudent'),
//       color: '#10B981'
//     },
//     {
//       title: 'רשום נוכחות',
//       icon: AttendanceIcon,
//       action: () => navigate('/attendance'),
//       color: '#F59E0B'
//     },
//     {
//       title: 'צפה בדוחות',
//       icon: ReportsIcon,
//       action: () => navigate('/reports'),
//       color: '#8B5CF6'
//     }
//   ];

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         duration: 0.5
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5 }
//     }
//   };

//   return (
//     <Box sx={{ p: 3, direction: 'rtl', minHeight: '100vh', bgcolor: '#f8fafc' }}>
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants}>
//           <Box sx={{ mb: 4 }}>
//             <Typography 
//               variant="h3" 
//               fontWeight="bold" 
//               sx={{
//                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 color: 'transparent',
//                 mb: 1
//               }}
//             >
//               ברוכים הבאים למערכת ניהול החוגים
//             </Typography>
//             <Typography variant="h6" color="text.secondary">
//               {currentTime.toLocaleDateString('he-IL', { 
//                 weekday: 'long', 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })} • {currentTime.toLocaleTimeString('he-IL', { 
//                 hour: '2-digit', 
//                 minute: '2-digit' 
//               })}
//             </Typography>
//           </Box>
//         </motion.div>

//         {/* Statistics Cards */}
//         <motion.div variants={itemVariants} >
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             {stats.map((stat, index) => (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <motion.div
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Card
//                     sx={{
//                       background: stat.gradient,
//                       color: 'white',
//                       borderRadius: '16px',
//                       overflow: 'hidden',
//                       position: 'relative',
//                       '&::before': {
//                         content: '""',
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//                         opacity: 0.3
//                       }
//                     }}
//                   >
//                     <CardContent sx={{ position: 'relative', zIndex: 1 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                         <stat.icon sx={{ fontSize: 40 }} />
//                         <Chip
//                           label={stat.change}
//                           size="small"
//                           sx={{
//                             bgcolor: 'rgba(255, 255, 255, 0.2)',
//                             color: 'white',
//                             fontWeight: 'bold'
//                           }}
//                         />
//                       </Box>
//                       <Typography variant="h4" fontWeight="bold" gutterBottom>
//                         {stat.value}
//                       </Typography>
//                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                         {stat.title}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}

           
//           </Grid>
//         </motion.div>

//         {/* Today's Overview */}
//         <motion.div variants={itemVariants}>
//           <Grid container spacing={3} sx={{ mb: 4 }}>
//             {/* Today's Lessons Progress */}
//             <Grid item xs={12} md={8}>
//               <Card sx={{ borderRadius: '16px', height: '100%' }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <TodayIcon sx={{ color: '#3B82F6', mr: 2 }} />
//                     <Typography variant="h6" fontWeight="bold">
//                       סקירת היום
//                     </Typography>
//                   </Box>
                  
//                   <Grid container spacing={3}>
//                     <Grid item xs={6}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" fontWeight="bold" color="#10B981">
//                           {todayStats.completedLessons}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           שיעורים שהסתיימו
//                         </Typography>
//                       </Box>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="h4" fontWeight="bold" color="#F59E0B">
//                           {todayStats.totalLessons - todayStats.completedLessons}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           שיעורים נותרים
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   </Grid>

//                   <Box sx={{ mt: 3 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         התקדמות יומית
//                       </Typography>
//                       <Typography variant="body2" fontWeight="bold">
//                         {Math.round((todayStats.completedLessons / todayStats.totalLessons) * 100)}%
//                       </Typography>
//                     </Box>
//                     <LinearProgress
//                       variant="determinate"
//                       value={(todayStats.completedLessons / todayStats.totalLessons) * 100}
//                       sx={{
//                         height: 8,
//                         borderRadius: 4,
//                         bgcolor: '#E5E7EB',
//                         '& .MuiLinearProgress-bar': {
//                           background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
//                           borderRadius: 4
//                         }
//                       }}
//                     />
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Quick Stats */}
//             <Grid item xs={12} md={4}>
//               <Card sx={{ borderRadius: '16px', height: '100%' }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <StatsIcon sx={{ color: '#8B5CF6', mr: 2 }} />
//                     <Typography variant="h6" fontWeight="bold">
//                       סטטיסטיקות מהירות
//                     </Typography>
//                   </Box>
                  
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         תלמידים פעילים היום
//                       </Typography>
//                       <Typography variant="h6" fontWeight="bold" color="#3B82F6">
//                         {todayStats.activeStudents}
//                       </Typography>
//                     </Box>
                    
//                     <Divider />
                    
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         אחוז נוכחות ממוצע
//                       </Typography>
//                       <Chip
//                         label={`${todayStats.attendanceRate}%`}
//                         color="success"
//                         size="small"
//                         sx={{ fontWeight: 'bold' }}
//                       />
//                     </Box>
                    
//                     <Divider />
                    
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography variant="body2" color="text.secondary">
//                         שיעורים מתוכננים מחר
//                       </Typography>
//                       <Typography variant="h6" fontWeight="bold" color="#F59E0B">
//                         12
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </motion.div>

//         {/* Quick Actions */}
//         <motion.div variants={itemVariants}>
//           <Card sx={{ borderRadius: '16px', mb: 4 }}>
//             <CardContent sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                 <ScheduleIcon sx={{ color: '#EF4444', mr: 2 }} />
//                 <Typography variant="h6" fontWeight="bold">
//                   פעולות מהירות
//                 </Typography>
//               </Box>
              
//               <Grid container spacing={2}>
//                 {quickActions.map((action, index) => (
//                   <Grid item xs={12} sm={6} md={3} key={index}>
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button
//                         fullWidth
//                         variant="outlined"
//                         startIcon={<action.icon />}
//                         onClick={action.action}
//                         sx={{
//                           borderRadius: '12px',
//                           py: 2,
//                           borderColor: action.color,
//                           color: action.color,
//                           '&:hover': {
//                             borderColor: action.color,
//                             bgcolor: `${action.color}15`,
//                             transform: 'translateY(-2px)',
//                             boxShadow: `0 8px 16px ${action.color}30`
//                           },
//                           transition: 'all 0.3s ease'
//                         }}
//                       >
//                         {action.title}
//                       </Button>
//                     </motion.div>
//                   </Grid>
//                 ))}
//               </Grid>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Main Menu */}
//         <motion.div variants={itemVariants}>
//           <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#374151' }}>
//             תפריט ראשי
//           </Typography>
          
//           <Grid container spacing={3}>
//             {mainMenuItems.map((item, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <motion.div
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.97 }}
//                 >
//                   <Card
//                     sx={{
//                       borderRadius: '16px',
//                       cursor: 'pointer',
//                       height: '200px',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       background: 'white',
//                       border: '1px solid #E5E7EB',
//                       transition: 'all 0.3s ease',
//                       '&:hover': {
//                         boxShadow: `0 10px 25px ${item.color}30`,
//                         transform: 'translateY(-5px)',
//                         borderColor: item.color
//                       }
//                     }}
//                     onClick={() => navigate(item.path)}
//                   >
//                     {/* Background Pattern */}
//                     <Box
//                       sx={{
//                         position: 'absolute',
//                         top: 0,
//                         right: 0,
//                         width: '100px',
//                         height: '100px',
//                         background: item.gradient,
//                         borderRadius: '50%',
//                         transform: 'translate(30px, -30px)',
//                         opacity: 0.1
//                       }}
//                     />
                    
//                     <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                       <Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                           <Avatar
//                             sx={{
//                               background: item.gradient,
//                               width: 50,
//                               height: 50,
//                               mr: 2
//                             }}
//                           >
//                             <item.icon sx={{ fontSize: 28 }} />
//                           </Avatar>
//                           <Typography variant="h6" fontWeight="bold" color="#374151">
//                             {item.title}
//                           </Typography>
//                         </Box>
                        
//                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                           {item.description}
//                         </Typography>
//                       </Box>
                      
//                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             color: item.color,
//                             bgcolor: `${item.color}15`,
//                             '&:hover': {
//                               bgcolor: `${item.color}25`,
//                               transform: 'translateX(-5px)'
//                             },
//                             transition: 'all 0.3s ease'
//                           }}
//                         >
//                           <ArrowIcon />
//                         </IconButton>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </motion.div>

//         {/* Calendar and Notifications Section */}
//         <motion.div variants={itemVariants}>
//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             {/* Upcoming Events */}
//             <Grid item xs={12} md={6}>
//               <Card sx={{ borderRadius: '16px' }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <CalendarIcon sx={{ color: '#06B6D4', mr: 2 }} />
//                     <Typography variant="h6" fontWeight="bold">
//                       אירועים קרובים
//                     </Typography>
//                   </Box>
                  
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#F0F9FF', border: '1px solid #E0F2FE' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#0369A1">
//                         מחר • 14:00
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         שיעור יוגה לילדים - קבוצה א'
//                       </Typography>
//                     </Paper>
                    
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#059669">
//                         יום רביעי • 16:30
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         חוג ציור - קבוצה מתקדמים
//                       </Typography>
//                     </Paper>
                    
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#FEF3F2', border: '1px solid #FECACA' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#DC2626">
//                         יום חמישי • 10:00
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         פגישת הורים - חוג מוזיקה
//                       </Typography>
//                     </Paper>
//                   </Box>
                  
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     sx={{ mt: 3, borderRadius: '12px' }}
//                     onClick={() => navigate('/calendar')}
//                   >
//                     צפה בלוח השנה המלא
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Notifications */}
//             <Grid item xs={12} md={6}>
//               <Card sx={{ borderRadius: '16px' }}>
//                 <CardContent sx={{ p: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//                     <Badge badgeContent={3} color="error">
//                       <NotificationsIcon sx={{ color: '#F59E0B', mr: 2 }} />
//                     </Badge>
//                     <Typography variant="h6" fontWeight="bold">
//                       התראות ועדכונים
//                     </Typography>
//                   </Box>
                  
//                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#FEF3F2', border: '1px solid #FECACA' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#DC2626">
//                         חסרה נוכחות
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         לא נרשמה נוכחות לקבוצת יוגה של יום ראשון
//                       </Typography>
//                     </Paper>
                    
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#D97706">
//                         תלמיד חדש נרשם
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         יוסי כהן נרשם לחוג ציור - קבוצה מתחילים
//                       </Typography>
//                     </Paper>
                    
//                     <Paper sx={{ p: 2, borderRadius: '12px', bgcolor: '#F0FDF4', border: '1px solid #DCFCE7' }}>
//                       <Typography variant="subtitle2" fontWeight="bold" color="#059669">
//                         דוח חודשי מוכן
//                       </Typography>

//                       <Typography variant="body2" color="text.secondary">
//                         דוח הנוכחות לחודש נובמבר מוכן לצפיה
//                       </Typography>
//                     </Paper>
//                   </Box>
                  
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     sx={{ mt: 3, borderRadius: '12px' }}
//                     onClick={() => navigate('/notifications')}
//                   >
//                     צפה בכל התראות
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </motion.div>

//         {/* Footer */}
//         <motion.div variants={itemVariants}>
//           <Box sx={{ mt: 6, textAlign: 'center' }}>
//             <Typography variant="body2" color="text.secondary">
//               מערכת ניהול חוגים • גרסה 1.0 • © 2024 כל הזכויות שמורות
//             </Typography>
//           </Box>
//         </motion.div>
//       </motion.div>
//     </Box>
//   );
// };

// export default Home;
