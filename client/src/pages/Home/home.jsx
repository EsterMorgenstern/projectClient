// // import React, { useState, useEffect } from 'react';
// // import {
// //   Box,
// //   Typography,
// //   Grid,
// //   Card,
// //   CardContent,
// //   Button,
// //   Avatar,
// //   Chip,
// //   IconButton,
// //   Stack,
// //   Container,
// //   Badge,
// //   Tooltip,
// //   Divider,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   TextField,
// //   List,
// //   ListItem,
// //   ListItemAvatar,
// //   ListItemText,
// //   Paper,
// //   Fab,
// //   Slide,
// //   useMediaQuery,
// //   useTheme
// // } from '@mui/material';
// // import {
// //   Dashboard as DashboardIcon,
// //   People as StudentsIcon,
// //   School as CoursesIcon,
// //   Person as InstructorsIcon,
// //   Assignment as EnrollIcon,
// //   Assessment as ReportsIcon,
// //   Today as TodayIcon,
// //   CalendarMonth as CalendarIcon,
// //   TrendingUp as TrendingUpIcon,
// //   Notifications as NotificationsIcon,
// //   Schedule as ScheduleIcon,
// //   CheckCircle as AttendanceIcon,
// //   Add as AddIcon,
// //   ArrowForward as ArrowIcon,
// //   Business as BusinessIcon,
// //   Star as StarIcon,
// //   Verified as VerifiedIcon,
// //   Psychology as PsychologyIcon,
// //   Security as SecurityIcon,
// //   FlashOn as FlashOnIcon,
// //   Info as InfoIcon,
// //   Rocket as RocketIcon,
// //   Shield as ShieldIcon,
// //   Cloud as CloudIcon,
// //   Speed as SpeedIcon,
// //   Chat as ChatIcon,
// //   Send as SendIcon,
// //   Close as CloseIcon,
// //   SupportAgent as SupportIcon,
// //   SmartToy as BotIcon
// // } from '@mui/icons-material';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchStudents } from '../store/student/studentGetAllThunk';
// // import { fetchCourses } from '../store/course/CoursesGetAllThunk';
// // import { fetchInstructors } from '../store/instructor/instructorGetAllThunk';

// // // Transition component for Dialog
// // const Transition = React.forwardRef(function Transition(props, ref) {
// //   return <Slide direction="up" ref={ref} {...props} />;
// // });

// // const Home = () => {
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// //   // Redux state
// //   const students = useSelector(state => state.students.students || []);
// //   const courses = useSelector(state => state.courses.courses || []);
// //   const instructors = useSelector(state => state.instructors.instructors || []);

// //   // Local state
// //   const [currentTime, setCurrentTime] = useState(new Date());
// //   const [chatOpen, setChatOpen] = useState(false);
// //   const [chatMessages, setChatMessages] = useState([
// //     {
// //       id: 1,
// //       text: '? שלום! אני כאן לעזור לך עם המערכת. איך אוכל לסייע',
// //       sender: 'bot',
// //       timestamp: new Date()
// //     }
// //   ]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [isTyping, setIsTyping] = useState(false);

// //   // Chat support responses
// //   const chatResponses = {
// //     'שלום': 'שלום! איך אוכל לעזור לך היום?',
// //     'עזרה': 'אני כאן לעזור! על מה תרצה לשמוע? תלמידים, חוגים, מדריכים או נוכחות?',
// //     'תלמידים': 'לניהול תלמידים: לך לתפריט "ניהול תלמידים" או לחץ על הקישור המהיר. שם תוכל להוסיף, לערוך ולצפות בפרטי התלמידים.',
// //     'חוגים': 'לניהול חוגים: בתפריט "ניהול חוגים" תוכל ליצור חוגים חדשים, לערוך קיימים ולנהל קבוצות.',
// //     'נוכחות': 'לרישום נוכחות: השתמש בתפריט "ניהול נוכחות" או בפעולה המהירה "רשום נוכחות".',
// //     'בעיה': 'מה הבעיה שאתה נתקל בה? אני אעזור לך לפתור אותה.',
// //     'תודה': 'בשמחה! אם יש עוד שאלות, אני כאן.',
// //     'default': 'מצטער, לא הבנתי את השאלה. נסה לשאול על: תלמידים, חוגים, מדריכים, נוכחות או עזרה כללית.'
// //   };

// //   useEffect(() => {
// //     // טעינת נתונים בסיסיים
// //     dispatch(fetchStudents());
// //     dispatch(fetchCourses());
// //     dispatch(fetchInstructors());

// //     // עדכון שעה כל דקה
// //     const timer = setInterval(() => {
// //       setCurrentTime(new Date());
// //     }, 60000);

// //     return () => clearInterval(timer);
// //   }, [dispatch]);

// //   // נתונים סטטיסטיים
// //   const stats = {
// //     totalUsers: 12547,
// //     activeToday: 1834,
// //     systemUptime: 99.9,
// //     dataProcessed: 2.4
// //   };

// //   const systemStats = [
// //     { title: 'תלמידים', value: students.length, icon: StudentsIcon, color: '#3B82F6', unit: '' },
// //     { title: 'חוגים', value: courses.length, icon: CoursesIcon, color: '#10B981', unit: '' },
// //     { title: 'מדריכים', value: instructors.length, icon: InstructorsIcon, color: '#F59E0B', unit: '' },
// //     { title: 'נוכחות', value: 94, icon: AttendanceIcon, color: '#8B5CF6', unit: '%' }
// //   ];

// //   // ברכה דינמית
// //   const getGreeting = () => {
// //     const hour = currentTime.getHours();
// //     if (hour < 12) return 'בוקר טוב';
// //     if (hour < 17) return 'צהריים טובים';
// //     if (hour < 21) return 'ערב טוב';
// //     return 'לילה טוב';
// //   };

// //   const greeting = getGreeting();

// //   // פעולות מהירות
// //   const quickActions = [
// //     {
// //       title: 'הוסף תלמיד',
// //       subtitle: 'רישום מהיר',
// //       description: 'הוסף תלמיד חדש למערכת בקלות ובמהירות',
// //       icon: AddIcon,
// //       action: () => navigate('/students'),
// //       color: '#3B82F6'
// //     },
// //     {
// //       title: 'שבץ לחוג',
// //       subtitle: 'שיבוץ חכם',
// //       description: 'שבץ תלמידים לחוגים עם המלצות אוטומטיות',
// //       icon: EnrollIcon,
// //       action: () => navigate('/entrollStudent'),
// //       color: '#10B981'
// //     },
// //     {
// //       title: 'רשום נוכחות',
// //       subtitle: 'מעקב יומי',
// //       description: 'רשום נוכחות תלמידים במהירות ובדיוק',
// //       icon: AttendanceIcon,
// //       action: () => navigate('/attendanceCalendar'),
// //       color: '#F59E0B'
// //     },
// //     {
// //       title: 'צפה בדוחות',
// //       subtitle: 'ניתוח נתונים',
// //       description: 'דוחות מפורטים וסטטיסטיקות מתקדמות',
// //       icon: ReportsIcon,
// //       action: () => navigate('/reports'),
// //       color: '#8B5CF6'
// //     }
// //   ];

// //   // תפריט ראשי
// //   const mainMenuItems = [
// //     {
// //       title: 'ניהול תלמידים',
// //       description: 'הוספה, עריכה וצפיה בפרטי תלמידים עם כלים מתקדמים',
// //       icon: StudentsIcon,
// //       path: '/students',
// //       color: '#3B82F6',
// //       gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
// //       badge: 'מתקדם',
// //       stats: `${students.length} תלמידים`
// //     },
// //     {
// //       title: 'ניהול חוגים',
// //       description: 'ניהול חוגים, קבוצות וסניפים עם מערכת שיבוץ חכמה',
// //       icon: CoursesIcon,
// //       path: '/attendanceCalendar',
// //       color: '#10B981',
// //       gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
// //       badge: 'פופולרי',
// //       stats: `${courses.length} חוגים`
// //     },
// //     {
// //       title: 'ניהול מדריכים',
// //       description: 'הוספה ועריכת פרטי מדריכים עם מערכת הערכות',
// //       icon: InstructorsIcon,
// //       path: '/instructors',
// //       color: '#F59E0B',
// //       gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
// //       badge: 'חדש',
// //       stats: `${instructors.length} מדריכים`
// //     },
// //     {
// //       title: 'שיבוץ תלמידים',
// //       description: 'רישום תלמידים לחוגים וקבוצות עם בינה מלאכותית',
// //       icon: EnrollIcon,
// //       path: '/entrollStudent',
// //       color: '#EF4444',
// //       gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
// //       badge: 'AI',
// //       stats: 'שיבוץ חכם'
// //     },
// //     {
// //       title: 'ניהול נוכחות',
// //       description: 'רישום נוכחות ומעקב אחר השתתפות עם התראות',
// //       icon: TodayIcon,
// //       path: '/attendanceCalendar',
// //       color: '#8B5CF6',
// //       gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
// //       badge: 'חיוני',
// //       stats: '94% נוכחות'
// //     },
// //     {
// //       title: 'דוחות וסטטיסטיקות',
// //       description: 'דוחות מפורטים ואנליטיקה מתקדמת עם גרפים',
// //       icon: ReportsIcon,
// //       path: '/reports',
// //       color: '#06B6D4',
// //       gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
// //       badge: 'פרו',
// //       stats: 'ניתוח מתקדם'
// //     }
// //   ];

// //   // Chat functions
// //   const handleSendMessage = () => {
// //     if (!newMessage.trim()) return;

// //     const userMessage = {
// //       id: Date.now(),
// //       text: newMessage,
// //       sender: 'user',
// //       timestamp: new Date()
// //     };

// //     setChatMessages(prev => [...prev, userMessage]);
// //     setNewMessage('');
// //     setIsTyping(true);

// //     // Simulate bot response
// //     setTimeout(() => {
// //       const botResponse = getBotResponse(newMessage);
// //       const botMessage = {
// //         id: Date.now() + 1,
// //         text: botResponse,
// //         sender: 'bot',
// //         timestamp: new Date()
// //       };
// //       setChatMessages(prev => [...prev, botMessage]);
// //       setIsTyping(false);
// //     }, 1000 + Math.random() * 2000);
// //   };

// //   const getBotResponse = (message) => {
// //     const lowerMessage = message.toLowerCase();

// //     for (const [key, response] of Object.entries(chatResponses)) {
// //       if (lowerMessage.includes(key)) {
// //         return response;
// //       }
// //     }

// //     return chatResponses.default;
// //   };

// //   const handleKeyPress = (event) => {
// //     if (event.key === 'Enter' && !event.shiftKey) {
// //       event.preventDefault();
// //       handleSendMessage();
// //     }
// //   };

// //   // Animation variants
// //   const containerVariants = {
// //     hidden: { opacity: 0 },
// //     visible: {
// //       opacity: 1,
// //       transition: {
// //         staggerChildren: 0.2,
// //         duration: 0.8
// //       }
// //     }
// //   };

// //   const itemVariants = {
// //     hidden: { y: 50, opacity: 0 },
// //     visible: {
// //       y: 0,
// //       opacity: 1,
// //       transition: { duration: 0.8, ease: "easeOut" }
// //     }
// //   };

// //   return (
// //     <Box sx={{
// //       minHeight: '100vh',
// //       background: `
// //         linear-gradient(135deg, rgba(106, 130, 239, 0.1) 0%, rgba(75, 162, 159, 0.1) 100%),
// //         radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
// //         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
// //         radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
// //       `,
// //       position: 'relative',
// //       overflow: 'hidden'
// //     }}>
// //       {/* Animated Background Elements */}
// //       <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
// //         {[...Array(6)].map((_, i) => (
// //           <motion.div
// //             key={i}
// //             style={{
// //               position: 'absolute',
// //               width: Math.random() * 300 + 100,
// //               height: Math.random() * 300 + 100,
// //               borderRadius: '50%',
// //               background: `radial-gradient(circle, ${
// //                            ['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][i % 4]
// //               } 0%, transparent 70%)`,
// //               top: `${Math.random() * 100}%`,
// //               left: `${Math.random() * 100}%`,
// //             }}
// //             animate={{
// //               x: [0, Math.random() * 100 - 50],
// //               y: [0, Math.random() * 100 - 50],
// //               scale: [1, 1.2, 1],
// //             }}
// //             transition={{
// //               duration: Math.random() * 20 + 10,
// //               repeat: Infinity,
// //               repeatType: "reverse",
// //               ease: "easeInOut"
// //             }}
// //           />
// //         ))}
// //       </Box>

// //       <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
// //         <motion.div
// //           variants={containerVariants}
// //           initial="hidden"
// //           animate="visible"
// //         >
// //           {/* Hero Section */}
// //           <motion.div variants={itemVariants}>
// //             <Box sx={{ textAlign: 'center', mb: 8 }}>
// //               <motion.div
// //                 initial={{ scale: 0.5, opacity: 0 }}
// //                 animate={{ scale: 1, opacity: 1 }}
// //                 transition={{ duration: 1, delay: 0.2 }}
// //               >
// //                 <Typography 
// //                   variant="h2" 
// //                   fontWeight="800" 
// //                   sx={{
// //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                     backgroundClip: 'text',
// //                     WebkitBackgroundClip: 'text',
// //                     color: 'transparent',
// //                     mb: 2,
// //                     fontSize: { xs: '2.5rem', md: '3.5rem' }
// //                   }}
// //                 >
// //                 👋 !{greeting} 
// //                 </Typography>
// //               </motion.div>

// //               <motion.div
// //                 initial={{ y: 30, opacity: 0 }}
// //                 animate={{ y: 0, opacity: 1 }}
// //                 transition={{ duration: 0.8, delay: 0.5 }}
// //               >
// //                 <Typography 
// //                   variant="h4" 
// //                   sx={{
// //                     color: '#1e293b',
// //                     mb: 3,
// //                     fontWeight: 600,
// //                     fontSize: { xs: '1.5rem', md: '2rem' }
// //                   }}
// //                 >
// //                   ברוכים הבאים למערכת ניהול החוגים  
// //                 </Typography>
// //               </motion.div>

// //               <motion.div
// //                 initial={{ y: 30, opacity: 0 }}
// //                 animate={{ y: 0, opacity: 1 }}
// //                 transition={{ duration: 0.8, delay: 0.7 }}
// //               >
// //                 <Typography 
// //                   variant="h6" 
// //                   sx={{
// //                     color: '#64748b',
// //                     mb: 4,
// //                     maxWidth: '800px',
// //                     mx: 'auto',
// //                     lineHeight: 1.6
// //                   }}
// //                 >
// //                   {currentTime.toLocaleDateString('he-IL', { 
// //                     weekday: 'long', 
// //                     year: 'numeric', 
// //                     month: 'long', 
// //                     day: 'numeric' 
// //                   })} • {currentTime.toLocaleTimeString('he-IL', { 
// //                     hour: '2-digit', 
// //                     minute: '2-digit' 
// //                   })}
// //                 </Typography>
// //               </motion.div>
// //             </Box>
// //           </motion.div>

// //           {/* Statistics Cards */}
// //           <motion.div variants={itemVariants}>
// //             <Grid container spacing={3} sx={{ mb: 6 }}>
// //               {systemStats.map((stat, index) => (
// //                 <Grid item xs={12} sm={6} md={3} key={index}>
// //                   <motion.div
// //                     initial={{ opacity: 0, y: 50, scale: 0.9 }}
// //                     animate={{ opacity: 1, y: 0, scale: 1 }}
// //                     transition={{ delay: index * 0.1 + 0.8, duration: 0.6 }}
// //                     whileHover={{ scale: 1.05, y: -10 }}
// //                   >
// //                     <Card
// //                       sx={{
// //                         background: 'rgba(255, 255, 255, 0.95)',
// //                         backdropFilter: 'blur(20px)',
// //                         borderRadius: '20px',
// //                         width:'250px',
// //                         border: '2px solid rgba(255, 255, 255, 0.8)',
// //                         boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
// //                         overflow: 'hidden',
// //                         position: 'relative',
// //                         transition: 'all 0.4s ease',
// //                         '&:hover': {
// //                           boxShadow: `0 30px 60px ${stat.color}20`,
// //                           borderColor: stat.color,
// //                           '& .stat-icon': {
// //                             transform: 'scale(1.2) rotate(10deg)',
// //                             background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`
// //                           }
// //                         }
// //                       }}
// //                     >
// //                       <CardContent sx={{ p: 4, textAlign: 'center' }}>
// //                         <Avatar
// //                           className="stat-icon"
// //                           sx={{
// //                             width: 70,
// //                             height: 70,
// //                             mx: 'auto',
// //                             mb: 3,
// //                             background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}30)`,
// //                             border: `3px solid ${stat.color}40`,
// //                             transition: 'all 0.4s ease',
// //                             boxShadow: `0 8px 24px ${stat.color}25`
// //                           }}
// //                         >
// //                           <stat.icon sx={{ fontSize: 35, color: stat.color }} />
// //                         </Avatar>

// //                         <Typography variant="h3" fontWeight="700" sx={{ color: stat.color, mb: 1 }}>
// //                           {stat.value}{stat.unit}
// //                         </Typography>

// //                         <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
// //                           {stat.title}
// //                         </Typography>
// //                       </CardContent>
// //                     </Card>
// //                   </motion.div>
// //                 </Grid>
// //               ))}
// //             </Grid>
// //           </motion.div>

// //           {/* Quick Actions */}
// //           <motion.div variants={itemVariants}>
// //             <Box sx={{ mb: 8 }}>
// //               <Typography 
// //                 variant="h4" 
// //                 fontWeight="700" 
// //                 sx={{ 
// //                   mb: 4,
// //                   textAlign: 'center',
// //                   color: '#1e293b'
// //                 }}
// //               >
// //                 ⚡ פעולות מהירות
// //               </Typography>

// //               <Grid container spacing={3}>
// //                 {quickActions.map((action, index) => (
// //                   <Grid item xs={12} sm={6} md={3} key={index}>
// //                     <motion.div
// //                       initial={{ opacity: 0, y: 30 }}
// //                       animate={{ opacity: 1, y: 0 }}
// //                       transition={{ delay: index * 0.1 + 1, duration: 0.6 }}
// //                       whileHover={{ scale: 1.03, y: -5 }}
// //                       whileTap={{ scale: 0.97 }}
// //                     >
// //                       <Card
// //                         sx={{
// //                           borderRadius: '16px',
// //                           cursor: 'pointer',
// //                           width:'260px',
// //                           background: 'rgba(255, 255, 255, 0.95)',
// //                           backdropFilter: 'blur(20px)',
// //                           border: '2px solid rgba(255, 255, 255, 0.8)',
// //                           boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
// //                           transition: 'all 0.3s ease',
// //                           '&:hover': {
// //                             boxShadow: `0 25px 50px ${action.color}25`,
// //                             borderColor: action.color,
// //                             '& .action-icon': {
// //                               background: action.color,
// //                               color: 'white',
// //                               transform: 'scale(1.1)'
// //                             }
// //                           }
// //                         }}
// //                         onClick={action.action}
// //                       >
// //                         <CardContent sx={{ p: 3, textAlign: 'center' }}>
// //                           <Avatar
// //                             className="action-icon"
// //                             sx={{
// //                               width: 60,
// //                               height: 60,
// //                               mx: 'auto',
// //                               mb: 2,
// //                               bgcolor: `${action.color}15`,
// //                               color: action.color,
// //                               transition: 'all 0.3s ease'
// //                             }}
// //                           >
// //                             <action.icon sx={{ fontSize: 30 }} />
// //                           </Avatar>

// //                           <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b', mb: 1 }}>
// //                             {action.title}
// //                           </Typography>

// //                           <Typography variant="body2" sx={{ color: action.color, fontWeight: 600, mb: 1 }}>
// //                             {action.subtitle}
// //                           </Typography>

// //                           <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem' }}>
// //                             {action.description}
// //                           </Typography>
// //                         </CardContent>
// //                       </Card>
// //                     </motion.div>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Box>
// //           </motion.div>

// //           {/* Main Menu */}
// //           <motion.div variants={itemVariants}>
// //             <Box sx={{
// //               background: 'rgba(255, 255, 255, 0.95)',
// //               backdropFilter: 'blur(30px)',
// //               borderRadius: '32px',
// //               p: { xs: 4, md: 6 },
// //               border: '2px solid rgba(255, 255, 255, 0.8)',
// //               boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
// //               mb: 8
// //             }}>
// //               <Box sx={{ textAlign: 'center', mb: 6 }}>
// //                 <Typography 
// //                   variant="h4" 
// //                   fontWeight="700" 
// //                   sx={{
// //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                     backgroundClip: 'text',
// //                     WebkitBackgroundClip: 'text',
// //                     color: 'transparent',
// //                     mb: 2
// //                   }}
// //                 >
// //                   🚀 תפריט ראשי מתקדם
// //                 </Typography>
// //                 <Typography variant="h6" color="#64748b" fontWeight="500">
// //                   כל הכלים שאתה צריך במקום אחד
// //                 </Typography>
// //               </Box>

// //               <Grid container spacing={4}>
// //                 {mainMenuItems.map((item, index) => (
// //                   <Grid item xs={12} sm={6} lg={4} key={index}>
// //                     <motion.div

// //                       initial={{ opacity: 0, y: 100, scale: 0.8 }}
// //                       animate={{ opacity: 1, y: 0, scale: 1 }}
// //                       transition={{ 
// //                         delay: index * 0.1 + 0.5, 
// //                         duration: 1,
// //                         type: "spring",
// //                         bounce: 0.3
// //                       }}
// //                       whileHover={{ 
// //                         scale: 1.05, 
// //                         y: -20,
// //                         rotateY: 8,
// //                         transition: { duration: 0.4 }
// //                       }}
// //                       whileTap={{ scale: 0.95 }}
// //                       style={{ perspective: '1000px' }}
// //                     >
// //                       <Card
// //                         sx={{
// //                           borderRadius: '28px',
// //                           cursor: 'pointer',
// //                           width:'310px',
// //                           height: '350px',
// //                           position: 'relative',
// //                           overflow: 'hidden',
// //                           background: 'rgba(255, 255, 255, 0.95)',
// //                           backdropFilter: 'blur(30px)',
// //                           border: '2px solid rgba(255, 255, 255, 0.8)',
// //                           boxShadow: `
// //                             0 25px 50px rgba(0, 0, 0, 0.15),
// //                             0 12px 24px rgba(0, 0, 0, 0.1),
// //                             inset 0 1px 0 rgba(255, 255, 255, 0.9)
// //                           `,
// //                           transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
// //                           '&:hover': {
// //                             boxShadow: `
// //                               0 40px 80px ${item.color}25,
// //                               0 20px 40px rgba(0, 0, 0, 0.2),
// //                               inset 0 1px 0 rgba(255, 255, 255, 0.9)
// //                             `,
// //                             borderColor: item.color,
// //                             '& .card-icon': {
// //                               transform: 'scale(1.15) rotate(5deg)',
// //                               background: item.gradient,
// //                             },
// //                             '& .card-badge': {
// //                               transform: 'scale(1.1)',
// //                               boxShadow: `0 4px 15px ${item.color}40`
// //                             },
// //                             '& .card-glow': {
// //                               opacity: 1,
// //                               transform: 'scale(2)'
// //                             },
// //                             '& .card-stats': {
// //                               color: item.color,
// //                               transform: 'translateY(-2px)'
// //                             }
// //                           }
// //                         }}
// //                         onClick={() => navigate(item.path)}
// //                       >
// //                         {/* Animated Background Glow */}
// //                         <Box
// //                           className="card-glow"
// //                           sx={{
// //                             position: 'absolute',
// //                             top: '20%',
// //                             right: '20%',
// //                             width: '120px',
// //                             height: '120px',
// //                             background: `radial-gradient(circle, ${item.color}15 0%, transparent 70%)`,
// //                             borderRadius: '50%',
// //                             opacity: 0,
// //                             transition: 'all 0.6s ease',
// //                             zIndex: 0
// //                           }}
// //                         />

// //                         {/* Premium Badge */}
// //                         <Box
// //                           sx={{
// //                             position: 'absolute',
// //                             top: 16,
// //                             right: 16,
// //                             zIndex: 3
// //                           }}
// //                         >
// //                           <motion.div
// //                             className="card-badge"
// //                             whileHover={{ rotate: [0, -10, 10, 0] }}
// //                             // transition={{ duration: 0
// //                             transition={{ duration: 0.5 }}
// //                           >
// //                             <Chip
// //                               label={item.badge}
// //                               size="small"
// //                               sx={{
// //                                 background: item.gradient,
// //                                 color: 'white',
// //                                 fontWeight: 700,
// //                                 fontSize: '0.7rem',
// //                                 height: '24px',
// //                                 boxShadow: `0 4px 12px ${item.color}30`,
// //                                 border: '1px solid rgba(255, 255, 255, 0.3)',
// //                                 transition: 'all 0.3s ease'
// //                               }}
// //                             />
// //                           </motion.div>
// //                         </Box>

// //                         <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
// //                           <Box sx={{ flex: 1 }}>
// //                             <Avatar
// //                               className="card-icon"
// //                               sx={{
// //                                 width: 80,
// //                                 height: 80,
// //                                 mb: 3,
// //                                 background: `linear-gradient(135deg, ${item.color}20, ${item.color}30)`,
// //                                 border: `3px solid ${item.color}40`,
// //                                 boxShadow: `0 12px 30px ${item.color}25`,
// //                                 transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
// //                               }}
// //                             >
// //                               <item.icon sx={{ fontSize: 40, color: item.color }} />
// //                             </Avatar>

// //                             <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b', mb: 2, lineHeight: 1.3 }}>
// //                               {item.title}
// //                             </Typography>

// //                             <Typography 
// //                               variant="body2" 
// //                               sx={{ 
// //                                 color: '#64748b', 
// //                                 mb: 3, 
// //                                 lineHeight: 1.6,
// //                                 fontSize: '0.9rem'
// //                               }}
// //                             >
// //                               {item.description}
// //                             </Typography>
// //                           </Box>

// //                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
// //                             <Typography 
// //                               className="card-stats"
// //                               variant="body2" 
// //                               fontWeight="600"
// //                               sx={{ 
// //                                 color: '#94a3b8',
// //                                 transition: 'all 0.3s ease'
// //                               }}
// //                             >
// //                               {item.stats}
// //                             </Typography>

// //                             <IconButton
// //                               size="small"
// //                               sx={{
// //                                 color: item.color,
// //                                 bgcolor: `${item.color}15`,
// //                                 border: `2px solid ${item.color}30`,
// //                                 '&:hover': {
// //                                   bgcolor: item.color,
// //                                   color: 'white',
// //                                   transform: 'translateX(-5px) scale(1.1)',
// //                                   boxShadow: `0 8px 20px ${item.color}40`
// //                                 },
// //                                 transition: 'all 0.3s ease'
// //                               }}
// //                             >
// //                               <ArrowIcon />
// //                             </IconButton>
// //                           </Box>
// //                         </CardContent>
// //                       </Card>
// //                     </motion.div>
// //                   </Grid>
// //                 ))}
// //               </Grid>
// //             </Box>
// //           </motion.div>

// //           {/* Call to Action Section */}
// //           <motion.div variants={itemVariants}>
// //             <Box sx={{
// //               textAlign: 'center',
// //               background: 'rgba(255, 255, 255, 0.95)',
// //               backdropFilter: 'blur(30px)',
// //               borderRadius: '32px',
// //               p: { xs: 6, md: 10 },
// //               border: '2px solid rgba(255, 255, 255, 0.8)',
// //               boxShadow: `
// //                 0 32px 64px rgba(0, 0, 0, 0.15),
// //                 inset 0 1px 0 rgba(255, 255, 255, 0.8)
// //               `,
// //               position: 'relative',
// //               overflow: 'hidden',
// //               mb: 8
// //             }}>
// //               {/* Animated Background Pattern */}
// //               <Box
// //                 sx={{
// //                   position: 'absolute',
// //                   top: 0,
// //                   left: 0,
// //                   right: 0,
// //                   bottom: 0,
// //                   background: `
// //                     radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
// //                     radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
// //                   `,
// //                   zIndex: 0
// //                 }}
// //               />

// //               <Box sx={{ position: 'relative', zIndex: 1 }}>
// //                 <motion.div
// //                   initial={{ scale: 0.8, opacity: 0 }}
// //                   animate={{ scale: 1, opacity: 1 }}
// //                   transition={{ duration: 1, delay: 1.2 }}
// //                 >
// //                   <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
// //                     <motion.div
// //                       animate={{ rotate: 360 }}
// //                       transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
// //                     >
// //                       <Avatar sx={{
// //                         width: 100,
// //                         height: 100,
// //                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                         boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
// //                         border: '4px solid rgba(255, 255, 255, 0.9)'
// //                       }}>
// //                         <RocketIcon sx={{ fontSize: 50, color: 'white' }} />
// //                       </Avatar>
// //                     </motion.div>
// //                   </Stack>
// //                 </motion.div>

// //                 <Typography 
// //                   variant="h3" 
// //                   fontWeight="800" 
// //                   sx={{
// //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                     backgroundClip: 'text',
// //                     WebkitBackgroundClip: 'text',
// //                     color: 'transparent',
// //                     mb: 3,
// //                     lineHeight: 1.2
// //                   }}
// //                 >
// //                   ? מוכן להתחיל 🚀
// //                 </Typography>



// //                 <Typography 
// //                   variant="h6" 
// //                   sx={{
// //                     color: '#64748b',
// //                     mb: 6,
// //                     fontWeight: 400,
// //                     maxWidth: '600px',
// //                     mx: 'auto',
// //                     lineHeight: 1.6
// //                   }}
// //                 >
// //                   התחל את המסע שלך עם המערכת המתקדמת ביותר לניהול חוגים
// //                 </Typography>

// //                 <Stack 
// //                   direction={{ xs: 'column', sm: 'row' }} 
// //                   spacing={3} 
// //                   justifyContent="center"
// //                   alignItems="center"
// //                   sx={{ mb: 6 }}
// //                 >
// //                   <motion.div
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                   >
// //                     <Button
// //                       variant="contained"
// //                       size="large"
// //                       startIcon={<DashboardIcon />}
// //                       onClick={() => navigate('/menu')}
// //                       sx={{
// //                         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                         borderRadius: '20px',
// //                         px: 6,
// //                         py: 2.5,
// //                         fontSize: '1.2rem',
// //                         fontWeight: 700,
// //                         textTransform: 'none',
// //                         boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
// //                         border: '2px solid rgba(255, 255, 255, 0.3)',
// //                         '&:hover': {
// //                           boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
// //                           transform: 'translateY(-3px)'
// //                         },
// //                         transition: 'all 0.3s ease'
// //                       }}
// //                     >
// //                       כניסה למערכת
// //                     </Button>
// //                   </motion.div>

// //                   <motion.div
// //                     whileHover={{ scale: 1.05 }}
// //                     whileTap={{ scale: 0.95 }}
// //                   >
// //                     <Button
// //                       variant="outlined"
// //                       size="large"
// //                       startIcon={<InfoIcon />}
// //                       onClick={() => navigate('/aboutSystem')}
// //                       sx={{
// //                         borderColor: '#667eea',
// //                         color: '#667eea',
// //                         borderRadius: '20px',
// //                         px: 6,
// //                         py: 2.5,
// //                         fontSize: '1.2rem',
// //                         fontWeight: 700,
// //                         textTransform: 'none',
// //                         borderWidth: '2px',
// //                         '&:hover': {
// //                           borderColor: '#764ba2',
// //                           color: '#764ba2',
// //                           backgroundColor: 'rgba(102, 126, 234, 0.05)',
// //                           transform: 'translateY(-3px)',
// //                           boxShadow: '0 12px 25px rgba(102, 126, 234, 0.2)'
// //                         },
// //                         transition: 'all 0.3s ease'
// //                       }}
// //                     >
// //                       למד עוד
// //                     </Button>
// //                   </motion.div>
// //                 </Stack>

// //                 {/* Trust Indicators
// //                 <Box sx={{
// //                   background: 'rgba(16, 185, 129, 0.05)',
// //                   borderRadius: '20px',
// //                   p: 4,
// //                   border: '1px solid rgba(16, 185, 129, 0.2)'
// //                 }}>
// //                   <Typography variant="h6" fontWeight="600" sx={{ color: '#10B981', mb: 3 }}>
// //                     למה בוחרים בנו? ✨
// //                   </Typography>

// //                   <Grid container spacing={3} justifyContent="center">
// //                     {[
// //                       { icon: VerifiedIcon, text: 'מוסדות מובילים', value: '500+' },
// //                       { icon: StudentsIcon, text: 'תלמידים פעילים', value: '50K+' },
// //                       { icon: ShieldIcon, text: 'זמינות מערכת', value: '99.9%' },
// //                       { icon: StarIcon, text: 'דירוג שביעות רצון', value: '4.9/5' }
// //                     ].map((item, index) => (
// //                       <Grid item xs={6} sm={3} key={index}>
// //                         <motion.div
// //                           initial={{ opacity: 0, y: 20 }}
// //                           animate={{ opacity: 1, y: 0 }}
// //                           transition={{ delay: 1.5 + index * 0.1 }}
// //                         >
// //                           <Box sx={{ textAlign: 'center' }}>
// //                             <Avatar sx={{
// //                               width: 50,
// //                               height: 50,
// //                               mx: 'auto',
// //                               mb: 2,
// //                               bgcolor: 'rgba(16, 185, 129, 0.1)',
// //                               border: '2px solid rgba(16, 185, 129, 0.3)'
// //                             }}>
// //                               <item.icon sx={{ color: '#10B981' }} />
// //                             </Avatar>
// //                             <Typography variant="h6" fontWeight="700" color="#10B981">
// //                               {item.value}
// //                             </Typography>
// //                             <Typography variant="body2" color="#64748b" fontSize="0.85rem">
// //                               {item.text}
// //                             </Typography>
// //                           </Box>
// //                         </motion.div>
// //                       </Grid>
// //                     ))}
// //                   </Grid> */}
// //                 {/* </Box> */}
// //               </Box>
// //             </Box>
// //           </motion.div>

// //           {/* Premium Footer */}
// //           <motion.div variants={itemVariants}>
// //             <Box sx={{
// //               background: 'rgba(255, 255, 255, 0.95)',
// //               backdropFilter: 'blur(30px)',
// //               borderRadius: '24px',
// //               p: 6,
// //               border: '2px solid rgba(255, 255, 255, 0.8)',
// //               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
// //               textAlign: 'center',
// //               position: 'relative',
// //               overflow: 'hidden'
// //             }}>
// //               <Box
// //                 sx={{
// //                   position: 'absolute',
// //                   top: 0,
// //                   left: 0,
// //                   right: 0,
// //                   bottom: 0,
// //                   background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.02) 0%, transparent 100%)',
// //                   zIndex: 0
// //                 }}
// //               />

// //               <Box sx={{ position: 'relative', zIndex: 1 }}>
// //                 <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
// //                   <Avatar sx={{
// //                     width: 60,
// //                     height: 60,
// //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                     boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
// //                   }}>
// //                     <BusinessIcon sx={{ fontSize: 30 }} />
// //                   </Avatar>

// //                   <Box sx={{ textAlign: 'left' }}>
// //                     <Typography variant="h5" fontWeight="700" color="#1e293b">
// //                       מערכת ניהול חוגים פרימיום
// //                     </Typography>
// //                     <Typography variant="body1" color="#64748b">
// //                       הפתרון המתקדם ביותר לניהול חוגים
// //                     </Typography>
// //                   </Box>
// //                 </Stack>

// //                 <Divider sx={{ mb: 4, opacity: 0.3 }} />

// //                 <Grid container spacing={4} sx={{ mb: 4 ,alignItems:'center',marginLeft:'290px'}}>
// //                   <Grid item xs={12} md={4}>
// //                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
// //                       🌟 תכונות
// //                     </Typography>
// //                     <Stack spacing={1}>
// //                       {['ניהול חכם', 'דוחות מתקדמים', 'אבטחה מקסימלית', 'תמיכה 24/7'].map((feature, index) => (
// //                         <Typography key={index} variant="body2" color="#64748b">
// //                           • {feature}
// //                         </Typography>
// //                       ))}
// //                     </Stack>
// //                   </Grid>

// //                   <Grid item xs={12} md={4}>
// //                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
// //                       📞 יצירת קשר
// //                     </Typography>
// //                     <Stack spacing={1}>
// //                       <Typography variant="body2" color="#64748b">
// //                         📧 easyoffice100@gmail.com
// //                       </Typography>
// //                       <Typography variant="body2" color="#64748b">
// //                         📱 03-....
// //                       </Typography>
// //                       <Typography variant="body2" color="#64748b">
// //                         🌐 www.system.co.il
// //                       </Typography>
// //                     </Stack>
// //                   </Grid>

// //                   <Grid item xs={12} md={4}>
// //                     <Typography variant="h6" fontWeight="600" color="#1e293b" sx={{ mb: 2 }}>
// //                       🔒 אמינות
// //                     </Typography>
// //                     <Stack spacing={1}>
// //                       <Typography variant="body2" color="#64748b">
// //                         ✓ הצפנה מתקדמת
// //                       </Typography>
// //                       <Typography variant="body2" color="#64748b">
// //                         ✓ גיבוי אוטומטי
// //                       </Typography>
// //                       <Typography variant="body2" color="#64748b">
// //                         ✓ תקן ISO 27001
// //                       </Typography>
// //                     </Stack>
// //                   </Grid>
// //                 </Grid>

// //                 <Divider sx={{ mb: 4, opacity: 0.3 }} />

// //                 <Box>
// //                   <Typography variant="body2" color="#94a3b8" sx={{ fontSize: '0.9rem' }}>
// //                     © 2025 מערכת ניהול חוגים פרימיום • גרסה 2.0 • כל הזכויות שמורות
// //                   </Typography>

// //                   <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
// //                     {[
// //                       { icon: SecurityIcon, tooltip: 'אבטחה מתקדמת' },
// //                       { icon: CloudIcon, tooltip: 'טכנולוגיית ענן' },
// //                       { icon: SpeedIcon, tooltip: 'ביצועים מהירים' },
// //                       { icon: ShieldIcon, tooltip: 'הגנה מקסימלית' }
// //                     ].map((item, index) => (
// //                       <Tooltip key={index} title={item.tooltip}>
// //                         <IconButton
// //                           size="small"
// //                           sx={{
// //                             color: '#667eea',
// //                             bgcolor: 'rgba(102, 126, 234, 0.1)',
// //                             border: '1px solid rgba(102, 126, 234, 0.2)',
// //                             '&:hover': {
// //                               bgcolor: 'rgba(102, 126, 234, 0.2)',
// //                               transform: 'scale(1.1)'
// //                             },
// //                             transition: 'all 0.3s ease'
// //                           }}
// //                         >
// //                           <item.icon fontSize="small" />
// //                         </IconButton>
// //                       </Tooltip>
// //                     ))}
// //                   </Stack>
// //                 </Box>
// //               </Box>
// //             </Box>
// //           </motion.div>

// //           {/* Floating Chat Button */}
// //           <motion.div
// //             initial={{ scale: 0, rotate: -180 }}
// //             animate={{ scale: 1, rotate: 0 }}
// //             transition={{ delay: 2, duration: 0.8, type: "spring", bounce: 0.6 }}
// //             style={{
// //               position: 'fixed',
// //               bottom: 30,
// //               left: 30,
// //               zIndex: 1000
// //             }}
// //           >
// //             <Tooltip title="צ'אט תמיכה מהיר" placement="top">
// //               <motion.div
// //                 whileHover={{ scale: 1.1 }}
// //                 whileTap={{ scale: 0.9 }}
// //                 animate={{ 
// //                   boxShadow: [
// //                     '0 0 20px rgba(102, 126, 234, 0.3)',
// //                     '0 0 30px rgba(102, 126, 234, 0.6)',
// //                     '0 0 20px rgba(102, 126, 234, 0.3)'
// //                   ]
// //                 }}
// //                 transition={{ 
// //                   boxShadow: { duration: 2, repeat: Infinity },
// //                   scale: { duration: 0.2 }
// //                 }}
// //               >
// //                 <Fab
// //                   size="large"
// //                   sx={{
// //                     width: 70,
// //                     height: 70,
// //                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //                     color: 'white',
// //                     boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
// //                     border: '3px solid rgba(255, 255, 255, 0.9)',
// //                     '&:hover': {
// //                       background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
// //                       boxShadow: '0 12px 35px rgba(102, 126, 234, 0.6)'
// //                     },
// //                     transition: 'all 0.3s ease'
// //                   }}
// //                   onClick={() => setChatOpen(true)}
// //                 >
// //                   <Badge badgeContent="1" color="error">
// //                     <ChatIcon sx={{ fontSize: 30 }} />
// //                   </Badge>
// //                 </Fab>
// //               </motion.div>
// //             </Tooltip>
// //           </motion.div>

// //           {/* Scroll to Top Button */}
// //           <motion.div
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ delay: 3 }}
// //             style={{
// //               position: 'fixed',
// //               bottom: 30,
// //               right: 30,
// //               zIndex: 1000
// //             }}
// //           >
// //             <Tooltip title="חזור למעלה" placement="top">
// //               <motion.div
// //                 whileHover={{ scale: 1.1 }}
// //                 whileTap={{ scale: 0.9 }}
// //               >
// //                 <Fab
// //                   size="medium"
// //                   sx={{
// //                     background: 'rgba(255, 255, 255, 0.95)',
// //                     backdropFilter: 'blur(20px)',
// //                     color: '#667eea',
// //                     boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
// //                     border: '2px solid rgba(102, 126, 234, 0.2)',
// //                     '&:hover': {
// //                       background: 'rgba(102, 126, 234, 0.1)',
// //                       borderColor: '#667eea',
// //                       boxShadow: '0 12px 35px rgba(102, 126, 234, 0.3)'
// //                     },
// //                     transition: 'all 0.3s ease'
// //                   }}
// //                   onClick={() => {
// //                     window.scrollTo({ top: 0, behavior: 'smooth' });
// //                   }}
// //                 >
// //                   <ArrowIcon sx={{ fontSize: 28, transform: 'rotate(-90deg)' }} />
// //                 </Fab>
// //               </motion.div>
// //             </Tooltip>
// //           </motion.div>

// //           {/* Progress Indicator */}
// //           <motion.div
// //             initial={{ scaleX: 0 }}
// //             animate={{ scaleX: 1 }}
// //             transition={{ duration: 2, delay: 1 }}
// //             style={{
// //               position: 'fixed',
// //               top: 0,
// //               left: 0,
// //               right: 0,
// //               height: '4px',
// //               background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
// //               zIndex: 1001,
// //               transformOrigin: 'left'
// //             }}
// //           />

// //         </motion.div>
// //       </Container>

// //       {/* Chat Support Dialog */}
// //       <Dialog
// //         open={chatOpen}
// //         onClose={() => setChatOpen(false)}
// //         TransitionComponent={Transition}
// //         maxWidth="sm"
// //         fullWidth
// //         PaperProps={{
// //           sx: {
// //             borderRadius: '20px',
// //             background: 'rgba(255, 255, 255, 0.95)',
// //             backdropFilter: 'blur(30px)',
// //             border: '2px solid rgba(255, 255, 255, 0.8)',
// //             boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
// //             overflow: 'hidden'
// //           }
// //         }}
// //       >
// //         <DialogTitle
// //           sx={{
// //             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //             color: 'white',
// //             p: 3,
// //             display: 'flex',
// //             alignItems: 'center',
// //             justifyContent: 'space-between'
// //           }}
// //         >
// //           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
// //             <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
// //               <SupportIcon />
// //             </Avatar>
// //             <Box>
// //               <Typography variant="h6" fontWeight="bold">
// //                 צ'אט תמיכה
// //               </Typography>
// //               <Typography variant="body2" sx={{ opacity: 0.9 }}>
// //                 אנחנו כאן לעזור לך 24/7
// //               </Typography>
// //             </Box>
// //           </Box>
// //           <IconButton
// //             onClick={() => setChatOpen(false)}
// //             sx={{ color: 'white' }}
// //           >
// //             <CloseIcon />
// //           </IconButton>
// //         </DialogTitle>

// //         <DialogContent sx={{ p: 0, height: '400px', display: 'flex', flexDirection: 'column' }}>
// //           <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
// //             <List>
// //               <AnimatePresence>
// //                 {chatMessages.map((message) => (
// //                   <motion.div
// //                     key={message.id}
// //                     initial={{ opacity: 0, y: 20 }}
// //                     animate={{ opacity: 1, y: 0 }}
// //                     exit={{ opacity: 0, y: -20 }}
// //                     transition={{ duration: 0.3 }}
// //                   >
// //                     <ListItem
// //                       sx={{
// //                         flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
// //                         alignItems: 'flex-start',
// //                         mb: 2
// //                       }}
// //                     >
// //                       <ListItemAvatar sx={{ minWidth: 'auto', mr: message.sender === 'user' ? 0 : 1, ml: message.sender === 'user' ? 1 : 0 }}>
// //                         <Avatar
// //                           sx={{
// //                             bgcolor: message.sender === 'user' ? '#3B82F6' : '#10B981',
// //                             width: 35,
// //                             height: 35
// //                           }}
// //                         >
// //                           {message.sender === 'user' ? (
// //                             <Typography variant="body2" fontWeight="bold">
// //                               א
// //                             </Typography>
// //                           ) : (
// //                             <BotIcon fontSize="small" />
// //                           )}
// //                         </Avatar>
// //                       </ListItemAvatar>

// //                       <Paper
// //                         sx={{
// //                           p: 2,
// //                           maxWidth: '70%',
// //                           bgcolor: message.sender === 'user' ? '#3B82F6' : '#F8FAFC',
// //                           color: message.sender === 'user' ? 'white' : '#1E293B',
// //                           borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
// //                           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
// //                         }}
// //                       >
// //                         <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
// //                           {message.text}
// //                         </Typography>
// //                         <Typography
// //                           variant="caption"
// //                           sx={{
// //                             opacity: 0.7,
// //                             display: 'block',
// //                             mt: 0.5,
// //                             fontSize: '0.7rem'
// //                           }}
// //                         >
// //                           {message.timestamp.toLocaleTimeString('he-IL', {
// //                             hour: '2-digit',
// //                             minute: '2-digit'
// //                           })}
// //                         </Typography>
// //                       </Paper>
// //                     </ListItem>
// //                   </motion.div>
// //                 ))}
// //               </AnimatePresence>

// //               {isTyping && (
// //                 <motion.div
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                 >
// //                   <ListItem>
// //                     <ListItemAvatar>
// //                       <Avatar sx={{ bgcolor: '#10B981', width: 35, height: 35 }}>
// //                         <BotIcon fontSize="small" />
// //                       </Avatar>
// //                     </ListItemAvatar>
// //                     <Paper
// //                       sx={{
// //                         p: 2,
// //                         bgcolor: '#F8FAFC',
// //                         borderRadius: '20px 20px 20px 5px',
// //                         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
// //                       }}
// //                     >
// //                       <motion.div
// //                         animate={{ opacity: [0.5, 1, 0.5] }}
// //                         transition={{ duration: 1.5, repeat: Infinity }}
// //                       >
// //                         <Typography variant="body2" color="#64748B">
// //                           מקליד...
// //                         </Typography>
// //                       </motion.div>
// //                     </Paper>
// //                   </ListItem>
// //                 </motion.div>
// //               )}
// //             </List>
// //           </Box>
// //         </DialogContent>

// //         <DialogActions sx={{ p: 3, borderTop: '1px solid #E2E8F0' }}>
// //           <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
// //             <TextField
// //               fullWidth
// //               multiline
// //               maxRows={3}
// //               placeholder="הקלד את הודעתך כאן..."
// //               value={newMessage}
// //               onChange={(e) => setNewMessage(e.target.value)}
// //               onKeyPress={handleKeyPress}
// //               sx={{
// //                 '& .MuiOutlinedInput-root': {
// //                   borderRadius: '15px',
// //                   bgcolor: '#F8FAFC'
// //                 }
// //               }}
// //             />
// //             <motion.div
// //               whileHover={{ scale: 1.05 }}
// //               whileTap={{ scale: 0.95 }}
// //             >
// //               <IconButton
// //                 onClick={handleSendMessage}
// //                 disabled={!newMessage.trim()}
// //                 sx={{
// //                   bgcolor: '#667eea',
// //                   color: 'white',
// //                   width: 50,
// //                   height: 50,
// //                   '&:hover': {
// //                     bgcolor: '#764ba2'
// //                   },
// //                   '&:disabled': {
// //                     bgcolor: '#E2E8F0',
// //                     color: '#94A3B8'
// //                   }
// //                 }}
// //               >
// //                 <SendIcon />
// //               </IconButton>
// //             </motion.div>
// //           </Box>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default Home;


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
//   SmartToy as BotIcon,
//   AutoAwesome as MagicIcon,
//   Celebration as CelebrationIcon,
//   EmojiEvents as TrophyIcon,
//   Favorite as HeartIcon,
//   Lightbulb as LightbulbIcon,
//   // AutoAwesome as MagicIcon,
//   // Celebration as CelebrationIcon,
//   // EmojiEvents as TrophyIcon,
//   // Favorite as HeartIcon,
//   // Lightbulb as LightbulbIcon
// } from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchStudents } from '../../store/student/studentGetAllThunk';
// import { fetchCourses } from '../../store/course/CoursesGetAllThunk';
// import { fetchInstructors } from '../../store/instructor/instructorGetAllThunk';

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
//       {/* <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
//         {[...Array(6)].map((_, i) => (
//           <motion.div
//             key={i}
//             style={{
//               position: 'absolute',
//               width: Math.random() * 300 + 100,
//               height: Math.random() * 300 + 100,
//               borderRadius: '50%',
//               background: `radial-gradient(circle, ${['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)', 'rgba(16, 185, 129, 0.1)', 'rgba(245, 158, 11, 0.1)'][i % 4]
//                 } 0%, transparent 70%)`,
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
//       </Box> */}

//       <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 1 }}>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.div variants={itemVariants}>
//             <Box sx={{
//               textAlign: 'center',
//               mb: 8,
//               position: 'relative',
//               py: { xs: 6, md: 10 }
//             }}>
//               <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
//                 {/* {[
//                   { icon: '🎓', delay: 0, x: '10%', y: '20%' },
//                   { icon: '📚', delay: 0.5, x: '85%', y: '15%' },
//                   { icon: '✨', delay: 1, x: '15%', y: '70%' },
//                   { icon: '🚀', delay: 1.5, x: '80%', y: '75%' },
//                   { icon: '💡', delay: 2, x: '50%', y: '10%' },
//                   { icon: '🎯', delay: 2.5, x: '90%', y: '45%' }
//                 ].map((item, index) => (
//                   <motion.div
//                     key={index}
//                     style={{
//                       position: 'absolute',
//                       left: item.x,
//                       top: item.y,
//                       fontSize: '2rem',
//                       zIndex: 0
//                     }}
//                     initial={{ opacity: 0, scale: 0, rotate: -180 }}
//                     animate={{
//                       opacity: [0, 1, 0.7, 1],
//                       scale: [0, 1.2, 0.8, 1],
//                       rotate: [0, 360],
//                       y: [0, -20, 0]
//                     }}
//                     transition={{
//                       delay: item.delay,
//                       duration: 3,
//                       repeat: Infinity,
//                       repeatDelay: 5,
//                       ease: "easeInOut"
//                     }}
//                   >
//                     {item.icon}
//                   </motion.div>
//                 ))} */}
//               </Box>

//               {/* Main Title with Enhanced Animation */}
//               <motion.div
//                 initial={{ scale: 0.3, opacity: 0, y: 100 }}
//                 animate={{ scale: 1, opacity: 1, y: 0 }}
//                 transition={{
//                   duration: 1.5,
//                   delay: 0.2,
//                   type: "spring",
//                   bounce: 0.4
//                 }}
//                 style={{ position: 'relative', zIndex: 2 }}
//               >
//                 <Box sx={{ position: 'relative', display: 'inline-block' }}>
//                   {/* Glowing Background Effect */}
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: '50%',
//                       left: '50%',
//                       transform: 'translate(-50%, -50%)',
//                       width: '120%',
//                       height: '120%',
//                       background: 'radial-gradient(ellipse, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
//                       borderRadius: '50%',
//                       filter: 'blur(20px)',
//                       zIndex: -1
//                     }}
//                   />
//                   <Typography
//                     variant="h2"
//                     fontWeight="800"
//                     sx={{
//                       background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                       backgroundClip: 'text',
//                       WebkitBackgroundClip: 'text',
//                       color: 'transparent',
//                       mb: 2,
//                       fontSize: { xs: '3.5rem', md: '3.5rem' }
//                     }}
//                   >
//                     !{greeting}<br></br>
//                     פלטפורמת ניהול חוגים

//                   </Typography>
//                 </Box>
//               </motion.div>

//               {/* Subtitle with Typewriter Effect */}
//               <motion.div
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 1, delay: 0.8 }}
//                 style={{ position: 'relative', zIndex: 2 }}
//               >
//                 <Box sx={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: '25px',
//                   p: 4,
//                   mb: 4,
//                   border: '2px solid rgba(255, 255, 255, 0.8)',
//                   boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
//                   position: 'relative',
//                   overflow: 'hidden',
//                   maxWidth: '900px',
//                   mx: 'auto'
//                 }}>
//                   {/* Animated Border */}
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       background: `
//                         linear-gradient(45deg, 
//                           transparent, 
//                           rgba(102, 126, 234, 0.3), 
//                           transparent, 
//                           rgba(118, 75, 162, 0.3), 
//                           transparent
//                         )
//                       `,
//                       backgroundSize: '400% 400%',
//                       borderRadius: '25px',
//                       padding: '2px',
//                       animation: 'borderGlow 6s ease infinite',
//                       '@keyframes borderGlow': {
//                         '0%': { backgroundPosition: '0% 50%' },
//                         '50%': { backgroundPosition: '100% 50%' },
//                         '100%': { backgroundPosition: '0% 50%' }
//                       },
//                       zIndex: -1
//                     }}
//                   />

//                   <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                     >
//                       {/* <MagicIcon sx={{ fontSize: 40, color: '#667eea' }} /> */}
//                     </motion.div>

//                     <Typography
//                       variant="h4"
//                       sx={{
//                         color: '#1e293b',
//                         mb: 3,
//                         fontWeight: 600,
//                         fontSize: { xs: '1.5rem', md: '2rem' }
//                       }}
//                     >
//                       מערכת ניהול חכמה עם טכנולוגיה מתקדמת</Typography>


//                     <motion.div
//                       animate={{
//                         scale: [1, 1.3, 1],
//                         rotate: [0, 15, -15, 0]
//                       }}
//                       transition={{
//                         duration: 2,
//                         repeat: Infinity,
//                         repeatDelay: 4
//                       }}
//                     >
//                       {/* <CelebrationIcon sx={{ fontSize: 40, color: '#f59e0b' }} /> */}
//                     </motion.div>
//                   </Stack>

//                   <Typography
//                     variant="h5"
//                     sx={{
//                       color: '#64748b',
//                       mb: 3,
//                       fontWeight: 500,
//                       lineHeight: 1.6,
//                       fontSize: { xs: '1.1rem', md: '1.3rem' }
//                     }}
//                   >
//                      המערכת החכמה והמתקדמת ביותר לניהול חוגים, תלמידים ומדריכים
//                     <br />
//                      עם בינה מלאכותית, אנליטיקה מתקדמת וחוויית משתמש מעולה
//                   </Typography>

//                   {/* Live Stats */}
//                   <Stack
//                     direction={{ xs: 'column', sm: 'row' }}
//                     spacing={3}
//                     justifyContent="center"
//                     alignItems="center"
//                     sx={{ mb: 3 }}
//                   >
//                     <motion.div
//                       animate={{ scale: [1, 1.05, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     >
//                       <Chip
//                         icon={<TrophyIcon />}
//                         label="מערכת מובילה בתחום "
//                         sx={{
//                           background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//                           color: 'white',
//                           fontWeight: 700,
//                           fontSize: '1rem',
//                           py: 3,
//                           px: 2,
//                           boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
//                         }}
//                       />
//                     </motion.div>

//                     <motion.div
//                       animate={{ scale: [1, 1.05, 1] }}
//                       transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
//                     >
//                       <Chip
//                         icon={<HeartIcon />}
//                         label="אהובה על המשתמשים"
//                         sx={{
//                           background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//                           color: 'white',
//                           fontWeight: 700,
//                           fontSize: '1rem',
//                           py: 3,
//                           px: 2,
//                           boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
//                         }}
//                       />
//                     </motion.div>

//                     <motion.div
//                       animate={{ scale: [1, 1.05, 1] }}
//                       transition={{ duration: 2, repeat: Infinity, delay: 1 }}
//                     >
//                       <Chip
//                         icon={<LightbulbIcon />}
//                         label="חדשנות טכנולוגית"
//                         sx={{
//                           background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
//                           color: 'white',
//                           fontWeight: 700,
//                           fontSize: '1rem',
//                           py: 3,
//                           px: 2,
//                           boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
//                         }}
//                       />
//                     </motion.div>
//                   </Stack>

//                   {/* Current Time with Enhanced Design */}
//                   <motion.div
//                     animate={{ opacity: [0.7, 1, 0.7] }}
//                     transition={{ duration: 3, repeat: Infinity }}
//                   >
//                     <Box sx={{
//                       background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
//                       borderRadius: '15px',
//                       p: 2,
//                       border: '1px solid rgba(102, 126, 234, 0.2)'
//                     }}>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           color: '#475569',
//                           fontWeight: 600,
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: 2
//                         }}
//                       >
//                         <motion.div
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
//                         >
//                           📅
//                         </motion.div>
//                         {currentTime.toLocaleDateString('he-IL', {
//                           weekday: 'long',
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 1, repeat: Infinity }}
//                         >
//                           •
//                         </motion.div>
//                         <motion.div
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                         >
//                           🕐
//                         </motion.div>
//                         {currentTime.toLocaleTimeString('he-IL', {
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </Typography>
//                     </Box>
//                   </motion.div>
//                 </Box>
//               </motion.div>

//               {/* Call to Action Buttons */}
//               <motion.div
//                 initial={{ y: 50, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 1, delay: 1.2 }}
//                 style={{ position: 'relative', zIndex: 2 }}
//               >
//                 <Stack
//                   direction={{ xs: 'column', sm: 'row' }}
//                   spacing={3}
//                   justifyContent="center"
//                   alignItems="center"
//                   sx={{ mb: 4 }}
//                 >
//                   <motion.div
//                     whileHover={{
//                       scale: 1.1,
//                       rotate: [0, -2, 2, 0],
//                       transition: { duration: 0.3 }
//                     }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Button
//                       variant="contained"
//                       size="large"
//                       startIcon={
//                         <motion.div
//                           animate={{ rotate: 360 }}
//                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                         >
//                           <RocketIcon />
//                         </motion.div>
//                       }
//                       onClick={() => navigate('/menu')}
//                       sx={{
//                         background: `
//                           linear-gradient(135deg, 
//                             #667eea 0%, 
//                             #764ba2 50%, 
//                             #f093fb 100%
//                           )
//                         `,
//                         backgroundSize: '200% 200%',
//                         borderRadius: '25px',
//                         px: 6,
//                         py: 3,
//                         fontSize: '1.4rem',
//                         fontWeight: 800,
//                         textTransform: 'none',
//                         boxShadow: `
//                           0 15px 35px rgba(102, 126, 234, 0.4),
//                           0 5px 15px rgba(0, 0, 0, 0.1),
//                           inset 0 1px 0 rgba(255, 255, 255, 0.3)
//                         `,
//                         border: '2px solid rgba(255, 255, 255, 0.3)',
//                         position: 'relative',
//                         overflow: 'hidden',
//                         '&:hover': {
//                           backgroundPosition: '100% 0',
//                           boxShadow: `
//                             0 20px 45px rgba(102, 126, 234, 0.6),
//                             0 10px 25px rgba(0, 0, 0, 0.2),
//                             inset 0 1px 0 rgba(255, 255, 255, 0.4)
//                           `,
//                           transform: 'translateY(-5px)'
//                         },
//                         '&::before': {
//                           content: '""',
//                           position: 'absolute',
//                           top: 0,
//                           left: '-100%',
//                           width: '100%',
//                           height: '100%',
//                           background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
//                           transition: 'left 0.5s ease'
//                         },
//                         '&:hover::before': {
//                           left: '100%'
//                         },
//                         animation: 'pulse 3s ease-in-out infinite',
//                         '@keyframes pulse': {
//                           '0%': { boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)' },
//                           '50%': { boxShadow: '0 20px 45px rgba(102, 126, 234, 0.6)' },
//                           '100%': { boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)' }
//                         },
//                         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//                       }}
//                     >
//                        !בואו נתחיל
//                     </Button>
//                   </motion.div>

//                   <motion.div
//                     whileHover={{
//                       scale: 1.05,
//                       transition: { duration: 0.3 }
//                     }}
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
//                         borderRadius: '25px',
//                         px: 6,
//                         py: 3,
//                         fontSize: '1.4rem',
//                         fontWeight: 700,
//                         textTransform: 'none',
//                         borderWidth: '3px',
//                         background: 'rgba(255, 255, 255, 0.9)',
//                         backdropFilter: 'blur(10px)',
//                         '&:hover': {
//                           borderColor: '#764ba2',
//                           color: '#764ba2',
//                           backgroundColor: 'rgba(102, 126, 234, 0.1)',
//                           transform: 'translateY(-3px)',
//                           boxShadow: '0 15px 30px rgba(102, 126, 234, 0.3)',
//                           borderWidth: '3px'
//                         },
//                         transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
//                       }}
//                     >
//                       גלה עוד
//                     </Button>
//                   </motion.div>
//                 </Stack>

//                 {/* Success Indicators */}
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 1, delay: 1.5 }}
//                 >
//                   <Stack
//                     direction={{ xs: 'column', md: 'row' }}
//                     spacing={4}
//                     justifyContent="center"
//                     alignItems="center"
//                     sx={{
//                       background: 'rgba(255, 255, 255, 0.8)',
//                       backdropFilter: 'blur(15px)',
//                       borderRadius: '20px',
//                       p: 3,
//                       border: '1px solid rgba(255, 255, 255, 0.6)',
//                       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
//                     }}
//                   >
//                     {[
//                       { icon: '⭐', value: '4.9/5', label: 'דירוג משתמשים', color: '#f59e0b' },
//                       { icon: '🏆', value: '99.9%', label: 'זמינות מערכת', color: '#10b981' },
//                       { icon: '👥', value: 'בו זמנית  ', label: 'משתמשים פעילים', color: '#3b82f6' },
//                       { icon: '🚀', value: '24/7', label: 'תמיכה מקצועית', color: '#8b5cf6' }
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1.7 + index * 0.1 }}
//                         whileHover={{ scale: 1.05 }}
//                       >
//                         <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
//                           <motion.div
//                             animate={{
//                               rotate: [0, 10, -10, 0],
//                               scale: [1, 1.1, 1]
//                             }}
//                             transition={{
//                               duration: 2,
//                               repeat: Infinity,
//                               repeatDelay: 3,
//                               delay: index * 0.5
//                             }}
//                             style={{ fontSize: '2rem', marginBottom: '8px' }}
//                           >
//                             {item.icon}
//                           </motion.div>
//                           <Typography
//                             variant="h5"
//                             fontWeight="800"
//                             sx={{ color: item.color, mb: 0.5 }}
//                           >
//                             {item.value}
//                           </Typography>
//                           <Typography
//                             variant="body2"
//                             sx={{ color: '#64748b', fontWeight: 600 }}
//                           >
//                             {item.label}
//                           </Typography>
//                         </Box>
//                       </motion.div>
//                     ))}
//                   </Stack>
//                 </motion.div>
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
//                         width: '250px',
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
//                  פעולות מהירות
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
//                           width: '260px',
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
//                    תפריט ראשי מתקדם
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
//                           width: '310px',
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
//                       onClick={() => navigate('/')}
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

//                 <Grid container spacing={4} sx={{ mb: 4, alignItems: 'center', marginLeft: '290px' }}>
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
//                         📧em0527104104@gmail.com
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         📱 0527104104
//                       </Typography>
//                       <Typography variant="body2" color="#64748b">
//                         🌐  coursenet.nethost.co.il
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
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Button,
//   Container,
//   Card,
//   CardContent,
//   CardActionArea,
//   useTheme,
//   useMediaQuery,
//   IconButton,
//   Chip,
//   alpha,
//   Stack,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import { useNavigate } from "react-router-dom";
// import { motion, useAnimation, useInView } from "framer-motion";
// import { useSelector } from "react-redux";

// // Icons
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import SchoolIcon from "@mui/icons-material/School";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import NoteAltIcon from "@mui/icons-material/NoteAlt";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import SpeedIcon from "@mui/icons-material/Speed";
// import SecurityIcon from "@mui/icons-material/Security";
// import SupportAgentIcon from "@mui/icons-material/SupportAgent";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import StarIcon from "@mui/icons-material/Star";
// import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AnalyticsIcon from "@mui/icons-material/Analytics";

// // Animated components
// const MotionBox = ({ children, ...props }) => {
//   const controls = useAnimation();
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true, threshold: 0.2 });
  
//   useEffect(() => {
//     if (inView) {
//       controls.start("visible");
//     }
//   }, [controls, inView]);
  
//   return (
//     <Box
//       ref={ref}
//       component={motion.div}
//       initial="hidden"
//       animate={controls}
//       {...props}
//     >
//       {children}
//     </Box>
//   );
// };

// // Styled components with enhanced animations and colors
// const HeroSection = styled(Box)(({ theme }) => ({
//   background: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)`,
//   color: "white",
//   padding: theme.spacing(10, 0, 12),
//   textAlign: "center",
//   position: "relative",
//   overflow: "hidden",
//   [theme.breakpoints.down("md")]: {
//     padding: theme.spacing(8, 0, 10),
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
//     zIndex: 0,
//   },
// }));

// const FeatureCard = styled(Card)(({ theme }) => ({
//   height: "100%",
//   display: "flex",
//   flexDirection: "column",
//   borderRadius: 16,
//   transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//   border: `1px solid ${alpha('#667eea', 0.1)}`,
//   position: "relative",
//   overflow: "hidden",
//   "&:hover": {
//     transform: "translateY(-8px) scale(1.02)",
//     boxShadow: `0 20px 40px ${alpha('#667eea', 0.2)}`,
//     borderColor: alpha('#667eea', 0.3),
//     "& .feature-icon": {
//       transform: "scale(1.1) rotate(5deg)",
//     },
//     "& .feature-glow": {
//       opacity: 1,
//     }
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
//     opacity: 0,
//     transition: "opacity 0.3s ease",
//     zIndex: 0,
//   },
//   "&:hover::before": {
//     opacity: 1,
//   }
// }));

// const ActionButton = styled(Button)(({ theme }) => ({
//   borderRadius: 12,
//   padding: "14px 28px",
//   fontWeight: 600,
//   textTransform: "none",
//   fontSize: "1.1rem",
//   position: "relative",
//   overflow: "hidden",
//   transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//   "&:hover": {
//     transform: "translateY(-3px)",
//     boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: "-100%",
//     width: "100%",
//     height: "100%",
//     background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
//     transition: "left 0.6s ease",
//   },
//   "&:hover::before": {
//     left: "100%",
//   }
// }));

// const StatsCard = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   textAlign: "center",
//   height: "100%",
//   borderRadius: 16,
//   transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//   border: `1px solid ${alpha('#667eea', 0.1)}`,
//   position: "relative",
//   overflow: "hidden",
//   "&:hover": {
//     transform: "translateY(-6px) scale(1.03)",
//     boxShadow: `0 16px 32px ${alpha('#667eea', 0.15)}`,
//     "& .stats-icon": {
//       transform: "scale(1.2) rotate(10deg)",
//     },
//     "& .stats-value": {
//       transform: "scale(1.1)",
//       color: '#667eea',
//     },
//   },
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: "4px",
//     background: `linear-gradient(90deg, #667eea, #764ba2)`,
//     zIndex: 1,
//   },
// }));

// const FeatureIcon = styled(Box)(({ theme }) => ({
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   width: 72,
//   height: 72,
//   borderRadius: 16,
//   backgroundColor: alpha('#667eea', 0.1),
//   marginBottom: theme.spacing(2),
//   transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//   position: "relative",
//   zIndex: 2,
//   "& svg": {
//     fontSize: 36,
//     color: '#667eea',
//     transition: "all 0.4s ease",
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: 16,
//     background: `linear-gradient(135deg, #667eea, #764ba2)`,
//     opacity: 0,
//     transition: "opacity 0.3s ease",
//     zIndex: -1,
//   },
// }));

// const ScrollDownButton = styled(IconButton)(({ theme }) => ({
//   position: "absolute",
//   bottom: 30,
//   left: "50%",
//   transform: "translateX(-50%)",
//   backgroundColor: "rgba(255, 255, 255, 0.2)",
//   color: "white",
//   backdropFilter: "blur(10px)",
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     transform: "translateX(-50%) scale(1.1)",
//   },
//   animation: "bounce 2s infinite",
//   "@keyframes bounce": {
//     "0%, 20%, 50%, 80%, 100%": {
//       transform: "translate(-50%, 0)",
//     },
//     "40%": {
//       transform: "translate(-50%, -15px)",
//     },
//     "60%": {
//       transform: "translate(-50%, -8px)",
//     },
//   },
// }));

// const FloatingElement = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   borderRadius: "50%",
//   background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)}, ${alpha('#764ba2', 0.1)})`,
//   backdropFilter: "blur(10px)",
//   pointerEvents: "none",
// }));

// export const Home = () => {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   // Get real data from Redux store
//   const students = useSelector(state => state.student?.students || []);
//   const instructors = useSelector(state => state.instructor?.instructors || []);
//   const courses = useSelector(state => state.course?.courses || []);
//   const groups = useSelector(state => state.group?.groups || []);
//   const attendance = useSelector(state => state.attendance?.attendanceRecords || []);

//   const scrollToFeatures = () => {
//     document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Enhanced features with smart enrollment and real functionality
//   const features = [
//     {
//       title: "ניהול תלמידים",
//       description: "רישום וניהול פרטי תלמידים, מעקב אחר התקדמות אישית ונתוני קשר",
//       icon: <GroupIcon />,
//       action: () => navigate("/students"),
//       color: '#667eea',
//       gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
//     },
//     {
//       title: "ניהול מדריכים",
//       description: "רישום מדריכים, הקצאת חוגים וניהול לוחות זמנים אישיים",
//       icon: <PersonIcon />,
//       action: () => navigate("/instructors"),
//       color: '#764ba2',
//       gradient: 'linear-gradient(135deg, #764ba2, #667eea)',
//     },
//     {
//       title: "ניהול חוגים וקבוצות",
//       description: "יצירת חוגים חדשים, הגדרת מועדים וניהול קבוצות לימוד",
//       icon: <SchoolIcon />,
//       action: () => navigate("/courses"),
//       color: '#10B981',
//       gradient: 'linear-gradient(135deg, #10B981, #059669)',
//     },
//     {
//       title: "שיבוץ חכם לחוגים",
//       description: "מערכת שיבוץ אוטומטית המתאימה תלמידים לחוגים על פי העדפות וזמינות",
//       icon: <SmartToyIcon />,
//       action: () => navigate("/enrollment"),
//       color: '#F59E0B',
//       gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
//     },
//     {
//       title: "מעקב נוכחות מתקדם",
//       description: "רישום נוכחות יומי עם לוח שנה אינטראקטיבי, התראות והתרעות",
//       icon: <CalendarTodayIcon />,
//       action: () => navigate("/attendance"),
//       color: '#EF4444',
//       gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
//     },
//     {
//       title: "דוחות וניתוחים",
//       description: "דוחות נוכחות מפורטים, סטטיסטיקות ותובנות על פעילות החוגים",
//       icon: <AnalyticsIcon />,
//       action: () => navigate("/reports"),
//       color: '#06B6D4',
//       gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
//     },
//     {
//       title: "הערות אישיות",
//       description: "רישום הערות אישיות לכל תלמיד, מעקב התפתחות והתקדמות",
//       icon: <NoteAltIcon />,
//       action: () => navigate("/student-notes"),
//       color: '#8B5CF6',
//       gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
//     },
//     {
//       title: "ניהול אירועים",
//       description: "תכנון ואירגון אירועים, הרשמות ומעקב אחר השתתפות",
//       icon: <EventAvailableIcon />,
//       action: () => navigate("/events"),
//       color: '#EC4899',
//       gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
//     }
//   ];

//   // Calculate real statistics
//   const activeStudents = students.filter(student => student.isActive !== false).length;
//   const activeInstructors = instructors.filter(instructor => instructor.isActive !== false).length;
//   const activeCourses = courses.filter(course => course.isActive !== false).length;
//   const totalAttendance = attendance.length;
//   const attendanceRate = totalAttendance > 0 ? 
//     Math.round((attendance.filter(record => record.isPresent).length / totalAttendance) * 100) : 0;

//   const stats = [
//     { 
//       value: activeStudents.toString(), 
//           label: "תלמידים פעילים", 
//       icon: <GroupIcon />, 
//       color: '#667eea',
//       description: "תלמידים רשומים ופעילים במערכת"
//     },
//     { 
//       value: activeInstructors.toString(), 
//       label: "מדריכים", 
//       icon: <PersonIcon />, 
//       color: '#764ba2',
//       description: "מדריכים מוסמכים ופעילים"
//     },
//     { 
//       value: activeCourses.toString(), 
//       label: "חוגים פעילים", 
//       icon: <SchoolIcon />, 
//       color: '#10B981',
//       description: "חוגים הפועלים כעת במערכת"
//     },
//     { 
//       value: `${attendanceRate}%`, 
//       label: "אחוז נוכחות", 
//       icon: <CheckCircleIcon />, 
//       color: '#F59E0B',
//       description: "אחוז נוכחות ממוצע בכל החוגים"
//     }
//   ];

//   const benefits = [
//     {
//       icon: <AutoAwesomeIcon />,
//       title: "שיבוץ חכם ואוטומטי",
//       description: "אלגוריתם מתקדם לשיבוץ תלמידים לחוגים על פי העדפות, יכולות וזמינות",
//       color: '#667eea'
//     },
//     {
//       icon: <SpeedIcon />,
//       title: "יעילות מקסימלית",
//       description: "חיסכון בזמן וניהול מרכזי של כל פעילויות החוג במקום אחד",
//       color: '#10B981'
//     },
//     {
//       icon: <SecurityIcon />,
//       title: "אבטחת מידע מתקדמת",
//       description: "הגנה מלאה על פרטיות התלמידים והמדריכים עם הצפנה מתקדמת",
//       color: '#EF4444'
//     },
//     {
//       icon: <TrendingUpIcon />,
//       title: "מעקב והתפתחות",
//       description: "כלים מתקדמים למעקב אחר התקדמות התלמידים וניתוח ביצועים",
//       color: '#06B6D4'
//     },
//     {
//       icon: <SupportAgentIcon />,
//       title: "תמיכה מקצועית 24/7",
//       description: "צוות תמיכה זמין לכל שאלה או בעיה טכנית עם זמני תגובה מהירים",
//       color: '#8B5CF6'
//     },
//     {
//       icon: <AnalyticsIcon />,
//       title: "דוחות מתקדמים",
//       description: "מערכת דיווח מקיפה עם גרפים, סטטיסטיקות ותובנות עסקיות",
//       color: '#EC4899'
//     }
//   ];

//   // Enhanced animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.15,
//         delayChildren: 0.3
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 30, opacity: 0, scale: 0.9 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       transition: { 
//         duration: 0.6, 
//         ease: [0.175, 0.885, 0.32, 1.275]
//       }
//     }
//   };

//   const fadeInUpVariants = {
//     hidden: { y: 40, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { 
//         duration: 0.8, 
//         ease: [0.175, 0.885, 0.32, 1.275]
//       }
//     }
//   };

//   const scaleInVariants = {
//     hidden: { scale: 0.8, opacity: 0, rotate: -5 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       rotate: 0,
//       transition: { 
//         duration: 0.6, 
//         ease: [0.175, 0.885, 0.32, 1.275]
//       }
//     }
//   };

//   const slideInVariants = {
//     hidden: { x: -60, opacity: 0 },
//     visible: {
//       x: 0,
//       opacity: 1,
//       transition: { 
//         duration: 0.7, 
//         ease: [0.175, 0.885, 0.32, 1.275]
//       }
//     }
//   };

//   return (
//     <Box 
//       component={motion.div} 
//       initial={{ opacity: 0 }} 
//       animate={{ opacity: 1 }} 
//       transition={{ duration: 1 }}
//       sx={{direction:'rtl'}}
//     >
//       {/* Hero Section with Floating Elements */}
//       <HeroSection>
//         {/* Floating animated elements */}
//         {[...Array(6)].map((_, i) => (
//           <FloatingElement
//             key={i}
//             component={motion.div}
//             sx={{
//               width: `${Math.random() * 100 + 50}px`,
//               height: `${Math.random() * 100 + 50}px`,
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               y: [0, -20, 0],
//               x: [0, 10, 0],
//               rotate: [0, 180, 360],
//             }}
//             transition={{
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}

//         <Container maxWidth="lg">
//           <MotionBox
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             sx={{ position: "relative", zIndex: 2 }}
//           >
//             <MotionBox variants={itemVariants}>
//               <Chip 
//                 icon={<StarIcon />} 
//                 label="מערכת ניהול חוגים מתקדמת ביותר" 
//                 component={motion.div}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 sx={{ 
//                   mb: 4,
//                   backgroundColor: "rgba(255, 255, 255, 0.2)",
//                   color: "white",
//                   fontWeight: 600,
//                   fontSize: "1rem",
//                   padding: "8px 16px",
//                   backdropFilter: "blur(10px)",
//                 }}
//               />
//             </MotionBox>
            
//             <MotionBox variants={itemVariants}>
//               <Typography 
//                 variant={isMobile ? "h3" : "h2"} 
//                 component={motion.h1}
//                 whileHover={{ scale: 1.02 }}
//                 gutterBottom 
//                 fontWeight="bold"
//                 sx={{ 
//                   mb: 3,
//                   background: "linear-gradient(45deg, #fff, #f0f0f0)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   textShadow: "0 2px 10px rgba(0,0,0,0.3)",
//                 }}
//               >
//                 ברוכים הבאים למערכת ניהול החוגים
//               </Typography>
//             </MotionBox>
            
//             <MotionBox variants={itemVariants}>
//               <Typography 
//                 variant={isMobile ? "h6" : "h5"} 
//                 paragraph 
//                 sx={{ 
//                   maxWidth: "800px", 
//                   mx: "auto", 
//                   mb: 5,
//                   opacity: 0.95,
//                   lineHeight: 1.7,
//                   textShadow: "0 1px 3px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 פלטפורמה מקצועית ומתקדמת לניהול תלמידים, מדריכים וחוגים
//                 עם שיבוץ חכם, מעקב נוכחות ודוחות מפורטים
//               </Typography>
//             </MotionBox>
            
//             <MotionBox variants={itemVariants} sx={{ mt: 5 }}>
//               <Stack 
//                 direction={isMobile ? "column" : "row"} 
//                 spacing={3} 
//                 justifyContent="center"
//               >
//                 <ActionButton
//                   variant="contained"
//                   size="large"
//                   onClick={() => navigate("/students")}
//                   endIcon={<ArrowForwardIcon />}
//                   component={motion.button}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   sx={{
//                     background: "linear-gradient(135deg, #fff, #f8f9fa)",
//                     color: "#667eea",
//                     fontWeight: "bold",
//                     "&:hover": {
//                       background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
//                     }
//                   }}
//                 >
//                   ניהול תלמידים
//                 </ActionButton>
                
//                 <ActionButton
//                   variant="outlined"
//                   size="large"
//                   onClick={() => navigate("/enrollment")}
//                   startIcon={<SmartToyIcon />}
//                   component={motion.button}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   sx={{ 
//                     bgcolor: "rgba(255,255,255,0.1)",
//                     borderColor: "rgba(255,255,255,0.3)",
//                     color: "white",
//                     fontWeight: "bold",
//                     backdropFilter: "blur(10px)",
//                     "&:hover": {
//                       bgcolor: "rgba(255,255,255,0.2)",
//                       borderColor: "rgba(255,255,255,0.5)",
//                     }
//                   }}
//                 >
//                   שיבוץ חכם
//                 </ActionButton>
//               </Stack>
//             </MotionBox>
//           </MotionBox>
//         </Container>
        
//         <ScrollDownButton 
//           onClick={scrollToFeatures} 
//           aria-label="גלול למטה"
//           component={motion.button}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <KeyboardArrowDownIcon />
//         </ScrollDownButton>
//       </HeroSection>

//       {/* Features Section */}
//       <Container sx={{ mt: 10, mb: 10 }} id="features-section">
//         <MotionBox
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//           sx={{ textAlign: "center", mb: 8 }}
//         >
//           <MotionBox variants={fadeInUpVariants}>
//             <Typography 
//               variant="h3" 
//               component="h2" 
//               fontWeight="bold" 
//               gutterBottom
//               sx={{
//                 background: "linear-gradient(135deg, #667eea, #764ba2)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               הכלים המתקדמים שלנו
//             </Typography>
//             <Typography 
//               variant="h6" 
//               color="text.secondary" 
//               sx={{ 
//                 maxWidth: 700, 
//                 mx: "auto", 
//                 mb: 2,
//                 lineHeight: 1.6
//               }}
//             >
//               כל מה שצריך לניהול מקצועי ויעיל של החוגים שלכם
//               עם טכנולוגיה מתקדמת ושיבוץ חכם
//             </Typography>
//           </MotionBox>
//         </MotionBox>

//         <Grid container spacing={4}>
//           {features.map((feature, index) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//               <MotionBox
//                 variants={scaleInVariants}
//                 initial="hidden"
//                 whileInView="visible"
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <FeatureCard
//                   component={motion.div}
//                   whileHover={{ 
//                     y: -8,
//                     transition: { duration: 0.3 }
//                   }}
//                 >
//                   <Box className="feature-glow" sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     background: feature.gradient,
//                     opacity: 0,
//                     transition: "opacity 0.3s ease",
//                     zIndex: 0,
//                   }} />
                  
//                   <CardActionArea 
//                     onClick={feature.action}
//                     sx={{ 
//                       height: "100%", 
//                       p: 3,
//                       position: "relative",
//                       zIndex: 1,
//                     }}
//                   >
//                     <CardContent sx={{ textAlign: "center", p: 0 }}>
//                       <FeatureIcon 
//                         className="feature-icon"
//                         sx={{ 
//                           mx: "auto",
//                           background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)}, ${alpha(feature.color, 0.2)})`,
//                           "& svg": { color: feature.color }
//                         }}
//                         component={motion.div}
//                         whileHover={{ 
//                           rotate: 360,
//                           transition: { duration: 0.6 }
//                         }}
//                       >
//                         {feature.icon}
//                       </FeatureIcon>
                      
//                       <Typography 
//                         variant="h6" 
//                         component="h3" 
//                         fontWeight="bold"
//                         gutterBottom
//                         sx={{ color: feature.color }}
//                       >
//                         {feature.title}
//                       </Typography>
                      
//                       <Typography 
//                         variant="body2" 
//                         color="text.secondary"
//                         sx={{ lineHeight: 1.6 }}
//                       >
//                         {feature.description}
//                       </Typography>
//                     </CardContent>
//                   </CardActionArea>
//                 </FeatureCard>
//               </MotionBox>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Stats Section
//         {/* Stats Section */}
//       <Box 
//         sx={{ 
//           background: `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
//           py: 10,
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         {/* Animated background pattern */}
//         {[...Array(12)].map((_, i) => (
//           <Box
//             key={i}
//             component={motion.div}
//             sx={{
//               position: "absolute",
//               width: "2px",
//               height: "2px",
//               backgroundColor: alpha('#667eea', 0.3),
//               borderRadius: "50%",
//             }}
//             initial={{
//               x: `${Math.random() * 100}%`,
//               y: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               y: [
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`
//               ],
//               opacity: [0.3, 0.8, 0.3],
//             }}
//             transition={{
//               duration: Math.random() * 15 + 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}

//         <Container sx={{ position: "relative", zIndex: 1 }}>
//           <MotionBox
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.2 }}
//             sx={{ textAlign: "center", mb: 8 }}
//           >
//             <MotionBox variants={fadeInUpVariants}>
//               <Typography 
//                 variant="h3" 
//                 component="h2" 
//                 fontWeight="bold" 
//                 gutterBottom
//                 sx={{
//                   background: "linear-gradient(135deg, #667eea, #764ba2)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 המערכת במספרים
//               </Typography>
//               <Typography 
//                 variant="h6" 
//                 color="text.secondary"
//                 sx={{ 
//                   maxWidth: 600, 
//                   mx: "auto",
//                   lineHeight: 1.6
//                 }}
//               >
//                 נתונים עדכניים ואמיתיים מהמערכת שלכם
//               </Typography>
//             </MotionBox>
//           </MotionBox>

//           <Grid container spacing={4}>
//             {stats.map((stat, index) => (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <MotionBox
//                   variants={scaleInVariants}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true, amount: 0.2 }}
//                   transition={{ delay: index * 0.15 }}
//                 >
//                   <StatsCard
//                     component={motion.div}
//                     whileHover={{ 
//                       y: -6,
//                       transition: { duration: 0.3 }
//                     }}
//                   >
//                     <Box 
//                       className="stats-icon"
//                       sx={{ 
//                         display: 'flex', 
//                         justifyContent: 'center', 
//                         mb: 2,
//                         transition: "all 0.4s ease",
//                         color: stat.color
//                       }}
//                       component={motion.div}
//                       whileHover={{ 
//                         scale: 1.2,
//                         rotate: 10,
//                         transition: { duration: 0.3 }
//                       }}
//                     >
//                       {stat.icon}
//                     </Box>
                    
//                     <Typography 
//                       variant="h3" 
//                       component={motion.p}
//                       fontWeight="bold" 
//                       className="stats-value"
//                       sx={{ 
//                         color: stat.color,
//                         transition: "all 0.4s ease",
//                         mb: 1
//                       }}
//                       whileHover={{ 
//                         scale: 1.1,
//                         transition: { duration: 0.3 }
//                       }}
//                     >
//                       {stat.value}
//                     </Typography>
                    
//                     <Typography 
//                       variant="h6" 
//                       fontWeight="medium"
//                       sx={{ 
//                         mb: 1,
//                         color: "text.primary"
//                       }}
//                     >
//                       {stat.label}
//                     </Typography>
                    
//                     <Typography 
//                       variant="body2" 
//                       color="text.secondary"
//                       sx={{ fontSize: "0.875rem" }}
//                     >
//                       {stat.description}
//                     </Typography>
//                   </StatsCard>
//                 </MotionBox>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Benefits Section */}
//       <Container sx={{ mt: 12, mb: 12 }}>
//         <Grid container spacing={8} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <MotionBox
//               variants={slideInVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true, amount: 0.2 }}
//             >
//               <Chip 
//                 icon={<AutoAwesomeIcon />} 
//                 label="למה לבחור בנו?" 
//                 component={motion.div}
//                 whileHover={{ scale: 1.05 }}
//                 sx={{ 
//                   mb: 3,
//                   backgroundColor: alpha('#667eea', 0.1),
//                   color: '#667eea',
//                   fontWeight: 600,
//                   fontSize: "1rem",
//                 }}
//               />
              
//               <Typography 
//                 variant="h3" 
//                 component="h2" 
//                 gutterBottom 
//                 fontWeight="bold"
//                 sx={{ 
//                   mt: 2, 
//                   mb: 3,
//                   background: "linear-gradient(135deg, #667eea, #764ba2)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 טכנולוגיה מתקדמת 
//               </Typography>
              
//               <Typography 
//                 variant="body1" 
//                 paragraph 
//                 sx={{ 
//                   mb: 3, 
//                   color: "text.secondary", 
//                   lineHeight: 1.8,
//                   fontSize: "1.1rem"
//                 }}
//               >
//                 המערכת שלנו מציעה פתרון מקיף לניהול חוגים,
//                 עם דגש על חדשנות טכנולוגית ונוחות השימוש. 
//                 שיבוץ חכם, מעקב מתקדם ודוחות מפורטים - הכל במקום אחד.
//               </Typography>
              
//               <Typography 
//                 variant="body1" 
//                 paragraph 
//                 sx={{ 
//                   mb: 5, 
//                   color: "text.secondary", 
//                   lineHeight: 1.8,
//                   fontSize: "1.1rem"
//                 }}
//               >
//                 עם אלגוריתמים מתקדמים לשיבוץ חכם ומערכת ניתוח נתונים חכמה,
//                 תוכלו לחסוך זמן יקר ולהתמקד במה שחשוב באמת - החינוך והפיתוח.
//               </Typography>
              
//               <Stack spacing={3}>
//                 {benefits.map((benefit, index) => (
//                   <Box 
//                     key={index}
//                     component={motion.div}
//                     initial={{ opacity: 0, x: -30 }}
//                     whileInView={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
//                     viewport={{ once: true }}
//                     whileHover={{ 
//                       x: 10,
//                       transition: { duration: 0.2 }
//                     }}
//                     sx={{ 
//                       display: "flex", 
//                       alignItems: "flex-start",
//                       gap: 3,
//                       p: 3,
//                       borderRadius: 3,
//                       transition: "all 0.3s ease",
//                       cursor: "pointer",
//                       "&:hover": {
//                         backgroundColor: alpha(benefit.color, 0.05),
//                         transform: "translateX(8px)",
//                       }
//                     }}
//                   >
//                     <Avatar 
//                       sx={{ 
//                         background: `linear-gradient(135deg, ${benefit.color}, ${alpha(benefit.color, 0.8)})`,
//                         color: "white",
//                         width: 56,
//                         height: 56,
//                         boxShadow: `0 8px 20px ${alpha(benefit.color, 0.3)}`,
//                       }}
//                       component={motion.div}
//                       whileHover={{ 
//                         scale: 1.1,
//                         rotate: 5,
//                         transition: { duration: 0.3 }
//                       }}
//                     >
//                       {benefit.icon}
//                     </Avatar>
//                     <Box>
//                       <Typography 
//                         variant="h6" 
//                         fontWeight="bold" 
//                         gutterBottom
//                         sx={{ color: benefit.color }}
//                       >
//                         {benefit.title}
//                       </Typography>
//                       <Typography 
//                         variant="body2" 
//                         color="text.secondary"
//                         sx={{ lineHeight: 1.6 }}
//                       >
//                         {benefit.description}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 ))}
//               </Stack>
//             </MotionBox>
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <MotionBox
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.8 }}
//             >
//               <Box
//                 sx={{
//                   position: "relative",
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)}, ${alpha('#764ba2', 0.1)})`,
//                   p: 4,
//                   backdropFilter: "blur(10px)",
//                   border: `1px solid ${alpha('#667eea', 0.2)}`,
//                 }}
//                 component={motion.div}
//                 whileHover={{ 
//                   y: -8,
//                   transition: { duration: 0.3 }
//                 }}
//               >
//                 {/* Animated dashboard mockup */}
//                 <Box sx={{ textAlign: "center", py: 6 }}>
//                   <Box
//                     component={motion.div}
//                     animate={{ 
//                       rotate: [0, 360],
//                       scale: [1, 1.1, 1]
//                     }}
//                     transition={{ 
//                       duration: 8,
//                       repeat: Infinity,
//                       ease: "easeInOut"
//                     }}
//                     sx={{
//                       width: 120,
//                       height: 120,
//                       borderRadius: "50%",
//                       background: `linear-gradient(135deg, #667eea, #764ba2)`,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mx: "auto",
//                       mb: 3,
//                       boxShadow: `0 20px 40px ${alpha('#667eea', 0.3)}`,
//                     }}
//                   >
//                     <SmartToyIcon sx={{ fontSize: 60, color: "white" }} />
//                   </Box>
                  
//                   <Typography 
//                     variant="h5" 
//                     fontWeight="bold" 
//                     gutterBottom
//                     sx={{
//                       background: "linear-gradient(135deg, #667eea, #764ba2)",
//                       WebkitBackgroundClip: "text",
//                       WebkitTextFillColor: "transparent",
//                     }}
//                   >
//                     שיבוץ חכם ואוטומטי
//                   </Typography>
                  
//                   <Typography 
//                     variant="body1" 
//                     color="text.secondary"
//                     sx={{ mb: 4, lineHeight: 1.6 }}
//                   >
//                     אלגוריתם מתקדם המתאים תלמידים לחוגים
//                     על פי העדפות אישיות וזמינות
//                   </Typography>

//                   {/* Animated progress indicators */}
//                   <Stack spacing={2}>
//                     {['התאמת לוחות זמנים', 'ניתוח העדפות', 'אופטימיזציה אוטומטית'].map((item, index) => (
//                       <Box 
//                         key={index}
//                         sx={{ 
//                           display: "flex", 
//                           alignItems: "center", 
//                           gap: 2,
//                           justifyContent: "center"
//                         }}
//                       >
//                         <Box
//                           component={motion.div}
//                           animate={{ 
//                             scale: [1, 1.2, 1],
//                             opacity: [0.7, 1, 0.7]
//                           }}
//                           transition={{ 
//                             duration: 2,
//                             repeat: Infinity,
//                             delay: index * 0.5
//                           }}
//                           sx={{
//                             width: 12,
//                             height: 12,
//                             borderRadius: "50%",
//                             background: `linear-gradient(135deg, #667eea, #764ba2)`,
//                           }}
//                         />
//                         <Typography variant="body2" color="text.secondary">
//                           {item}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Stack>
//                 </Box>
//               </Box>
//             </MotionBox>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* CTA Section */}
//       <Box 
//         sx={{ 
//           background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
//           color: "white", 
//           py: 10,
//           textAlign: "center",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         {/* Animated background elements */}
//         {[...Array(8)].map((_, i) => (
//           <Box
//             key={i}
//             component={motion.div}
//             sx={{
//               position: "absolute",
//               borderRadius: "50%",
//               background: "rgba(255, 255, 255, 0.1)",
//               backdropFilter: "blur(10px)",
//             }}
//             initial={{
//               x: `${Math.random() * 100}%`,
//               y: `${Math.random() * 100}%`,
//               scale: Math.random() * 0.5 + 0.5,
//             }}
//             animate={{
//               y: [
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`
//               ],
//               x: [
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`,
//                 `${Math.random() * 100}%`
//               ],
//               rotate: [0, 360],
//             }}
//             transition={{
//               duration: Math.random() * 20 + 15,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//             style={{
//               width: `${Math.random() * 150 + 50}px`,
//               height: `${Math.random() * 150 + 50}px`,
//             }}
//           />
//         ))}

//         <Container sx={{ position: "relative", zIndex: 1 }}>
//           <MotionBox
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.8 }}
//           >
//             <Box
//               component={motion.div}
//               animate={{ 
//                 scale: [1, 1.05, 1],
//               }}
//               transition={{ 
//                 duration: 4,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//               sx={{ mb: 4 }}
//             >
//               <AutoAwesomeIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
//             </Box>
            
//             <Typography 
//               variant="h3" 
//               component="h2" 
//               gutterBottom 
//               fontWeight="bold"
//               sx={{
//                 textShadow: "0 2px 10px rgba(0,0,0,0.3)",
//                 mb: 3
//               }}
//             >
//               מוכנים לחוות את העתיד?
//             </Typography>
            
//             <Typography 
//               variant="h6" 
//               paragraph
//               sx={{ 
//                 maxWidth: 700, 
//                 mx: "auto", 
//                 opacity: 0.95,
//                 mb: 5,
//                 lineHeight: 1.7,
//                 textShadow: "0 1px 3px rgba(0,0,0,0.2)",
//               }}
//             >
//               הצטרפו למהפכה בניהול מוסדות החינוך עם המערכת החכמה ביותר בשוק.
//               שיבוץ אוטומטי, מעקב מתקדם ודוחות חכמים - הכל כאן, הכל עכשיו.
//             </Typography>
            
//             <Stack 
//               direction={isMobile ? "column" : "row"} 
//               spacing={3} 
//               justifyContent="center"
//               sx={{ mt: 5 }}
//             >
//               <ActionButton
//                 variant="contained"
//                 size="large"
//                 onClick={() => navigate("/students")}
//                 endIcon={<ArrowForwardIcon />}
//                 component={motion.button}
//                 whileHover={{ 
//                   scale: 1.05,
//                   boxShadow: "0 15px 30px rgba(0,0,0,0.2)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 sx={{
//                   background: "linear-gradient(135deg, #fff, #f8f9fa)",
//                   color: "#667eea",
//                   fontWeight: "bold",
//                   fontSize: "1.1rem",
//                   px: 4,
//                   py: 1.5,
//                   "&:hover": {
//                     background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
//                   }
//                 }}
//               >
//                 התחל עכשיו
//               </ActionButton>
              
//               <ActionButton
//                 variant="outlined"
//                 size="large"
//                 onClick={() => navigate("/enrollment")}
//                 startIcon={<SmartToyIcon />}
//                 component={motion.button}
//                 whileHover={{ 
//                   scale: 1.05,
//                   backgroundColor: "rgba(255,255,255,0.2)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 sx={{ 
//                   bgcolor: "rgba(255,255,255,0.1)",
//                   borderColor: "rgba(255,255,255,0.4)",
//                   color: "white",
//                   fontWeight: "bold",
//                   fontSize: "1.1rem",
//                   px: 4,
//                   py: 1.5,
//                   backdropFilter: "blur(10px)",
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.2)",
//                     borderColor: "rgba(255,255,255,0.6)",
//                   }
//                 }}
//               >
//                 שיבוץ חכם
//               </ActionButton>
              
//               <ActionButton
//                 variant="text"
//                 size="large"
//                 onClick={() => navigate("/reports")}
//                 startIcon={<AnalyticsIcon />}
//                 component={motion.button}
//                 whileHover={{ 
//                   scale: 1.05,
//                   backgroundColor: "rgba(255,255,255,0.1)"
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 sx={{ 
//                   color: "white",
//                   fontWeight: "bold",
//                   fontSize: "1.1rem",
//                   px: 4,
//                   py: 1.5,
//                   "&:hover": {
//                     backgroundColor: "rgba(255,255,255,0.1)",
//                   }
//                 }}
//               >
//                 צפה בדוחות
//               </ActionButton>
//             </Stack>

//             {/* Additional info section */}
//             <Box sx={{ mt: 8, pt: 6, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
//               <Grid container spacing={4} justifyContent="center">
//                 <Grid item xs={12} sm={4}>
//                   <Box
//                     component={motion.div}
//                     whileHover={{ scale: 1.05 }}
//                     sx={{ textAlign: "center" }}
//                   >
//                     <GroupAddIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       שיבוץ מיידי
//                     </Typography>
//                     <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                       שיבוץ תלמידים לחוגים תוך שניות
//                     </Typography>
//                   </Box>
//                 </Grid>
                
//                 <Grid item xs={12} sm={4}>
//                   <Box
//                     component={motion.div}
//                     whileHover={{ scale: 1.05 }}
//                     sx={{ textAlign: "center" }}
//                   >
//                     <AnalyticsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       דוחות חכמים
//                     </Typography>
//                     <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                       ניתוח נתונים מתקדם ותובנות עסקיות
//                     </Typography>
//                   </Box>
//                 </Grid>
                
//                 <Grid item xs={12} sm={4}>
//                   <Box
//                     component={motion.div}
//                     whileHover={{ scale: 1.05 }}
//                     sx={{ textAlign: "center" }}
//                   >
//                     <SupportAgentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
//                     <Typography variant="h6" fontWeight="bold" gutterBottom>
//                       תמיכה 24/7
//                     </Typography>
//                     <Typography variant="body2" sx={{ opacity: 0.8 }}>
//                       צוות מקצועי זמין תמיד לעזרתכם
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </Box>
//           </MotionBox>
//         </Container>
//       </Box>

//       {/* Loading indicator for data */}
//       {(students.length === 0 && instructors.length === 0) && (
//         <Box 
//           sx={{ 
//             position: "fixed", 
//             bottom: 20, 
//             right: 20, 
//             zIndex: 1000,
//             backgroundColor: "white",
//             borderRadius: 2,
//             p: 2,
//             boxShadow: theme.shadows[8],
//             display: "flex",
//             alignItems: "center",
//             gap: 2
//           }}
//           component={motion.div}
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//         >
//           <CircularProgress size={24} sx={{ color: '#667eea' }} />
//           <Typography variant="body2" color="text.secondary">
//             טוען נתונים...
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };
// export default Home;
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  alpha,
  Avatar,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { useSelector } from "react-redux";

// Icons
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoteIcon from "@mui/icons-material/Note";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

// Animated components with framer-motion
const MotionBox = ({ children, ...props }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <Box
      ref={ref}
      component={motion.div}
      initial="hidden"
      animate={controls}
      {...props}
    >
      {children}
    </Box>
  );
};

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
             background: 'linear-gradient(135deg,rgb(230, 104, 236) 0%,rgb(29, 148, 199) 100%)',
  color: "white",
  padding: theme.spacing(12, 0, 14),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  borderRadius: "0 0 50% 50% / 40px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(8, 0, 10),
    borderRadius: "0 0 50% 50% / 20px",
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  textAlign: "center",
  height: "100%",
  borderRadius: 20,
  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  "&:hover": {
    transform: "translateY(-10px) scale(1.03)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "30px",
  padding: "12px 28px",
  fontWeight: "bold",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.2)",
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 20,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  animation: "bounce 2s infinite",
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translate(-50%, 0)",
    },
    "40%": {
      transform: "translate(-50%, -15px)",
    },
    "60%": {
      transform: "translate(-50%, -7px)",
    },
  },
}));

const DeveloperInfo = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  padding: theme.spacing(3),
  borderRadius: 16,
  textAlign: "center",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  backdropFilter: "blur(10px)",
}));

export const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Redux selectors for real data
  const students = useSelector((state) => state.students.students || []);
  const instructors = useSelector((state) => state.instructors.instructors || []);
  const courses = useSelector((state) => state.courses.courses || []);
  const attendance = useSelector((state) => state.attendances.attendances || []);

  const scrollToFeatures = () => {
    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate real statistics
  const activeStudents = students.filter(student => student.isActive !== false).length;
  const activeInstructors = instructors.filter(instructor => instructor.isActive !== false).length;
  const activeCourses = courses.filter(course => course.isActive !== false).length;
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.isPresent).length / attendance.length) * 100)
    : 95;

  // Main menu items for course management system
  const mainMenuItems = [
    {
      title: "ניהול תלמידים",
      description: "הוספה, עריכה וניהול פרטי התלמידים במערכת עם ממשק ידידותי וקל לשימוש",
      icon: GroupIcon,
      path: "/students",
      color: "#4A90E2",
      gradient: "linear-gradient(135deg, #4A90E2, #357ABD)",
      badge: "מרכזי",
      stats: `${activeStudents} תלמידים`
    },
    {
      title: "ניהול מדריכים",
      description: "ניהול צוות המדריכים, הקצאת חוגים ומעקב אחר פעילותם במערכת",
      icon: PersonIcon,
      path: "/instructors",
      color: "#7B68EE",
      gradient: "linear-gradient(135deg, #7B68EE, #6A5ACD)",
      badge: "חשוב",
      stats: `${activeInstructors} מדריכים`
    },
    {
      title: "ניהול חוגים",
      description: "יצירת וניהול חוגים, קביעת לוחות זמנים ומעקב אחר התקדמות הלמידה",
      icon: SchoolIcon,
      path: "/courses",
      color: "#32CD32",
      gradient: "linear-gradient(135deg, #32CD32, #228B22)",
      badge: "פעיל",
      stats: `${activeCourses} חוגים`
    },
    {
      title: "מעקב נוכחות",
      description: "רישום נוכחות תלמידים, יצירת דוחות נוכחות ומעקב אחר השתתפות בחוגים",
      icon: CheckCircleIcon,
      path: "/attendance",
      color: "#FF6347",
      gradient: "linear-gradient(135deg, #FF6347, #FF4500)",
      badge: "יומי",
      stats: `${attendanceRate}% נוכחות`
    },
    {
      title: "לוח שנה ייחודי",
      description: "לוח שנה מתקדם לרישום נוכחות יומי, תזכורות ומעקב אחר אירועים חשובים",
      icon: CalendarTodayIcon,
      path: "/calendar",
      color: "#FF8C00",
      gradient: "linear-gradient(135deg, #FF8C00, #FF7F50)",
      badge: "חדש",
      stats: "ניהול זמנים"
    },
    {
      title: "הערות אישיות",
      description: "מערכת הערות מתקדמת לכל תלמיד, מעקב אחר התקדמות ותיעוד התנהגות",
      icon: NoteIcon,
      path: "/student-notes",
      color: "#9370DB",
      gradient: "linear-gradient(135deg, #9370DB, #8A2BE2)",
      badge: "אישי",
      stats: "מעקב מותאם"
    },
    {
      title: "רישום לחוגים",
      description: "רישום תלמידים חדשים לחוגים ושיבוץ קל ומהיר",
      icon: PersonAddIcon,
      path: "/enrollment",
      color: "#20B2AA",
      gradient: "linear-gradient(135deg, #20B2AA, #008B8B)",
      badge: "מהיר",
      stats: "רישום קל"
    },
    {
      title: "דוחות וניתוחים",
      description: "יצירת דוחות מפורטים, ניתוח נתונים וקבלת תובנות על פעילות החוגים",
      icon: AnalyticsIcon,
      path: "/reports",
      color: "#DC143C",
      gradient: "linear-gradient(135deg, #DC143C, #B22222)",
      badge: "מתקדם",
      stats: "דוחות חכמים"
    }
  ];

  const stats = [
    { 
      value: activeStudents.toString(), 
      label: "תלמידים פעילים", 
      icon: <GroupIcon fontSize="large" />, 
      color: '#4A90E2',
      description: "תלמידים רשומים ופעילים במערכת"
    },
    { 
      value: activeInstructors.toString(), 
      label: "מדריכים", 
      icon: <PersonIcon fontSize="large" />, 
      color: '#7B68EE',
      description: "מדריכים מוסמכים ופעילים"
    },
    { 
      value: activeCourses.toString(), 
      label: "חוגים פעילים", 
      icon: <SchoolIcon fontSize="large" />, 
      color: '#32CD32',
      description: "חוגים הפועלים כעת במערכת"
    },
    { 
      value: `${attendanceRate}%`, 
      label: "אחוז נוכחות", 
      icon: <CheckCircleIcon fontSize="large" />, 
      color: '#FF6347',
      description: "אחוז נוכחות ממוצע בכל החוגים"
    }
  ];

  const benefits = [
    {
      icon: <SpeedIcon />,
      title: "מהירות וביצועים",
      description: "ממשק מהיר ויעיל המאפשר עבודה שוטפת ללא עיכובים, גם בעומסים גבוהים",
      color: '#4A90E2'
    },
    {
      icon: <SecurityIcon />,
      title: "אבטחה מתקדמת", 
      description: "הגנה מקסימלית על נתוני התלמידים עם הצפנה מתקדמת ואמצעי אבטחה קפדניים",
      color: '#32CD32'
    },
    {
      icon: <VerifiedIcon />,
      title: "דיוק ואמינות",
      description: "מערכת מדויקת המבטיחה שכל הנתונים מנוהלים בצורה אמינה ומדויקת",
      color: '#7B68EE'
    },
    {
      icon: <SupportAgentIcon />,
      title: "תמיכה מקצועית",
      description: "צוות תמיכה זמין לעזור בכל שאלה או בעיה, עם זמני תגובה מהירים במיוחד",
      color: '#FF6347'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    }
  };

  return (
    <Box 
      component={motion.div} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      sx={{ direction: "rtl" }}
    >
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ position: "relative", zIndex: 2 }}
          >
            <MotionBox variants={itemVariants}>
              <Chip 
                icon={<StarIcon color="secondary"/>} 
                label="מערכת ניהול חוגים מתקדמת"
                size="medium"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  mb: 3,
                  boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"
                }}
              />
            </MotionBox>
            
            <MotionBox variants={itemVariants}>
              <Typography 
                variant={isMobile ? "h3" : "h2"} 
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  mb: 3
                }}
              >
                ברוכים הבאים למערכת ניהול החוגים
              </Typography>
            </MotionBox>
            
            <MotionBox variants={itemVariants}>
              <Typography 
                variant={isMobile ? "body1" : "h5"} 
                paragraph 
                sx={{ 
                  maxWidth: "800px", 
                  mx: "auto", 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6
                }}
              >
                פלטפורמה מתקדמת לניהול מוסדות חינוך וחוגים
                בממשק חדשני ואינטואיטיבי המותאם לצרכי המנהלים והמדריכים
              </Typography>
            </MotionBox>
            
            <MotionBox variants={itemVariants} sx={{ mt: 5 }}>
              <ActionButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate("/students")}
                sx={{ 
                  mx: 1,
                  mb: isMobile ? 2 : 0,
                  fontSize: isMobile ? 14 : 16,
                  px: isMobile ? 3 : 4
                }}
                endIcon={<ArrowForwardIcon />}
              >
                ניהול תלמידים
              </ActionButton>
              
              <ActionButton
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate("/courses")}
                sx={{ 
                  mx: 1, 
                  bgcolor: "rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.3)",
                  fontSize: isMobile ? 14 : 16,
                  px: isMobile ? 3 : 4,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.25)",
                    borderColor: "rgba(255,255,255,0.5)",
                  }
                }}
                startIcon={<SchoolIcon />}
              >
                ניהול חוגים
              </ActionButton>
            </MotionBox>
          </MotionBox>
        </Container>
        
        <ScrollDownButton onClick={scrollToFeatures} aria-label="גלול למטה">
          <KeyboardArrowDownIcon />
        </ScrollDownButton>
      </HeroSection>

      {/* Main Menu Section */}
      <Container sx={{ mt: 10, mb: 10 }} id="features-section">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h3" 
              component="h2" 
              fontWeight="bold"
              sx={{
                position: "relative",
                display: "inline-block",
                mb: 2,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 80,
                  height: 4,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              תפריט ראשי
            </Typography>
          </MotionBox>
          
          <MotionBox variants={fadeInUpVariants}>
            <Typography 
              variant="h6" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                maxWidth: 700, 
                mx: "auto", 
                mt: 2,
                mb: 6,
                opacity: 0.8
              }}
            >
              כל הכלים הדרושים לניהול יעיל ומקצועי של מוסד החינוך שלכם
            </Typography>
          </MotionBox>
        </MotionBox>

        {/* Enhanced Main Menu Cards */}
        <Grid container spacing={4}>
          {mainMenuItems.map((item, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
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
                style={{ perspective: '1000px' ,width:'350px'}}
              >
                <Card
                  sx={{
                    borderRadius: '28px',
                    cursor: 'pointer',
                    width: '100%',
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
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box 
        sx={{ 
          bgcolor: alpha(theme.palette.primary.light, 0.05), 
          py: 10,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{ textAlign: "center", mb: 8 }}
          >
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h3" 
                component="h2" 
                fontWeight="bold"
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 2,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                הנתונים שלנו
              </Typography>
            </MotionBox>
            
            <MotionBox variants={fadeInUpVariants}>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                paragraph 
                sx={{ 
                  maxWidth: 700, 
                  mx: "auto", 
                  mt: 2,
                  opacity: 0.8
                }}
              >
                
                סטטיסטיקות עדכניות על פעילות המערכת
              </Typography>
            </MotionBox>
          </MotionBox>

          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionBox
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <StatsCard>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 2,
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                    
                    <Typography 
                      variant="h4" 
                      component="p"
                      fontWeight="bold" 
                      sx={{ 
                        color: "text.primary",
                        mb: 1
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography 
                      variant="h6" 
                      color="primary"
                      fontWeight="medium"
                      sx={{ mb: 1 }}
                    >
                      {stat.label}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mt: 1, fontSize: "0.875rem" }}
                    >
                      {stat.description}
                    </Typography>
                  </StatsCard>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container sx={{ mt: 12, mb: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <Chip 
                icon={<VerifiedIcon />} 
                label="ממשק ידידותי למנהלים" 
                size="medium"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  fontWeight: "bold",
                  mb: 3
                }}
              />
              
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom 
                fontWeight="bold"
                sx={{ mt: 2, mb: 3 }}
              >
                חווית משתמש מתקדמת
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 3, opacity: 0.8, lineHeight: 1.7 }}>
                המערכת שלנו מציעה ממשק אינטואיטיבי וקל לשימוש, המאפשר למנהלים לנהל חוגים, 
                לעקוב אחר תלמידים ולקבל דוחות מפורטים בקלות ובמהירות.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4, opacity: 0.8, lineHeight: 1.7 }}>
                עם כלים מתקדמים כמו לוח שנה ייחודי לרישום נוכחות יומי והערות אישיות לכל תלמיד,
                המנהלים יכולים לקבל תובנות משמעותיות ולהתאים את התכנית בהתאם.
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {benefits.map((benefit, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: "flex", 
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: alpha(benefit.color, 0.05),
                        transform: "translateX(-5px)",
                      }
                    }}
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Box 
                      sx={{ 
                        color: benefit.color,
                        mt: 0.5
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {benefit.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </MotionBox>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
                {/* Feature highlights */}
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    backdropFilter: "blur(10px)",
                    width:'350px'
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      לוח שנה ייחודי
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    מערכת לוח שנה מתקדמת לרישום נוכחות יומי, תזכורות ומעקב אחר אירועים חשובים
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
                    border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                    backdropFilter: "blur(10px)",
                                      width:'350px'

                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <NoteIcon sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      הערות אישיות
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    מערכת הערות מתקדמת לכל תלמיד, מעקב אחר התקדמות ותיעוד התנהגות אישי
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha('#32CD32', 0.1)}, ${alpha('#20B2AA', 0.1)})`,
                    border: `1px solid ${alpha('#32CD32', 0.2)}`,
                    backdropFilter: "blur(10px)",
                                     width:'350px'

                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventAvailableIcon sx={{ color: '#32CD32', mr: 2 }} />
                    <Typography variant="h6" fontWeight="bold">
                      מעקב נוכחות מתקדם
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    רישום נוכחות דיגיטלי עם דוחות מפורטים ומעקב אחר דפוסי השתתפות
                  </Typography>
                </Box>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Developer Info Section - Smaller */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 6 }}>
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <DeveloperInfo>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom 
                fontWeight="bold"
                sx={{ color: theme.palette.primary.main, mb: 1 }}
              >
                פיתוח: אסתר מורגנשטרן
              </Typography>
              
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                justifyContent="center"
                alignItems="center"
                sx={{ fontSize: "0.9rem" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                  <Typography variant="body2">
                    em0527104104@gmail.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                  <Typography variant="body2">
                    052-710-4104
                  </Typography>
                </Box>
              </Stack>
            </DeveloperInfo>
          </MotionBox>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box 
        sx={{ 
             background: 'linear-gradient(135deg,rgb(230, 104, 236) 0%,rgb(29, 148, 199) 100%)',
          color: "white", 
          py: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={8} textAlign="center">
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom 
                    fontWeight="bold"
                    sx={{
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    מוכנים להתחיל?
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants}>
                  <Typography 
                    variant="h6" 
                    paragraph
                    sx={{ 
                      maxWidth: 700, 
                      mx: "auto", 
                      opacity: 0.9,
                      mb: 4
                    }}
                  >
                    הצטרפו למוסדות החינוך שכבר משתמשים במערכת לניהול חוגים
                    וגלו כיצד ניתן לחסוך זמן יקר ולשפר את תהליכי העבודה
                  </Typography>
                </MotionBox>
                
                <MotionBox variants={fadeInUpVariants} sx={{ mt: 3 }}>
                  <ActionButton
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/students")}
                    sx={{ 
                      mx: 1,
                      mb: isMobile ? 2 : 0,
                      fontSize: isMobile ? 14 : 16,
                      px: isMobile ? 3 : 4,
                      bgcolor: "white",
                      color: theme.palette.primary.main,
                      "&:hover": {
                      bgcolor: "white"
                      }
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    התחל עכשיו
                  </ActionButton>
                  
                  <ActionButton
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/courses")}
                    sx={{ 
                      mx: 1, 
                      borderColor: "white",
                      color: "white",
                      fontSize: isMobile ? 14 : 16,
                      px: isMobile ? 3 : 4,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                      }
                    }}
                  >
                    מידע נוסף
                  </ActionButton>
                </MotionBox>
              </Grid>
            </Grid>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};
export default Home;