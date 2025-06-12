// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   Button,
//   Avatar,
//   Chip,
//   IconButton,
//   Stack,
//   Container,
//   Badge,
//   Tooltip,
//   Divider,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   List,
//   ListItem,
//   ListItemAvatar,
//   ListItemText,
//   Paper,
//   Fab,
//   Slide,
//   useMediaQuery,
//   useTheme
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   People as StudentsIcon,
//   School as CoursesIcon,
//   Person as InstructorsIcon,
//   Assignment as EnrollIcon,
//   Assessment as ReportsIcon,
//   Today as TodayIcon,
//   CalendarMonth as CalendarIcon,
//   TrendingUp as TrendingUpIcon,
//   Notifications as NotificationsIcon,
//   Schedule as ScheduleIcon,
//   CheckCircle as AttendanceIcon,
//   Add as AddIcon,
//   ArrowForward as ArrowIcon,
//   Business as BusinessIcon,
//   Star as StarIcon,
//   Verified as VerifiedIcon,
//   Psychology as PsychologyIcon,
//   Security as SecurityIcon,
//   FlashOn as FlashOnIcon,
//   Info as InfoIcon,
//   Rocket as RocketIcon,
//   Shield as ShieldIcon,
//   Cloud as CloudIcon,
//   Speed as SpeedIcon,
//   Chat as ChatIcon,
//   Send as SendIcon,
//   Close as CloseIcon,
//   SupportAgent as SupportIcon,
//   SmartToy as BotIcon
// } from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchStudents } from '../store/student/studentGetAllThunk';
// import { fetchCourses } from '../store/course/CoursesGetAllThunk';
// import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';

// // Transition component for Dialog
// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const Home = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   // Redux state
//   const students = useSelector(state => state.students.students || []);
//   const courses = useSelector(state => state.courses.courses || []);
//   const instructors = useSelector(state => state.instructors.instructors || []);

//   // Local state
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatMessages, setChatMessages] = useState([
//     {
//       id: 1,
//       text: '? שלום! אני כאן לעזור לך עם המערכת. איך אוכל לסייע',
//       sender: 'bot',
//       timestamp: new Date()
//     }
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   // Chat support responses
//   const chatResponses = {
//     'שלום': 'שלום! איך אוכל לעזור לך היום?',
//     'עזרה': 'אני כאן לעזור! על מה תרצה לשמוע? תלמידים, חוגים, מדריכים או נוכחות?',
//     'תלמידים': 'לניהול תלמידים: לך לתפריט "ניהול תלמידים" או לחץ על הקישור המהיר. שם תוכל להוסיף, לערוך ולצפות בפרטי התלמידים.',
//     'חוגים': 'לניהול חוגים: בתפריט "ניהול חוגים" תוכל ליצור חוגים חדשים, לערוך קיימים ולנהל קבוצות.',
//     'נוכחות': 'לרישום נוכחות: השתמש בתפריט "ניהול נוכחות" או בפעולה המהירה "רשום נוכחות".',
//     'בעיה': 'מה הבעיה שאתה נתקל בה? אני אעזור לך לפתור אותה.',
//     'תודה': 'בשמחה! אם יש עוד שאלות, אני כאן.',
//     'default': 'מצטער, לא הבנתי את השאלה. נסה לשאול על: תלמידים, חוגים, מדריכים, נוכחות או עזרה כללית.'
//   };

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
//   const stats = {
//     totalUsers: 12547,
//     activeToday: 1834,
//     systemUptime: 99.9,
//     dataProcessed: 2.4
//   };

//   const systemStats = [
//     { title: 'תלמידים', value: students.length, icon: StudentsIcon, color: '#3B82F6', unit: '' },
//     { title: 'חוגים', value: courses.length, icon: CoursesIcon, color: '#10B981', unit: '' },
//     { title: 'מדריכים', value: instructors.length, icon: InstructorsIcon, color: '#F59E0B', unit: '' },
//     { title: 'נוכחות', value: 94, icon: AttendanceIcon, color: '#8B5CF6', unit: '%' }
//   ];

//   // ברכה דינמית
//   const getGreeting = () => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return 'בוקר טוב';
//     if (hour < 17) return 'צהריים טובים';
//     if (hour < 21) return 'ערב טוב';
//     return 'לילה טוב';
//   };

//   const greeting = getGreeting();

//   // פעולות מהירות
//   const quickActions = [
//     {
//       title: 'הוסף תלמיד',
//       subtitle: 'רישום מהיר',
//       description: 'הוסף תלמיד חדש למערכת בקלות ובמהירות',
//       icon: AddIcon,
//       action: () => navigate('/students'),
//       color: '#3B82F6'
//     },
//     {
//       title: 'שבץ לחוג',
//       subtitle: 'שיבוץ חכם',
//       description: 'שבץ תלמידים לחוגים עם המלצות אוטומטיות',
//       icon: EnrollIcon,
//       action: () => navigate('/entrollStudent'),
//       color: '#10B981'
//     },
//     {
//       title: 'רשום נוכחות',
//       subtitle: 'מעקב יומי',
//       description: 'רשום נוכחות תלמידים במהירות ובדיוק',
//       icon: AttendanceIcon,
//       action: () => navigate('/attendanceCalendar'),
//       color: '#F59E0B'
//     },
//     {
//       title: 'צפה בדוחות',
//       subtitle: 'ניתוח נתונים',
//       description: 'דוחות מפורטים וסטטיסטיקות מתקדמות',
//       icon: ReportsIcon,
//       action: () => navigate('/reports'),
//       color: '#8B5CF6'
//     }
//   ];

//   // תפריט ראשי
//   const mainMenuItems = [
//     {
//       title: 'ניהול תלמידים',
//       description: 'הוספה, עריכה וצפיה בפרטי תלמידים עם כלים מתקדמים',
//       icon: StudentsIcon,
//       path: '/students',
//       color: '#3B82F6',
//       gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
//       badge: 'מתקדם',
//       stats: `${students.length} תלמידים`
//     },
//     {
//       title: 'ניהול חוגים',
//       description: 'ניהול חוגים, קבוצות וסניפים עם מערכת שיבוץ חכמה',
//       icon: CoursesIcon,
//       path: '/attendanceCalendar',
//       color: '#10B981',
//       gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
//       badge: 'פופולרי',
//       stats: `${courses.length} חוגים`
//     },
//     {
//       title: 'ניהול מדריכים',
//       description: 'הוספה ועריכת פרטי מדריכים עם מערכת הערכות',
//       icon: InstructorsIcon,
//       path: '/instructors',
//       color: '#F59E0B',
//       gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
//       badge: 'חדש',
//       stats: `${instructors.length} מדריכים`
//     },
//     {
//       title: 'שיבוץ תלמידים',
//       description: 'רישום תלמידים לחוגים וקבוצות עם בינה מלאכותית',
//       icon: EnrollIcon,
//       path: '/entrollStudent',
//       color: '#EF4444',
//       gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
//       badge: 'AI',
//       stats: 'שיבוץ חכם'
//     },
//     {
//       title: 'ניהול נוכחות',
//       description: 'רישום נוכחות ומעקב אחר השתתפות עם התראות',
//       icon: TodayIcon,
//       path: '/attendanceCalendar',
//       color: '#8B5CF6',
//       gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
//       badge: 'חיוני',
//       stats: '94% נוכחות'
//     },
//     {
//       title: 'דוחות וסטטיסטיקות',
//       description: 'דוחות מפורטים ואנליטיקה מתקדמת עם גרפים',
//       icon: ReportsIcon,
//       path: '/reports',
//       color: '#06B6D4',
//       gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
//       badge: 'פרו',
//       stats: 'ניתוח מתקדם'
//     }
//   ];

//   // Chat functions
//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: newMessage,
//       sender: 'user',
//       timestamp: new Date()
//     };

//     setChatMessages(prev => [...prev, userMessage]);
//     setNewMessage('');
//     setIsTyping(true);

//     // Simulate bot response
//     setTimeout(() => {
//       const botResponse = getBotResponse(newMessage);
//       const botMessage = {
//         id: Date.now() + 1,
//         text: botResponse,
//         sender: 'bot',
//         timestamp: new Date()
//       };
//       setChatMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1000 + Math.random() * 2000);
//   };

//   const getBotResponse = (message) => {
//     const lowerMessage = message.toLowerCase();
    
//     for (const [key, response] of Object.entries(chatResponses)) {
//       if (lowerMessage.includes(key)) {
//         return response;
//       }
//     }
    
//     return chatResponses.default;
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter' && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         duration: 0.8
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.8, ease: "easeOut" }
//     }
//   };

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       background: `
//         linear-gradient(135deg, rgba(106, 130, 239, 0.1) 0%, rgba(75, 162, 159, 0.1) 100%),
//         radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
//         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
//         radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
//       `,
//       position: 'relative',
//       overflow: 'hidden'
//     }}>
//       {/* Animated Background Elements */}
//       <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={i}
//             style={{
//               position: 'absolute',
//               width: Math.random() * 300 + 100,
//               height: Math.random() * 300 + 100,
//               borderRadius: '50%',
//               background: `radial-gradient(circle, ${
//                            ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][i % 4]
//               } 0%, transparent 70%)`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               x: [0, Math.random() * 100 - 50],
//               y: [0, Math.random() * 100 - 50],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: Math.random() * 20 + 10,
//               repeat: Infinity,
//               repeatType: "reverse",
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </Box>

//       <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {/* Hero Section */}
//           <motion.div variants={itemVariants}>
//             <Box sx={{ textAlign: 'center', mb: 8 }}>
//               <motion.div
//                 initial={{ scale: 0.5, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ duration: 1, delay: 0.2 }}
//               >
//                 <Typography 
//                   variant="h2" 
//                   fontWeight="800" 
//                   sx={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     color: 'transparent',
//                     mb: 2,
//                     fontSize: { xs: '2.5rem', md: '3.5rem' }
//                   }}
//                 >
//                 👋 !{greeting} 
//                 </Typography>
//               </motion.div>

//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.8, delay: 0.5 }}
//               >
//                 <Typography 
//                   variant="h4" 
//                   sx={{
//                     color: '#1e293b',
//                     mb: 3,
//                     fontWeight: 600,
//                     fontSize: { xs: '1.5rem', md: '2rem' }
//                   }}
//                 >
//                   ברוכים הבאים למערכת ניהול החוגים  
//                 </Typography>
//               </motion.div>

//               <motion.div
//                 initial={{ y: 30, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.8, delay: 0.7 }}
//               >
//                 <Typography 
//                   variant="h6" 
//                   sx={{
//                     color: '#64748b',
//                     mb: 4,
//                     maxWidth: '800px',
//                     mx: 'auto',
//                     lineHeight: 1.6
//                   }}
//                 >
//                   {currentTime.toLocaleDateString('he-IL', { 
//                     weekday: 'long', 
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric' 
//                   })} • {currentTime.toLocaleTimeString('he-IL', { 
//                     hour: '2-digit', 
//                     minute: '2-digit' 
//                   })}
//                 </Typography>
//               </motion.div>
//             </Box>
//           </motion.div>

//           {/* Statistics Cards */}
//           <motion.div variants={itemVariants}>
//             <Grid container spacing={3} sx={{ mb: 6 }}>
//               {systemStats.map((stat, index) => (
//                 <Grid item xs={12} sm={6} md={3} key={index}>
//                   <motion.div
//                     initial={{ opacity: 0, y: 50, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
//                     whileHover={{ scale: 1.05, y: -10 }}
//                   >
//                     <Card
//                       sx={{
//                         background: 'rgba(255, 255, 255, 0.95)',
//                         backdropFilter: 'blur(20px)',
//                         borderRadius: '20px',
//                         width:'250px',
//                         border: '2px solid rgba(255, 255, 255, 0.8)',
//                         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
//                         overflow: 'hidden',
//                         position: 'relative',
//                         transition: 'all 0.4s ease',
//                         '&:hover': {
//                           boxShadow: `0 30px 60px ${stat.color}20`,
//                           borderColor: stat.color,
//                           '& .stat-icon': {
//                             transform: 'scale(1.2) rotate(10deg)',
//                             background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`
//                           }
//                         }
//                       }}
//                     >
//                       <CardContent sx={{ p: 4, textAlign: 'center' }}>
//                         <Avatar
//                           className="stat-icon"
//                           sx={{
//                             width: 70,
//                             height: 70,
//                             mx: 'auto',
//                             mb: 3,
//                             background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}30)`,
//                             border: `3px solid ${stat.color}40`,
//                             transition: 'all 0.4s ease',
//                             boxShadow: `0 8px 24px ${stat.color}25`
//                           }}
//                         >
//                           <stat.icon sx={{ fontSize: 35, color: stat.color }} />
//                         </Avatar>
                        
//                         <Typography variant="h3" fontWeight="700" sx={{ color: stat.color, mb: 1 }}>
//                           {stat.value}{stat.unit}
//                         </Typography>
                        
//                         <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
//                           {stat.title}
//                         </Typography>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </Grid>
//               ))}
//             </Grid>
//           </motion.div>

//           {/* Quick Actions */}
//           <motion.div variants={itemVariants}>
//             <Box sx={{ mb: 8 }}>
//               <Typography 
//                 variant="h4" 
//                 fontWeight="700" 
//                 sx={{ 
//                   mb: 4,
//                   textAlign: 'center',
//                   color: '#1e293b'
//                 }}
//               >
//                 ⚡ פעולות מהירות
//               </Typography>
              
//               <Grid container spacing={3}>
//                 {quickActions.map((action, index) => (
//                   <Grid item xs={12} sm={6} md={3} key={index}>
//                     <motion.div
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 + 1, duration: 0.6 }}
//                       whileHover={{ scale: 1.03, y: -5 }}
//                       whileTap={{ scale: 0.97 }}
//                     >
//                       <Card
//                         sx={{
//                           borderRadius: '16px',
//                           cursor: 'pointer',
//                           width:'260px',
//                           background: 'rgba(255, 255, 255, 0.95)',
//                           backdropFilter: 'blur(20px)',
//                           border: '2px solid rgba(255, 255, 255, 0.8)',
//                           boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
//                           transition: 'all 0.3s ease',
//                           '&:hover': {
//                             boxShadow: `0 25px 50px ${action.color}25`,
//                             borderColor: action.color,
//                             '& .action-icon': {
//                               background: action.color,
//                               color: 'white',
//                               transform: 'scale(1.1)'
//                             }
//                           }
//                         }}
//                         onClick={action.action}
//                       >
//                         <CardContent sx={{ p: 3, textAlign: 'center' }}>
//                           <Avatar
//                             className="action-icon"
//                             sx={{
//                               width: 60,
//                               height: 60,
//                               mx: 'auto',
//                               mb: 2,
//                               bgcolor: `${action.color}15`,
//                               color: action.color,
//                               transition: 'all 0.3s ease'
//                             }}
//                           >
//                             <action.icon sx={{ fontSize: 30 }} />
//                           </Avatar>
                          
//                           <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b', mb: 1 }}>
//                             {action.title}
//                           </Typography>
                          
//                           <Typography variant="body2" sx={{ color: action.color, fontWeight: 600, mb: 1 }}>
//                             {action.subtitle}
//                           </Typography>
                          
//                           <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
//                             {action.description}
//                           </Typography>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           </motion.div>

//           {/* Main Menu */}
//           <motion.div variants={itemVariants}>
//             <Box sx={{
//               background: 'rgba(255, 255, 255, 0.95)',
//               backdropFilter: 'blur(30px)',
//               borderRadius: '32px',
//               p: { xs: 4, md: 6 },
//               border: '2px solid rgba(255, 255, 255, 0.8)',
//               boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
//               mb: 8
//             }}>
//               <Box sx={{ textAlign: 'center', mb: 6 }}>
//                 <Typography 
//                   variant="h4" 
//                   fontWeight="700" 
//                   sx={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     color: 'transparent',
//                     mb: 2
//                   }}
//                 >
//                   🚀 תפריט ראשי מתקדם
//                 </Typography>
//                 <Typography variant="h6" color="#64748b" fontWeight="500">
//                   כל הכלים שאתה צריך במקום אחד
//                 </Typography>
//               </Box>
              
//               <Grid container spacing={4}>
//                 {mainMenuItems.map((item, index) => (
//                   <Grid item xs={12} sm={6} lg={4} key={index}>
//                     <motion.div
                    
//                       initial={{ opacity: 0, y: 100, scale: 0.8 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{ 
//                         delay: index * 0.1 + 0.5, 
//                         duration: 1,
//                         type: "spring",
//                         bounce: 0.3
//                       }}
//                       whileHover={{ 
//                         scale: 1.05, 
//                         y: -20,
//                         rotateY: 8,
//                         transition: { duration: 0.4 }
//                       }}
//                       whileTap={{ scale: 0.95 }}
//                       style={{ perspective: '1000px' }}
//                     >
//                       <Card
//                         sx={{
//                           borderRadius: '28px',
//                           cursor: 'pointer',
//                           width:'310px',
//                           height: '350px',
//                           position: 'relative',
//                           overflow: 'hidden',
//                           background: 'rgba(255, 255, 255, 0.95)',
//                           backdropFilter: 'blur(30px)',
//                           border: '2px solid rgba(255, 255, 255, 0.8)',
//                           boxShadow: `
//                             0 25px 50px rgba(0, 0, 0, 0.15),
//                             0 12px 24px rgba(0, 0, 0, 0.1),
//                             inset 0 1px 0 rgba(255, 255, 255, 0.9)
//                           `,
//                           transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
//                           '&:hover': {
//                             boxShadow: `
//                               0 40px 80px ${item.color}25,
//                               0 20px 40px rgba(0, 0, 0, 0.2),
//                               inset 0 1px 0 rgba(255, 255, 255, 0.9)
//                             `,
//                             borderColor: item.color,
//                             '& .card-icon': {
//                               transform: 'scale(1.15) rotate(5deg)',
//                               background: item.gradient,
//                             },
//                             '& .card-badge': {
//                               transform: 'scale(1.1)',
//                               boxShadow: `0 4px 15px ${item.color}40`
//                             },
//                             '& .card-glow': {
//                               opacity: 1,
//                               transform: 'scale(2)'
//                             },
//                             '& .card-stats': {
//                               color: item.color,
//                               transform: 'translateY(-2px)'
//                             }
//                           }
//                         }}
//                         onClick={() => navigate(item.path)}
//                       >
//                         {/* Animated Background Glow */}
//                         <Box
//                           className="card-glow"
//                           sx={{
//                             position: 'absolute',
//                             top: '20%',
//                             right: '20%',
//                             width: '120px',
//                             height: '120px',
//                             background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
//                             borderRadius: '50%',
//                             opacity: 0,
//                             transition: 'all 0.6s ease',
//                             zIndex: 0
//                           }}
//                         />

//                         {/* Premium Badge */}
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             top: 16,
//                             right: 16,
//                             zIndex: 3
//                           }}
//                         >
//                           <motion.div
//                             className="card-badge"
//                             whileHover={{ rotate: [0, -10, 10, 0] }}
//                             // transition={{ duration: 0
//                             transition={{ duration: 0.5 }}
//                           >
//                             <Chip
//                               label={item.badge}
//                               size="small"
//                               sx={{
//                                 background: item.gradient,
//                                 color: 'white',
//                                 fontWeight: 700,
//                                 fontSize: '0.7rem',
//                                 height: '24px',
//                                 boxShadow: `0 4px 12px ${item.color}30`,
//                                 border: '1px solid rgba(255, 255, 255, 0.3)',
//                                 transition: 'all 0.3s ease'
//                               }}
//                             />
//                           </motion.div>
//                         </Box>
                        
//                         <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
//                           <Box sx={{ flex: 1 }}>
//                             <Avatar
//                               className="card-icon"
//                               sx={{
//                                 width: 80,
//                                 height: 80,
//                                 mb: 3,
//                                 background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)`,
//                                 border: `3px solid ${item.color}40`,
//                                 boxShadow: `0 12px 30px ${item.color}25`,
//                                 transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//                               }}
//                             >
//                               <item.icon sx={{ fontSize: 40, color: item.color }} />
//                             </Avatar>
                            
//                             <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.3 }}>
//                               {item.title}
//                             </Typography>
                            
//                             <Typography 
//                               variant="body2" 
//                               sx={{ 
//                                 color: '#64748b', 
//                                 mb: 3, 
//                                 lineHeight: 1.6,
//                                 fontSize: '0.9rem'
//                               }}
//                             >
//                               {item.description}
//                             </Typography>
//                           </Box>
                          
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
//                             <Typography 
//                               className="card-stats"
//                               variant="body2" 
//                               fontWeight="600"
//                               sx={{ 
//                                 color: '#94a3b8',
//                                 transition: 'all 0.3s ease'
//                               }}
//                             >
//                               {item.stats}
//                             </Typography>
                            
//                             <IconButton
//                               size="small"
//                               sx={{
//                                 color: item.color,
//                                 bgcolor: `${item.color}15`,
//                                 border: `2px solid ${item.color}30`,
//                                 '&:hover': {
//                                   bgcolor: item.color,
//                                   color: 'white',
//                                   transform: 'translateX(-5px) scale(1.1)',
//                                   boxShadow: `0 8px 20px ${item.color}40`
//                                 },
//                                 transition: 'all 0.3s ease'
//                               }}
//                             >
//                               <ArrowIcon />
//                             </IconButton>
//                           </Box>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Box>
//           </motion.div>

//           {/* Call to Action Section */}
//           <motion.div variants={itemVariants}>
//             <Box sx={{
//               textAlign: 'center',
//               background: 'rgba(255, 255, 255, 0.95)',
//               backdropFilter: 'blur(30px)',
//               borderRadius: '32px',
//               p: { xs: 6, md: 10 },
//               border: '2px solid rgba(255, 255, 255, 0.8)',
//               boxShadow: `
//                 0 32px 64px rgba(0, 0, 0, 0.15),
//                 inset 0 1px 0 rgba(255, 255, 255, 0.8)
//               `,
//               position: 'relative',
//               overflow: 'hidden',
//               mb: 8
//             }}>
//               {/* Animated Background Pattern */}
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: `
//                     radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
//                     radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
//                   `,
//                   zIndex: 0
//                 }}
//               />

//               <Box sx={{ position: 'relative', zIndex: 1 }}>
//                 <motion.div
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ duration: 1, delay: 1.2 }}
//                 >
//                   <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                     >
//                       <Avatar sx={{
//                         width: 100,
//                         height: 100,
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
//                         border: '4px solid rgba(255, 255, 255, 0.9)'
//                       }}>
//                         <RocketIcon sx={{ fontSize: 50, color: 'white' }} />
//                       </Avatar>
//                     </motion.div>
//                   </Stack>
//                 </motion.div>

//                 <Typography 
//                   variant="h3" 
//                   fontWeight="800" 
//                   sx={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     backgroundClip: 'text',
//                     WebkitBackgroundClip: 'text',
//                     color: 'transparent',
//                     mb: 3,
//                     lineHeight: 1.2
//                   }}
//                 >
//                   ? מוכן להתחיל 🚀
//                 </Typography>

               

//                 <Typography 
//                   variant="h6" 
//                   sx={{
//                     color: '#64748b',
//                     mb: 6,
//                     fontWeight: 400,
//                     maxWidth: '600px',
//                     mx: 'auto',
//                     lineHeight: 1.6
//                   }}
//                 >
//                   התחל את המסע שלך עם המערכת המתקדמת ביותר לניהול חוגים
//                 </Typography>

//                 <Stack 
//                   direction={{ xs: 'column', sm: 'row' }} 
//                   spacing={3} 
//                   justifyContent="center"
//                   alignItems="center"
//                   sx={{ mb: 6 }}
//                 >
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       variant="contained"
//                       size="large"
//                       startIcon={<DashboardIcon />}
//                       onClick={() => navigate('/menu')}
//                       sx={{
//                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                         borderRadius: '20px',
//                         px: 6,
//                         py: 2.5,
//                         fontSize: '1.2rem',
//                         fontWeight: 700,
//                         textTransform: 'none',
//                         boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
//                         border: '2px solid rgba(255, 255, 255, 0.3)',
//                         '&:hover': {
//                           boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
//                           transform: 'translateY(-3px)'
//                         },
//                         transition: 'all 0.3s ease'
//                       }}
//                     >
//                       כניסה למערכת
//                     </Button>
//                   </motion.div>

//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       variant="outlined"
//                       size="large"
//                       startIcon={<InfoIcon />}
//                       onClick={() => navigate('/aboutSystem')}
//                       sx={{
//                         borderColor: '#667eea',
//                         color: '#667eea',
//                         borderRadius: '20px',
//                         px: 6,
//                         py: 2.5,
//                         fontSize: '1.2rem',
//                         fontWeight: 700,
//                         textTransform: 'none',
//                         borderWidth: '2px',
//                         '&:hover': {
//                           borderColor: '#764ba2',
//                           color: '#764ba2',
//                           backgroundColor: 'rgba(102, 126, 234, 0.05)',
//                           transform: 'translateY(-3px)',
//                           boxShadow: '0 12px 25px rgba(102, 126, 234, 0.2)'
//                         },
//                         transition: 'all 0.3s ease'
//                       }}
//                     >
//                       למד עוד
//                     </Button>
//                   </motion.div>
//                 </Stack>

//                 {/* Trust Indicators
//                 <Box sx={{
//                   background: 'rgba(16, 185, 129, 0.05)',
//                   borderRadius: '20px',
//                   p: 4,
//                   border: '1px solid rgba(16, 185, 129, 0.2)'
//                 }}>
//                   <Typography variant="h6" fontWeight="600" sx={{ color: '#10B981', mb: 3 }}>
//                     למה בוחרים בנו? ✨
//                   </Typography>
                  
//                   <Grid container spacing={3} justifyContent="center">
//                     {[
//                       { icon: VerifiedIcon, text: 'מוסדות מובילים', value: '500+' },
//                       { icon: StudentsIcon, text: 'תלמידים פעילים', value: '50K+' },
//                       { icon: ShieldIcon, text: 'זמינות מערכת', value: '99.9%' },
//                       { icon: StarIcon, text: 'דירוג שביעות רצון', value: '4.9/5' }
//                     ].map((item, index) => (
//                       <Grid item xs={6} sm={3} key={index}>
//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 1.5 + index * 0.1 }}
//                         >
//                           <Box sx={{ textAlign: 'center' }}>
//                             <Avatar sx={{
//                               width: 50,
//                               height: 50,
//                               mx: 'auto',
//                               mb: 2,
//                               bgcolor: 'rgba(16, 185, 129, 0.1)',
//                               border: '2px solid rgba(16, 185, 129, 0.3)'
//                             }}>
//                               <item.icon sx={{ color: '#10B981' }} />
//                             </Avatar>
//                             <Typography variant="h6" fontWeight="700" color="#10B981">
//                               {item.value}
//                             </Typography>
//                             <Typography variant="body2" color="#64748b" fontSize="0.85rem">
//                               {item.text}
//                             </Typography>
//                           </Box>
//                         </motion.div>
//                       </Grid>
//                     ))}
//                   </Grid> */}
//                 {/* </Box> */}
//               </Box>
//             </Box>
//           </motion.div>

//           {/* Premium Footer */}
//           <motion.div variants={itemVariants}>
//             <Box sx={{
//               background: 'rgba(255, 255, 255, 0.95)',
//               backdropFilter: 'blur(30px)',
//               borderRadius: '24px',
//               p: 6,
//               border: '2px solid rgba(255, 255, 255, 0.8)',
//               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
//               textAlign: 'center',
//               position: 'relative',
//               overflow: 'hidden'
//             }}>
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%)',
//                   zIndex: 0
//                 }}
//               />

//               <Box sx={{ position: 'relative', zIndex: 1 }}>
//                 <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
//                   <Avatar sx={{
//                     width: 60,
//                     height: 60,
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
//                   }}>
//                     <BusinessIcon sx={{ fontSize: 30 }} />
//                   </Avatar>
                  
//                   <Box sx={{ textAlign: 'left' }}>
//                     <Typography variant="h5" fontWeight="700" color="#1e293b">
//                       מערכת ניהול חוגים פרימיום
//                     </Typography>
//                     <Typography variant="body1" color="#64748b">
//                       הפתרון המתקדם ביותר לניהול חוגים
//                     </Typography>
//                   </Box>
//                 </Stack>

//                 <Divider sx={{ mb: 4, opacity: 0.3 }} />

//                 <Grid container spacing={4} sx={{ mb: 4 ,alignItems:'center',marginLeft:'290px'}}>
//                   <Grid item xs={12} md={4}>
//                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
//                       🌟 תכונות
//                     </Typography>
//                     <Stack spacing={1}>
//                       {['ניהול חכם', 'דוחות מתקדמים', 'אבטחה מקסימלית', 'תמיכה 24/7'].map((feature, index) => (
//                         <Typography key={index} variant="body2" color="#64748b">
//                           • {feature}
//                         </Typography>
//                       ))}
//                     </Stack>
//                   </Grid>
                  
//                   <Grid item xs={12} md={4}>
//                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
//                       📞 יצירת קשר
//                     </Typography>
//                     <Stack spacing={1}>
//                       <Typography variant="body2" color="#64748b">
//                         📧 easyoffice100@gmail.com
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         📱 03-....
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         🌐 www.system.co.il
//                       </Typography>
//                     </Stack>
//                   </Grid>
                  
//                   <Grid item xs={12} md={4}>
//                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
//                       🔒 אמינות
//                     </Typography>
//                     <Stack spacing={1}>
//                       <Typography variant="body2" color="#64748b">
//                         ✓ הצפנה מתקדמת
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         ✓ גיבוי אוטומטי
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         ✓ תקן ISO 27001
//                       </Typography>
//                     </Stack>
//                   </Grid>
//                 </Grid>

//                 <Divider sx={{ mb: 4, opacity: 0.3 }} />

//                 <Box>
//                   <Typography variant="body2" color="#94a3b8" sx={{ fontSize: '0.9rem' }}>
//                     © 2025 מערכת ניהול חוגים פרימיום • גרסה 2.0 • כל הזכויות שמורות
//                   </Typography>
                  
//                   <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
//                     {[
//                       { icon: SecurityIcon, tooltip: 'אבטחה מתקדמת' },
//                       { icon: CloudIcon, tooltip: 'טכנולוגיית ענן' },
//                       { icon: SpeedIcon, tooltip: 'ביצועים מהירים' },
//                       { icon: ShieldIcon, tooltip: 'הגנה מקסימלית' }
//                     ].map((item, index) => (
//                       <Tooltip key={index} title={item.tooltip}>
//                         <IconButton
//                           size="small"
//                           sx={{
//                             color: '#667eea',
//                             bgcolor: 'rgba(102, 126, 234, 0.1)',
//                             border: '1px solid rgba(102, 126, 234, 0.2)',
//                             '&:hover': {
//                               bgcolor: 'rgba(102, 126, 234, 0.2)',
//                               transform: 'scale(1.1)'
//                             },
//                             transition: 'all 0.3s ease'
//                           }}
//                         >
//                           <item.icon fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     ))}
//                   </Stack>
//                 </Box>
//               </Box>
//             </Box>
//           </motion.div>

//           {/* Floating Chat Button */}
//           <motion.div
//             initial={{ scale: 0, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{ delay: 2, duration: 0.8, type: "spring", bounce: 0.6 }}
//             style={{
//               position: 'fixed',
//               bottom: 30,
//               left: 30,
//               zIndex: 1000
//             }}
//           >
//             <Tooltip title="צ'אט תמיכה מהיר" placement="top">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 animate={{ 
//                   boxShadow: [
//                     '0 0 20px rgba(102, 126, 234, 0.3)',
//                     '0 0 30px rgba(102, 126, 234, 0.6)',
//                     '0 0 20px rgba(102, 126, 234, 0.3)'
//                   ]
//                 }}
//                 transition={{ 
//                   boxShadow: { duration: 2, repeat: Infinity },
//                   scale: { duration: 0.2 }
//                 }}
//               >
//                 <Fab
//                   size="large"
//                   sx={{
//                     width: 70,
//                     height: 70,
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     color: 'white',
//                     boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
//                     border: '3px solid rgba(255, 255, 255, 0.9)',
//                     '&:hover': {
//                       background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
//                       boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)'
//                     },
//                     transition: 'all 0.3s ease'
//                   }}
//                   onClick={() => setChatOpen(true)}
//                 >
//                   <Badge badgeContent="1" color="error">
//                     <ChatIcon sx={{ fontSize: 30 }} />
//                   </Badge>
//                 </Fab>
//               </motion.div>
//             </Tooltip>
//           </motion.div>

//           {/* Scroll to Top Button */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 3 }}
//             style={{
//               position: 'fixed',
//               bottom: 30,
//               right: 30,
//               zIndex: 1000
//             }}
//           >
//             <Tooltip title="חזור למעלה" placement="top">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <Fab
//                   size="medium"
//                   sx={{
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(20px)',
//                     color: '#667eea',
//                     boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
//                     border: '2px solid rgba(102, 126, 234, 0.2)',
//                     '&:hover': {
//                       background: 'rgba(102, 126, 234, 0.1)',
//                       borderColor: '#667eea',
//                       boxShadow: '0 12px 35px rgba(102, 126, 234, 0.3)'
//                     },
//                     transition: 'all 0.3s ease'
//                   }}
//                   onClick={() => {
//                     window.scrollTo({ top: 0, behavior: 'smooth' });
//                   }}
//                 >
//                   <ArrowIcon sx={{ fontSize: 28, transform: 'rotate(-90deg)' }} />
//                 </Fab>
//               </motion.div>
//             </Tooltip>
//           </motion.div>

//           {/* Progress Indicator */}
//           <motion.div
//             initial={{ scaleX: 0 }}
//             animate={{ scaleX: 1 }}
//             transition={{ duration: 2, delay: 1 }}
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               height: '4px',
//               background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//               zIndex: 1001,
//               transformOrigin: 'left'
//             }}
//           />

//         </motion.div>
//       </Container>

//       {/* Chat Support Dialog */}
//       <Dialog
//         open={chatOpen}
//         onClose={() => setChatOpen(false)}
//         TransitionComponent={Transition}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: '20px',
//             background: 'rgba(255, 255, 255, 0.95)',
//             backdropFilter: 'blur(30px)',
//             border: '2px solid rgba(255, 255, 255, 0.8)',
//             boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
//             overflow: 'hidden'
//           }
//         }}
//       >
//         <DialogTitle
//           sx={{
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             p: 3,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between'
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
//               <SupportIcon />
//             </Avatar>
//             <Box>
//               <Typography variant="h6" fontWeight="bold">
//                 צ'אט תמיכה
//               </Typography>
//               <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                 אנחנו כאן לעזור לך 24/7
//               </Typography>
//             </Box>
//           </Box>
//           <IconButton
//             onClick={() => setChatOpen(false)}
//             sx={{ color: 'white' }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent sx={{ p: 0, height: '400px', display: 'flex', flexDirection: 'column' }}>
//           <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
//             <List>
//               <AnimatePresence>
//                 {chatMessages.map((message) => (
//                   <motion.div
//                     key={message.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ListItem
//                       sx={{
//                         flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
//                         alignItems: 'flex-start',
//                         mb: 2
//                       }}
//                     >
//                       <ListItemAvatar sx={{ minWidth: 'auto', mr: message.sender === 'user' ? 0 : 1, ml: message.sender === 'user' ? 1 : 0 }}>
//                         <Avatar
//                           sx={{
//                             bgcolor: message.sender === 'user' ? '#3B82F6' : '#10B981',
//                             width: 35,
//                             height: 35
//                           }}
//                         >
//                           {message.sender === 'user' ? (
//                             <Typography variant="body2" fontWeight="bold">
//                               א
//                             </Typography>
//                           ) : (
//                             <BotIcon fontSize="small" />
//                           )}
//                         </Avatar>
//                       </ListItemAvatar>
                      
//                       <Paper
//                         sx={{
//                           p: 2,
//                           maxWidth: '70%',
//                           bgcolor: message.sender === 'user' ? '#3B82F6' : '#F8FAFC',
//                           color: message.sender === 'user' ? 'white' : '#1E293B',
//                           borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
//                           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                         }}
//                       >
//                         <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
//                           {message.text}
//                         </Typography>
//                         <Typography
//                           variant="caption"
//                           sx={{
//                             opacity: 0.7,
//                             display: 'block',
//                             mt: 0.5,
//                             fontSize: '0.7rem'
//                           }}
//                         >
//                           {message.timestamp.toLocaleTimeString('he-IL', {
//                             hour: '2-digit',
//                             minute: '2-digit'
//                           })}
//                         </Typography>
//                       </Paper>
//                     </ListItem>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
              
//               {isTyping && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                 >
//                   <ListItem>
//                     <ListItemAvatar>
//                       <Avatar sx={{ bgcolor: '#10B981', width: 35, height: 35 }}>
//                         <BotIcon fontSize="small" />
//                       </Avatar>
//                     </ListItemAvatar>
//                     <Paper
//                       sx={{
//                         p: 2,
//                         bgcolor: '#F8FAFC',
//                         borderRadius: '20px 20px 20px 5px',
//                         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                       }}
//                     >
//                       <motion.div
//                         animate={{ opacity: [0.5, 1, 0.5] }}
//                         transition={{ duration: 1.5, repeat: Infinity }}
//                       >
//                         <Typography variant="body2" color="#64748B">
//                           מקליד...
//                         </Typography>
//                       </motion.div>
//                     </Paper>
//                   </ListItem>
//                 </motion.div>
//               )}
//             </List>
//           </Box>
//         </DialogContent>

//         <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
//           <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
//             <TextField
//               fullWidth
//               multiline
//               maxRows={3}
//               placeholder="הקלד את הודעתך כאן..."
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '15px',
//                   bgcolor: '#F8FAFC'
//                 }
//               }}
//             />
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <IconButton
//                 onClick={handleSendMessage}
//                 disabled={!newMessage.trim()}
//                 sx={{
//                   bgcolor: '#667eea',
//                   color: 'white',
//                   width: 50,
//                   height: 50,
//                   '&:hover': {
//                     bgcolor: '#764ba2'
//                   },
//                   '&:disabled': {
//                     bgcolor: '#E2E8F0',
//                     color: '#94A3B8'
//                   }
//                 }}
//               >
//                 <SendIcon />
//               </IconButton>
//             </motion.div>
//           </Box>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  IconButton,
  Stack,
  Container,
  Badge,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Fab,
  Slide,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as StudentsIcon,
  School as CoursesIcon,
  Person as InstructorsIcon,
  Assignment as EnrollIcon,
  Assessment as ReportsIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  CheckCircle as AttendanceIcon,
  Add as AddIcon,
  ArrowForward as ArrowIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  FlashOn as FlashOnIcon,
  Info as InfoIcon,
  Rocket as RocketIcon,
  Shield as ShieldIcon,
  Cloud as CloudIcon,
  Speed as SpeedIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SupportAgent as SupportIcon,
  SmartToy as BotIcon,
  AutoAwesome as MagicIcon,
  Celebration as CelebrationIcon,
  EmojiEvents as TrophyIcon,
  Favorite as HeartIcon,
  Lightbulb as LightbulbIcon,
  // AutoAwesome as MagicIcon,
  // Celebration as CelebrationIcon,
  // EmojiEvents as TrophyIcon,
  // Favorite as HeartIcon,
  // Lightbulb as LightbulbIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../store/student/studentGetAllThunk';
import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
import { fetchInstructors } from '../../store/instructor/instructorGetAllThunk';

// Transition component for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Redux state
  const students = useSelector(state => state.students.students || []);
  const courses = useSelector(state => state.courses.courses || []);
  const instructors = useSelector(state => state.instructors.instructors || []);

  // Local state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: '? שלום! אני כאן לעזור לך עם המערכת. איך אוכל לסייע',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Chat support responses
  const chatResponses = {
    'שלום': 'שלום! איך אוכל לעזור לך היום?',
    'עזרה': 'אני כאן לעזור! על מה תרצה לשמוע? תלמידים, חוגים, מדריכים או נוכחות?',
    'תלמידים': 'לניהול תלמידים: לך לתפריט "ניהול תלמידים" או לחץ על הקישור המהיר. שם תוכל להוסיף, לערוך ולצפות בפרטי התלמידים.',
    'חוגים': 'לניהול חוגים: בתפריט "ניהול חוגים" תוכל ליצור חוגים חדשים, לערוך קיימים ולנהל קבוצות.',
    'נוכחות': 'לרישום נוכחות: השתמש בתפריט "ניהול נוכחות" או בפעולה המהירה "רשום נוכחות".',
    'בעיה': 'מה הבעיה שאתה נתקל בה? אני אעזור לך לפתור אותה.',
    'תודה': 'בשמחה! אם יש עוד שאלות, אני כאן.',
    'default': 'מצטער, לא הבנתי את השאלה. נסה לשאול על: תלמידים, חוגים, מדריכים, נוכחות או עזרה כללית.'
  };

  useEffect(() => {
    // טעינת נתונים בסיסיים
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    dispatch(fetchInstructors());

    // עדכון שעה כל דקה
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [dispatch]);

  // נתונים סטטיסטיים
  const stats = {
    totalUsers: 12547,
    activeToday: 1834,
    systemUptime: 99.9,
    dataProcessed: 2.4
  };

  const systemStats = [
    { title: 'תלמידים', value: students.length, icon: StudentsIcon, color: '#3B82F6', unit: '' },
    { title: 'חוגים', value: courses.length, icon: CoursesIcon, color: '#10B981', unit: '' },
    { title: 'מדריכים', value: instructors.length, icon: InstructorsIcon, color: '#F59E0B', unit: '' },
    { title: 'נוכחות', value: 94, icon: AttendanceIcon, color: '#8B5CF6', unit: '%' }
  ];

  // ברכה דינמית
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 17) return 'צהריים טובים';
    if (hour < 21) return 'ערב טוב';
    return 'לילה טוב';
  };

  const greeting = getGreeting();

  // פעולות מהירות
  const quickActions = [
    {
      title: 'הוסף תלמיד',
      subtitle: 'רישום מהיר',
      description: 'הוסף תלמיד חדש למערכת בקלות ובמהירות',
      icon: AddIcon,
      action: () => navigate('/students'),
      color: '#3B82F6'
    },
    {
      title: 'שבץ לחוג',
      subtitle: 'שיבוץ חכם',
      description: 'שבץ תלמידים לחוגים עם המלצות אוטומטיות',
      icon: EnrollIcon,
      action: () => navigate('/entrollStudent'),
      color: '#10B981'
    },
    {
      title: 'רשום נוכחות',
      subtitle: 'מעקב יומי',
      description: 'רשום נוכחות תלמידים במהירות ובדיוק',
      icon: AttendanceIcon,
      action: () => navigate('/attendanceCalendar'),
      color: '#F59E0B'
    },
    {
      title: 'צפה בדוחות',
      subtitle: 'ניתוח נתונים',
      description: 'דוחות מפורטים וסטטיסטיקות מתקדמות',
      icon: ReportsIcon,
      action: () => navigate('/reports'),
      color: '#8B5CF6'
    }
  ];

  // תפריט ראשי
  const mainMenuItems = [
    {
      title: 'ניהול תלמידים',
      description: 'הוספה, עריכה וצפיה בפרטי תלמידים עם כלים מתקדמים',
      icon: StudentsIcon,
      path: '/students',
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      badge: 'מתקדם',
      stats: `${students.length} תלמידים`
    },
    {
      title: 'ניהול חוגים',
      description: 'ניהול חוגים, קבוצות וסניפים עם מערכת שיבוץ חכמה',
      icon: CoursesIcon,
      path: '/attendanceCalendar',
      color: '#10B981',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      badge: 'פופולרי',
      stats: `${courses.length} חוגים`
    },
    {
      title: 'ניהול מדריכים',
      description: 'הוספה ועריכת פרטי מדריכים עם מערכת הערכות',
      icon: InstructorsIcon,
      path: '/instructors',
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      badge: 'חדש',
      stats: `${instructors.length} מדריכים`
    },
    {
      title: 'שיבוץ תלמידים',
      description: 'רישום תלמידים לחוגים וקבוצות עם בינה מלאכותית',
      icon: EnrollIcon,
      path: '/entrollStudent',
      color: '#EF4444',
      gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      badge: 'AI',
      stats: 'שיבוץ חכם'
    },
    {
      title: 'ניהול נוכחות',
      description: 'רישום נוכחות ומעקב אחר השתתפות עם התראות',
      icon: TodayIcon,
      path: '/attendanceCalendar',
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      badge: 'חיוני',
      stats: '94% נוכחות'
    },
    {
      title: 'דוחות וסטטיסטיקות',
      description: 'דוחות מפורטים ואנליטיקה מתקדמת עם גרפים',
      icon: ReportsIcon,
      path: '/reports',
      color: '#06B6D4',
      gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      badge: 'פרו',
      stats: 'ניתוח מתקדם'
    }
  ];

  // Chat functions
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(newMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(chatResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return chatResponses.default;
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, rgba(106, 130, 239, 0.1) 0%, rgba(75, 162, 159, 0.1) 100%),
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${
                           ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][i % 4]
              } 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Hero Section */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              textAlign: 'center', 
              mb: 8,
              position: 'relative',
              py: { xs: 6, md: 10 }
            }}>
              {/* Floating Icons Animation */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                {[
                  { icon: '🎓', delay: 0, x: '10%', y: '20%' },
                  { icon: '📚', delay: 0.5, x: '85%', y: '15%' },
                  { icon: '✨', delay: 1, x: '15%', y: '70%' },
                  { icon: '🚀', delay: 1.5, x: '80%', y: '75%' },
                  { icon: '💡', delay: 2, x: '50%', y: '10%' },
                  { icon: '🎯', delay: 2.5, x: '90%', y: '45%' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: item.x,
                      top: item.y,
                      fontSize: '2rem',
                      zIndex: 0
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ 
                      opacity: [0, 1, 0.7, 1],
                      scale: [0, 1.2, 0.8, 1],
                      rotate: [0, 360],
                      y: [0, -20, 0]
                    }}
                    transition={{
                      delay: item.delay,
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 5,
                      ease: "easeInOut"
                    }}
                  >
                    {item.icon}
                  </motion.div>
                ))}
              </Box>

              {/* Main Title with Enhanced Animation */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.2,
                  type: "spring",
                  bounce: 0.4
                }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  {/* Glowing Background Effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '120%',
                      height: '120%',
                      background: 'radial-gradient(ellipse, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
                      borderRadius: '50%',
                      filter: 'blur(20px)',
                      zIndex: -1
                    }}
                  />
  <Typography 
  variant="h2" 
  fontWeight="800" 
  sx={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    mb: 2,
    fontSize: { xs: '3.5rem', md: '3.5rem' }
  }}
>
 !{greeting}<br></br>
    פלטפורמת ניהול חוגים

</Typography>
                </Box>
              </motion.div>

              {/* Subtitle with Typewriter Effect */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '25px',
                  p: 4,
                  mb: 4,
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  maxWidth: '900px',
                  mx: 'auto'
                }}>
                  {/* Animated Border */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `
                        linear-gradient(45deg, 
                          transparent, 
                          rgba(102, 126, 234, 0.3), 
                          transparent, 
                          rgba(118, 75, 162, 0.3), 
                          transparent
                        )
                      `,
                      backgroundSize: '400% 400%',
                      borderRadius: '25px',
                      padding: '2px',
                      animation: 'borderGlow 6s ease infinite',
                      '@keyframes borderGlow': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' }
                      },
                      zIndex: -1
                    }}
                  />

                  <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <MagicIcon sx={{ fontSize: 40, color: '#667eea' }} />
                    </motion.div>
                    
                   <Typography 
  variant="h4" 
  sx={{
    color: '#1e293b',
    mb: 3,
    fontWeight: 600,
    fontSize: { xs: '1.5rem', md: '2rem' }
  }}
>
  מערכת ניהול חכמה עם טכנולוגיה מתקדמת</Typography>

                    
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 15, -15, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    >
                      <CelebrationIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                    </motion.div>
                  </Stack>

                  <Typography 
                    variant="h5" 
                    sx={{
                      color: '#64748b',
                      mb: 3,
                      fontWeight: 500,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}
                  >
                    🌟 המערכת החכמה והמתקדמת ביותר לניהול חוגים, תלמידים ומדריכים
                    <br />
                    💡 עם בינה מלאכותית, אנליטיקה מתקדמת וחוויית משתמש מעולה
                  </Typography>

                  {/* Live Stats */}
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={3} 
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 3 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Chip
                        icon={<TrophyIcon />}
                        label="מערכת מובילה בתחום "
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 3,
                          px: 2,
                          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                        }}
                      />
                    </motion.div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <Chip
                        icon={<HeartIcon />}
                        label="אהובה על המשתמשים"
                        sx={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 3,
                          px: 2,
                          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
                        }}
                      />
                    </motion.div>

                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <Chip
                        icon={<LightbulbIcon />}
                        label="חדשנות טכנולוגית"
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '1rem',
                          py: 3,
                          px: 2,
                          boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
                        }}
                      />
                    </motion.div>
                  </Stack>

                  {/* Current Time with Enhanced Design */}
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Box sx={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      borderRadius: '15px',
                      p: 2,
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{
                          color: '#475569',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 2
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                          📅
                        </motion.div>
                        {currentTime.toLocaleDateString('he-IL', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          •
                        </motion.div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          🕐
                        </motion.div>
                        {currentTime.toLocaleTimeString('he-IL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>

              {/* Call to Action Buttons */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mb: 4 }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <RocketIcon />
                        </motion.div>
                      }
                      onClick={() => navigate('/menu')}
                      sx={{
                        background: `
                          linear-gradient(135deg, 
                            #667eea 0%, 
                            #764ba2 50%, 
                            #f093fb 100%
                          )
                        `,
                        backgroundSize: '200% 200%',
                        borderRadius: '25px',
                        px: 6,
                        py: 3,
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        textTransform: 'none',
                        boxShadow: `
                          0 15px 35px rgba(102, 126, 234, 0.4),
                          0 5px 15px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          backgroundPosition: '100% 0',
                          boxShadow: `
                            0 20px 45px rgba(102, 126, 234, 0.6),
                            0 10px 25px rgba(0, 0, 0, 0.2),
                            inset 0 1px 0 rgba(255, 255, 255, 0.4)
                          `,
                          transform: 'translateY(-5px)'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          transition: 'left 0.5s ease'
                        },
                        '&:hover::before': {
                          left: '100%'
                        },
                        animation: 'pulse 3s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%': { boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)' },
                          '50%': { boxShadow: '0 20px 45px rgba(102, 126, 234, 0.6)' },
                          '100%': { boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)' }
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      🚀 בואו נתחיל!
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<InfoIcon />}
                      onClick={() => navigate('/aboutSystem')}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderRadius: '25px',
                        px: 6,
                        py: 3,
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderWidth: '3px',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: '#764ba2',
                          color: '#764ba2',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 15px 30px rgba(102, 126, 234, 0.3)',
                          borderWidth: '3px'
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      💡 גלה עוד
                    </Button>
                  </motion.div>
                </Stack>

                {/* Success Indicators */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                >
                  <Stack 
                    direction={{ xs: 'column', md: 'row' }} 
                    spacing={4} 
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      p: 3,
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {[
                      { icon: '⭐', value: '4.9/5', label: 'דירוג משתמשים', color: '#f59e0b' },
                      { icon: '🏆', value: '99.9%', label: 'זמינות מערכת', color: '#10b981' },
                      { icon: '👥', value: 'בו זמנית  ', label: 'משתמשים פעילים', color: '#3b82f6' },
                      { icon: '🚀', value: '24/7', label: 'תמיכה מקצועית', color: '#8b5cf6' }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                              delay: index * 0.5
                            }}
                            style={{ fontSize: '2rem', marginBottom: '8px' }}
                          >
                            {item.icon}
                          </motion.div>
                          <Typography 
                            variant="h5" 
                            fontWeight="800" 
                            sx={{ color: item.color, mb: 0.5 }}
                          >
                            {item.value}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#64748b', fontWeight: 600 }}
                          >
                            {item.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </motion.div>
            </Box>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {systemStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        width:'250px',
                        border: '2px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.4s ease',
                        '&:hover': {
                          boxShadow: `0 30px 60px ${stat.color}20`,
                          borderColor: stat.color,
                          '& .stat-icon': {
                            transform: 'scale(1.2) rotate(10deg)',
                            background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`
                          }
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, textAlign: 'center' }}>
                        <Avatar
                          className="stat-icon"
                          sx={{
                            width: 70,
                            height: 70,
                            mx: 'auto',
                            mb: 3,
                            background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}30)`,
                            border: `3px solid ${stat.color}40`,
                            transition: 'all 0.4s ease',
                            boxShadow: `0 8px 24px ${stat.color}25`
                          }}
                        >
                          <stat.icon sx={{ fontSize: 35, color: stat.color }} />
                        </Avatar>
                        
                        <Typography variant="h3" fontWeight="700" sx={{ color: stat.color, mb: 1 }}>
                          {stat.value}{stat.unit}
                        </Typography>
                        
                        <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
                          {stat.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 8 }}>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                sx={{ 
                  mb: 4,
                  textAlign: 'center',
                  color: '#1e293b'
                }}
              >
                ⚡ פעולות מהירות
              </Typography>
              
              <Grid container spacing={3}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 1, duration: 0.6 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Card
                        sx={{
                          borderRadius: '16px',
                          cursor: 'pointer',
                          width:'260px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '2px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: `0 25px 50px ${action.color}25`,
                            borderColor: action.color,
                            '& .action-icon': {
                              background: action.color,
                              color: 'white',
                              transform: 'scale(1.1)'
                            }
                          }
                        }}
                        onClick={action.action}
                      >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Avatar
                            className="action-icon"
                            sx={{
                              width: 60,
                              height: 60,
                              mx: 'auto',
                              mb: 2,
                              bgcolor: `${action.color}15`,
                              color: action.color,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <action.icon sx={{ fontSize: 30 }} />
                          </Avatar>
                          
                          <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b', mb: 1 }}>
                            {action.title}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ color: action.color, fontWeight: 600, mb: 1 }}>
                            {action.subtitle}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                            {action.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Main Menu */}
          <motion.div variants={itemVariants}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              borderRadius: '32px',
              p: { xs: 4, md: 6 },
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
              mb: 8
            }}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h4" 
                  fontWeight="700" 
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 2
                  }}
                >
                  🚀 תפריט ראשי מתקדם
                </Typography>
                <Typography variant="h6" color="#64748b" fontWeight="500">
                  כל הכלים שאתה צריך במקום אחד
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                {mainMenuItems.map((item, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 100, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.5, 
                        duration: 1,
                        type: "spring",
                        bounce: 0.3
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -20,
                        rotateY: 8,
                        transition: { duration: 0.4 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{ perspective: '1000px' }}
                    >
                      <Card
                        sx={{
                          borderRadius: '28px',
                          cursor: 'pointer',
                          width:'310px',
                          height: '350px',
                          position: 'relative',
                          overflow: 'hidden',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(30px)',
                          border: '2px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: `
                            0 25px 50px rgba(0, 0, 0, 0.15),
                            0 12px 24px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.9)
                          `,
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            boxShadow: `
                              0 40px 80px ${item.color}25,
                              0 20px 40px rgba(0, 0, 0, 0.2),
                              inset 0 1px 0 rgba(255, 255, 255, 0.9)
                            `,
                            borderColor: item.color,
                            '& .card-icon': {
                              transform: 'scale(1.15) rotate(5deg)',
                              background: item.gradient,
                            },
                            '& .card-badge': {
                              transform: 'scale(1.1)',
                              boxShadow: `0 4px 15px ${item.color}40`
                            },
                            '& .card-glow': {
                              opacity: 1,
                              transform: 'scale(2)'
                            },
                            '& .card-stats': {
                              color: item.color,
                              transform: 'translateY(-2px)'
                            }
                          }
                        }}
                        onClick={() => navigate(item.path)}
                      >
                        {/* Animated Background Glow */}
                        <Box
                          className="card-glow"
                          sx={{
                            position: 'absolute',
                            top: '20%',
                            right: '20%',
                            width: '120px',
                            height: '120px',
                            background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
                            borderRadius: '50%',
                            opacity: 0,
                            transition: 'all 0.6s ease',
                            zIndex: 0
                          }}
                        />

                        {/* Premium Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 3
                          }}
                        >
                          <motion.div
                            className="card-badge"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <Chip
                              label={item.badge}
                              size="small"
                              sx={{
                                background: item.gradient,
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                height: '24px',
                                boxShadow: `0 4px 12px ${item.color}30`,
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                            />
                          </motion.div>
                        </Box>
                        
                        <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Avatar
                              className="card-icon"
                              sx={{
                                width: 80,
                                height: 80,
                                mb: 3,
                                background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)`,
                                border: `3px solid ${item.color}40`,
                                boxShadow: `0 12px 30px ${item.color}25`,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                              }}
                            >
                              <item.icon sx={{ fontSize: 40, color: item.color }} />
                            </Avatar>
                            
                            <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.3 }}>
                              {item.title}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#64748b', 
                                mb: 3, 
                                lineHeight: 1.6,
                                fontSize: '0.9rem'
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Typography 
                              className="card-stats"
                              variant="body2" 
                              fontWeight="600"
                              sx={{ 
                                color: '#94a3b8',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {item.stats}
                            </Typography>
                            
                            <IconButton
                              size="small"
                              sx={{
                                color: item.color,
                                bgcolor: `${item.color}15`,
                                border: `2px solid ${item.color}30`,
                                '&:hover': {
                                  bgcolor: item.color,
                                  color: 'white',
                                  transform: 'translateX(-5px) scale(1.1)',
                                  boxShadow: `0 8px 20px ${item.color}40`
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <ArrowIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div variants={itemVariants}>
            <Box sx={{
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              borderRadius: '32px',
              p: { xs: 6, md: 10 },
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: `
                0 32px 64px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)
              `,
              position: 'relative',
              overflow: 'hidden',
              mb: 8
            }}>
              {/* Animated Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
                  `,
                  zIndex: 0
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Avatar sx={{
                        width: 100,
                        height: 100,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                        border: '4px solid rgba(255, 255, 255, 0.9)'
                      }}>
                        <RocketIcon sx={{ fontSize: 50, color: 'white' }} />
                      </Avatar>
                    </motion.div>
                  </Stack>
                </motion.div>

                <Typography 
                  variant="h3" 
                  fontWeight="800" 
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  ? מוכן להתחיל 🚀
                </Typography>

                <Typography 
                  variant="h6" 
                  sx={{
                    color: '#64748b',
                    mb: 6,
                    fontWeight: 400,
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}
                >
                  התחל את המסע שלך עם המערכת המתקדמת ביותר לניהול חוגים
                </Typography>

                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mb: 6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<DashboardIcon />}
                      onClick={() => navigate('/menu')}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '20px',
                        px: 6,
                        py: 2.5,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-3px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      כניסה למערכת
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<InfoIcon />}
                      onClick={() => navigate('/aboutSystem')}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderRadius: '20px',
                        px: 6,
                        py: 2.5,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderWidth: '2px',
                        '&:hover': {
                          borderColor: '#764ba2',
                          color: '#764ba2',
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 25px rgba(102, 126, 234, 0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      למד עוד
                    </Button>
                  </motion.div>
                </Stack>
              </Box>
            </Box>
          </motion.div>

          {/* Premium Footer */}
          <motion.div variants={itemVariants}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              borderRadius: '24px',
              p: 6,
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%)',
                  zIndex: 0
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                  <Avatar sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}>
                    <BusinessIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h5" fontWeight="700" color="#1e293b">
                      מערכת ניהול חוגים פרימיום
                    </Typography>
                    <Typography variant="body1" color="#64748b">
                      הפתרון המתקדם ביותר לניהול חוגים
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 4, opacity: 0.3 }} />

                <Grid container spacing={4} sx={{ mb: 4, alignItems:'center', marginLeft:'290px' }}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
                      🌟 תכונות
                    </Typography>
                    <Stack spacing={1}>
                      {['ניהול חכם', 'דוחות מתקדמים', 'אבטחה מקסימלית', 'תמיכה 24/7'].map((feature, index) => (
                        <Typography key={index} variant="body2" color="#64748b">
                          • {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
                      📞 יצירת קשר
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="#64748b">
                        📧 easyoffice100@gmail.com
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        📱 03-....
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        🌐 www.system.co.il
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
                      🔒 אמינות
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="#64748b">
                        ✓ הצפנה מתקדמת
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        ✓ גיבוי אוטומטי
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        ✓ תקן ISO 27001
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 4, opacity: 0.3 }} />

                <Box>
                  <Typography variant="body2" color="#94a3b8" sx={{ fontSize: '0.9rem' }}>
                    © 2025 מערכת ניהול חוגים פרימיום • גרסה 2.0 • כל הזכויות שמורות
                  </Typography>
                  
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    {[
                      { icon: SecurityIcon, tooltip: 'אבטחה מתקדמת' },
                      { icon: CloudIcon, tooltip: 'טכנולוגיית ענן' },
                      { icon: SpeedIcon, tooltip: 'ביצועים מהירים' },
                      { icon: ShieldIcon, tooltip: 'הגנה מקסימלית' }
                    ].map((item, index) => (
                      <Tooltip key={index} title={item.tooltip}>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#667eea',
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': {
                              bgcolor: 'rgba(102, 126, 234, 0.2)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <item.icon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Floating Chat Button */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2, duration: 0.8, type: "spring", bounce: 0.6 }}
            style={{
              position: 'fixed',
              bottom: 30,
              left: 30,
              zIndex: 1000
            }}
          >
            <Tooltip title="צ'אט תמיכה מהיר" placement="top">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(102, 126, 234, 0.3)',
                    '0 0 30px rgba(102, 126, 234, 0.6)',
                    '0 0 20px rgba(102, 126, 234, 0.3)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  scale: { duration: 0.2 }
                }}
              >
                <Fab
                  size="large"
                  sx={{
                    width: 70,
                    height: 70,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    border: '3px solid rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setChatOpen(true)}
                >
                  <Badge badgeContent="1" color="error">
                    <ChatIcon sx={{ fontSize: 30 }} />
                  </Badge>
                </Fab>
              </motion.div>
            </Tooltip>
          </motion.div>

          {/* Scroll to Top Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            style={{
              position: 'fixed',
              bottom: 30,
              right: 30,
              zIndex: 1000
            }}
          >
            <Tooltip title="חזור למעלה" placement="top">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Fab
                  size="medium"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    color: '#667eea',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: '2px solid rgba(102, 126, 234, 0.2)',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderColor: '#667eea',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <ArrowIcon sx={{ fontSize: 28, transform: 'rotate(-90deg)' }} />
                </Fab>
              </motion.div>
            </Tooltip>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              zIndex: 1001,
              transformOrigin: 'left'
            }}
          />

        </motion.div>
      </Container>

      {/* Chat Support Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <SupportIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                צ'אט תמיכה
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                אנחנו כאן לעזור לך 24/7
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setChatOpen(false)}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, height: '400px', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <List>
              <AnimatePresence>
                {chatMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        mb: 2
                      }}
                    >
                      <ListItemAvatar sx={{ minWidth: 'auto', mr: message.sender === 'user' ? 0 : 1, ml: message.sender === 'user' ? 1 : 0 }}>
                        <Avatar
                          sx={{
                            bgcolor: message.sender === 'user' ? '#3B82F6' : '#10B981',
                            width: 35,
                            height: 35
                          }}
                        >
                          {message.sender === 'user' ? (
                            <Typography variant="body2" fontWeight="bold">
                              א
                            </Typography>
                          ) : (
                            <BotIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          bgcolor: message.sender === 'user' ? '#3B82F6' : '#F8FAFC',
                          color: message.sender === 'user' ? 'white' : '#1E293B',
                          borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {message.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: 'block',
                            mt: 0.5,
                            fontSize: '0.7rem'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Paper>
                    </ListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#10B981', width: 35, height: 35 }}>
                        <BotIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: '#F8FAFC',
                        borderRadius: '20px 20px 20px 5px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Typography variant="body2" color="#64748B">
                          מקליד...
                        </Typography>
                      </motion.div>
                    </Paper>
                  </ListItem>
                </motion.div>
              )}
            </List>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="הקלד את הודעתך כאן..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '15px',
                  bgcolor: '#F8FAFC'
                }
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  bgcolor: '#667eea',
                  color: 'white',
                  width: 50,
                  height: 50,
                  '&:hover': {
                    bgcolor: '#764ba2'
                  },
                  '&:disabled': {
                    bgcolor: '#E2E8F0',
                    color: '#94A3B8'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </motion.div>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};



export default Home;
