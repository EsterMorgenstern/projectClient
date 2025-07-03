
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  Chip,
  Paper,
  Fade,
  Zoom,
  Slide,
  Card,
  CardContent,
  ListItemButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  Home,
  School,
  People,
  PersonAdd,
  Assignment,
  CalendarMonth,
  Info,
  Settings,
  Notifications,
  AccountCircle,
  Dashboard,
  Groups,
  Person,
  Close,
  Brightness4,
  Brightness7,
  Language,
  ExitToApp,
  Phone,
  Email,
  LocationOn,
  Work,
  Edit,
  Security,
  Help,
  Star,
  TrendingUp,
  Business,
  AutoAwesome,
  AccessTime,
  AdminPanelSettings,
  BusinessCenter,
  MenuBook,
  SupervisorAccount,
  ExpandMore,
  Class as ClassIcon,
  Assessment as AssessmentIcon,
  CalendarToday as CalendarIcon,
  Login,
  AppRegistration
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCurrentUser, setCurrentUser } from '../../store/user/userSlice';
import LoginDialog from '../LogIn/LogInDialog';
import UserRegistrationDialog from '../LogIn/UserRegistrationDialog';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // ✅ כל ה-state מוגדר כאן
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // ✅ תיקון Redux state - בדיקה מדויקת יותר
  const userState = useSelector(state => state.users);
  const userById = useSelector(state => state.users.userById);

  const currentUser = userState?.userById;
  const loading = userState?.loading;

  // ✅ פונקציה לבדיקה אם המשתמש באמת מחובר
  const isUserLoggedIn = () => {
  console.log('🔍 Checking if user is logged in...');
  console.log('currentUser:', currentUser);
  console.log('userById:', userById);
  
  // בדוק את currentUser קודם
  if (currentUser && typeof currentUser === 'object' && !Array.isArray(currentUser)) {
    const hasUserData = currentUser.FirstName || 
                       currentUser.firstName || 
                       currentUser.Email || 
                       currentUser.email || 
                       currentUser.Phone || 
                       currentUser.phone || 
                       currentUser.userId || 
                       currentUser.id;
    
    if (hasUserData) {
      console.log('✅ User is logged in via currentUser');
      return true;
    }
  }
  
  // בדוק את userById כגיבוי
  if (userById && typeof userById === 'object' && !Array.isArray(userById)) {
    const hasUserData = userById.FirstName || 
                       userById.firstName || 
                       userById.Email || 
                       userById.email || 
                       userById.Phone || 
                       userById.phone || 
                       userById.userId || 
                       userById.id;
    
    if (hasUserData) {
      console.log('✅ User is logged in via userById');
      return true;
    }
  }
  
  console.log('❌ User is not logged in');
  return false;
};
  // תפריט ניווט עם צבעים יפים יותר וגרדיאנטים מדהימים
  const navigationItems = [
    { 
      title: 'בית', 
      path: '/', 
      icon: <Home />, 
      color: '#FF6B6B',
      description: 'דף הבית - סקירה כללית של המערכת',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FF6B9D 100%)',
      shadowColor: 'rgba(255, 107, 107, 0.4)'
    },
    { 
      title: 'תלמידים', 
      path: '/students', 
      icon: <People />, 
      color: '#45B7D1',
      description: 'ניהול תלמידים - רישום, מעקב והערכה',
      gradient: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 50%, #00D2FF 100%)',
      shadowColor: 'rgba(69, 183, 209, 0.4)'
    },
    { 
      title: 'מדריכים', 
      path: '/instructors', 
      icon: <Person />, 
      color: '#A78BFA',
      description: 'ניהול מדריכים - צוות הוראה ומשאבים',
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #8B5CF6 100%)',
      shadowColor: 'rgba(167, 139, 250, 0.4)'
    },
    { 
      title: 'חוגים', 
      path: '/attendanceCalendar', 
      icon: <School />, 
      color: '#F093FB',
      description: 'ניהול חוגים ונוכחות - מעקב ודיווח',
      gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 50%, #4FACFE 100%)',
      shadowColor: 'rgba(240, 147, 251, 0.4)'
    },
    { 
      title: 'רישום תלמיד', 
      path: '/entrollStudent', 
      icon: <PersonAdd />, 
      color: '#43E97B',
      description: 'רישום תלמיד חדש למערכת בקלות',
      gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 50%, #4FACFE 100%)',
      shadowColor: 'rgba(67, 233, 123, 0.4)'
    },
    { 
      title: 'שיעורים', 
      path: '/lesson-management', 
      icon: <Assignment />, 
      color: '#FFECD2',
      description: 'ניהול שיעורים והנפקת דוחות',
      gradient: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 50%, #FF8A80 100%)',
      shadowColor: 'rgba(255, 236, 210, 0.4)'
    },
    // { 
    //   title: 'מטלות', 
    //   path: '/assignments', 
    //   icon: <Assignment />, 
    //   color: '#FFA726',
    //   description: 'ניהול מטלות ומשימות לתלמידים',
    //   gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 50%, #FF5722 100%)',
    //   shadowColor: 'rgba(255, 167, 38, 0.4)'
    // },
    // { 
    //   title: 'קבוצות', 
    //   path: '/groups', 
    //   icon: <Groups />, 
    //   color: '#667eea',
    //   description: 'ניהול קבוצות - חלוקת תלמידים יעילה',
    //   gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    //   shadowColor: 'rgba(102, 126, 234, 0.4)'
    // },
    // { 
    //   title: 'סניפים', 
    //   path: '/branches', 
    //   icon: <Business />, 
    //   color: '#26D0CE',
    //   description: 'ניהול סניפים - מיקומים ופרטי קשר',
    //   gradient: 'linear-gradient(135deg, #26D0CE 0%, #1A2980 50%, #26D0CE 100%)',
    //   shadowColor: 'rgba(38, 208, 206, 0.4)'
    // },
    // { 
    //   title: 'אודות המערכת', 
    //   path: '/aboutSystem', 
    //   icon: <Info />, 
    //   color: '#84FAB0',
    //   description: 'מידע על המערכת, גרסאות ותמיכה',
    //   gradient: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 50%, #84FAB0 100%)',
    //   shadowColor: 'rgba(132, 250, 176, 0.4)'
    // }
  ];

  // ✅ כל הפונקציות מוגדרות כאן

  const handleRegistrationSuccess = (userData) => {
    console.log('Registration success:', userData);
    setRegistrationOpen(false);
    dispatch(setCurrentUser(userData));
    setNotification({
      open: true,
      message: `🎉 ברוך הבא ${userData.FirstName || userData.firstName || 'משתמש'}! נרשמת בהצלחה למערכת`,
      severity: 'success'
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleUserMenuOpen = (event) => {
    console.log('Opening user menu, current user:', currentUser);
    console.log('Is user logged in:', isUserLoggedIn());
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenLogin = () => {
    console.log('Opening login dialog');
    setLoginDialogOpen(true);
    handleUserMenuClose();
  };

  const handleOpenRegistration = () => {
    console.log('Opening registration dialog');
    setRegistrationOpen(true);
    handleUserMenuClose();
  };

const handleLoginSuccess = (userData) => {
  console.log('🎉 Login successful! User data:', userData);
  
  try {
    // עדכן את ה-Redux state
    dispatch(setCurrentUser(userData));
    
    // שמור ב-localStorage (אופציונלי)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // הצג הודעת הצלחה
    setNotification({
      open: true,
      message: `ברוך הבא ${getUserDisplayName()}! התחברת בהצלחה למערכת 🎉`,
      severity: 'success'
    });
    
    console.log('✅ Login success handled successfully');
    
  } catch (error) {
    console.error('❌ Error handling login success:', error);
    setNotification({
      open: true,
      message: 'שגיאה בעדכון נתוני המשתמש',
      severity: 'error'
    });
  }
};
useEffect(() => {
  console.log('🔄 Checking for saved user in localStorage...');
  
  try {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      console.log('📦 Found saved user:', userData);
      dispatch(setCurrentUser(userData));
    } else {
      console.log('📭 No saved user found');
    }
  } catch (error) {
    console.error('❌ Error loading saved user:', error);
    localStorage.removeItem('currentUser'); // נקה נתונים פגומים
  }
}, [dispatch]);

  const handleLogout = () => {
    console.log('Logging out user');
    dispatch(clearCurrentUser());
    handleUserMenuClose();
    navigate('/');
    setNotification({
      open: true,
      message: '👋 התנתקת בהצלחה מהמערכת',
      severity: 'info'
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // פונקציה לקבלת אייקון משתמש משודרג
  const getUserIcon = () => {
    if (!isUserLoggedIn()) {
      return <PersonIcon sx={{ fontSize: 28, color: '#ffffff' }} />;
    }
    
    const role = currentUser.Role?.toLowerCase();
    switch (role) {
      case 'admin':
      case 'מנהל מערכת':
        return <AdminPanelSettings sx={{ fontSize: 28, color: '#ffffff' }} />;
      case 'secretary':
      case 'מזכירה':
        return <BusinessCenter sx={{ fontSize: 28, color: '#ffffff' }} />;
      case 'instructor':
      case 'מדריך':
        return <School sx={{ fontSize: 28, color: '#ffffff' }} />;
      case 'student':
      case 'תלמיד':
        return <MenuBook sx={{ fontSize: 28, color: '#ffffff' }} />;
      case 'manager':
      case 'מנהל':
        return <SupervisorAccount sx={{ fontSize: 28, color: '#ffffff' }} />;
      default:
        return <AccountCircle sx={{ fontSize: 28, color: '#ffffff' }} />;
    }
  };

const getUserDisplayName = () => {
  const user = currentUser || userById;
  
  if (!user) {
    console.log('⚠️ No user data for display name');
    return 'משתמש';
  }
  
  console.log('🏷️ Getting display name for user:', user);
  
  // נסה שמות שונים
  if (user.FirstName || user.LastName) {
    const name = `${user.FirstName || ''} ${user.LastName || ''}`.trim();
    console.log('✅ Display name from FirstName/LastName:', name);
    return name;
  }
  
  if (user.firstName || user.lastName) {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    console.log('✅ Display name from firstName/lastName:', name);
    return name;
  }
  
  if (user.Email || user.email) {
    const email = user.Email || user.email;
    console.log('✅ Display name from email:', email);
    return email;
  }
  
  if (user.Phone || user.phone) {
    const phone = user.Phone || user.phone;
    console.log('✅ Display name from phone:', phone);
    return phone;
  }
  
  console.log('⚠️ Using default display name');
  return 'משתמש';
};


  const isActive = (path) => location.pathname === path;

  // תפריט נייד מעוצב יפה
  const drawer = (
    <Box sx={{ 
      width: 350, 
      height: '100%', 
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      direction: 'rtl',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -200,
        right: -200,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(30px)'
      },
     
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -150,
        left: -150,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)'
      }
    }}>
      {/* כותרת התפריט */}
      <Paper sx={{ 
        p: 4, 
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        m: 0,
        borderRadius: 0,
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              border: '3px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              width: 60,
              height: 60
            }}>
              <School sx={{ fontSize: 30, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: '1.4rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                מערכת ניהול חוגים
              </Typography>
              <Typography variant="caption" sx={{ 
                opacity: 0.9,
                fontSize: '0.8rem',
                color: 'white'
              }}>
                ניהול חכם ויעיל
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              '&:hover': { background: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Paper>

      {/* רשימת ניווט */}
      <List sx={{ px: 2, pt: 2, position: 'relative', zIndex: 1 }}>
        {navigationItems.map((item) => (
          <motion.div
            key={item.title}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: 3,
                mb: 1.5,
                mx: 1,
                background: isActive(item.path) 
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: isActive(item.path) 
                  ? '2px solid rgba(255,255,255,0.4)'
                  : '2px solid rgba(255,255,255,0.1)',
                boxShadow: isActive(item.path) 
                  ? '0 10px 30px rgba(0,0,0,0.2)'
                  : '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                '& svg': { 
                  fontSize: 26,
                  filter: isActive(item.path) ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                secondary={item.description}
                sx={{
                  marginRight:'50px',
                  '& .MuiListItemText-primary': {
                   fontWeight: isActive(item.path) ? 700 : 600,
                  color: 'white',
                    fontSize: '1.1rem',
                    textShadow: isActive(item.path) ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                  },
                  '& .MuiListItemText-secondary': {
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.8)',
                    mt: 0.5,
                    lineHeight: 1.3
                  }
                }}
              />
            </ListItemButton>
          </motion.div>
        ))}
      </List>

      {/* מידע נוסף בתחתית */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 3,
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        zIndex: 1
      }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255,255,255,0.8)',
          fontSize: '0.75rem',
          textAlign: 'center',
          display: 'block',
          mb: 1
        }}>
          גרסה 2.0.0 • מערכת ניהול מתקדמת
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          {[1,2,3,4,5].map((star) => (
            <Star key={star} sx={{ color: '#fbbf24', fontSize: '1rem' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );

  // כפתור משתמש מעוצב
  const renderUserButton = () => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleUserMenuOpen}
          sx={{
            borderRadius: '25px',
            px: 1,
            py: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 100%)',
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.5)'
            }
          }}
          startIcon={
            <Avatar sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
              border: '2px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 5px 20px rgba(0,0,0,0.15)'
            }}>
              {getUserIcon()}
            </Avatar>
          }
          endIcon={<ExpandMore />}
        >
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 'bold',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              {isUserLoggedIn() ? getUserDisplayName() : 'ברוכים הבאים!'}
            </Typography>
            <Typography variant="caption" sx={{ 
              opacity: 0.9, 
              fontSize: '0.75rem',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {isUserLoggedIn() ? `${currentUser.Role || 'משתמש'} • מחובר` : 'לחץ להתחברות'}
            </Typography>
          </Box>
        </Button>
      </motion.div>
    );
  };

  // כפתור ניווט מעוצב
  const NavButton = ({ item }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Tooltip
        title={
          <Box sx={{ p: 1.5, maxWidth: 300 }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: item.gradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ 
              fontSize: '0.85rem', 
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.9)'
            }}>
              {item.description}
            </Typography>
          </Box>
        }
        arrow
        placement="bottom"
        sx={{
          '& .MuiTooltip-tooltip': {
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
          '& .MuiTooltip-arrow': {
            color: 'rgba(30, 58, 138, 0.95)',
          }
        }}
      >
        <Button
          onClick={() => handleNavigate(item.path)}
          startIcon={item.icon}
          sx={{
            color: isActive(item.path) ? '#1E3A8A' : '#FFFFFF',
            background: isActive(item.path) 
              ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            px: 2.5,
            py: 1.2,
            mx: 0.5,
            minWidth: 'auto',
            fontSize: '0.9rem',
            fontWeight: isActive(item.path) ? 700 : 600,
            textTransform: 'none',
            backdropFilter: 'blur(20px)',
            border: isActive(item.path) 
              ? '2px solid rgba(255, 255, 255, 0.8)'
              : '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isActive(item.path) 
              ? `0 10px 30px ${item.shadowColor}`
              : '0 5px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.5s'
            },
            '&:hover': {
              background: isActive(item.path) 
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%)'
                : item.gradient,
              color: isActive(item.path) ? '#1E3A8A' : '#FFFFFF',
              transform: 'translateY(-3px)',
              boxShadow: `0 15px 40px ${item.shadowColor}`,
              border: '2px solid rgba(255, 255, 255, 0.6)',
              '&::before': {
                left: '100%'
              }
            },
            '& .MuiButton-startIcon': {
              fontSize: '1.2rem',
              filter: isActive(item.path) ? 'none' : 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'
            }
          }}
        >
          {item.title}
        </Button>
      </Tooltip>
    </motion.div>
  );

  // ✅ תפריט משתמש מחובר
  const loggedInMenuItems = [
    <Paper key="user-header" sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      color: 'white',
      m: 0,
      borderRadius: 0,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        right: -100,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(30px)'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
        <Avatar sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '3px solid rgba(255,255,255,0.4)',
          width: 80,
          height: 80,
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
        }}>
          {getUserIcon()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            fontSize: '1.8rem',
            mb: 1,
            background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            שלום {getUserDisplayName()}! 👋
          </Typography>
          <Chip
            label={currentUser?.Role || 'משתמש'}
            size="small"
            sx={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
     
        </Box>
      </Box>
    </Paper>,

    <Divider key="divider1" sx={{ my: 0 }} />,

    <MenuItem key="profile" sx={{ py: 2, px: 3 }}>
      <AccountCircle sx={{ mr: 2, color: '#667eea' }} />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>פרופיל אישי</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          עריכת פרטים אישיים והגדרות
        </Typography>
      </Box>
    </MenuItem>,

    <MenuItem key="settings" sx={{ py: 2, px: 3 }}>
      <Settings sx={{ mr: 2, color: '#667eea' }} />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>הגדרות</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          העדפות אישיות ותצורת מערכת
        </Typography>
      </Box>
    </MenuItem>,

    <Divider key="divider2" sx={{ my: 1 }} />,

    <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'error.main', py: 2, px: 3 }}>
      <ExitToApp sx={{ mr: 2, color: 'error.main' }} />
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>התנתק</Typography>
        <Typography variant="caption" sx={{ color: 'error.light' }}>
          יציאה בטוחה מהמערכת
        </Typography>
      </Box>
    </MenuItem>
  ];

  // ✅ תפריט אורח - זה מה שצריך להיפתח כשהמשתמש לא מחובר
  const guestMenuItems = [
    <Paper key="guest-header" sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      color: 'white',
      m: 0,
      borderRadius: 0,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -100,
        right: -100,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(30px)'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)'
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
        <Avatar sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(20px)',
          border: '3px solid rgba(255,255,255,0.4)',
          width: 80,
          height: 80,
          boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
        }}>
          <PersonIcon sx={{ fontSize: 40, color: 'white' }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            fontSize: '1.8rem',
            mb: 1,
            background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
           ! ברוכים הבאים 
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.95,
            fontSize: '1rem',
            lineHeight: 1.4,
            fontWeight: 500
          }}>
            הצטרפו למערכת הניהול המתקדמת שלנו
          </Typography>
         
        </Box>
      </Box>
    </Paper>,

    <Box key="auth-buttons" sx={{ p: 4 }}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          fullWidth
          onClick={handleOpenLogin}
          sx={{
            py: 3,
            mb: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
            border: '2px solid transparent',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              transition: 'left 0.5s'
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'translateY(-3px)',
              boxShadow: '0 20px 45px rgba(102, 126, 234, 0.6)',
              '&::before': {
                left: '100%'
              }
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          startIcon={<Login sx={{ fontSize: 28 }} />}
        >
           התחבר למערכת
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          fullWidth
          onClick={handleOpenRegistration}
          variant="outlined"
          sx={{
            py: 3,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#667eea',
            color: '#667eea',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
              transition: 'left 0.5s'
            },
            '&:hover': {
              borderColor: '#5a67d8',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
              '&::before': {
                left: '100%'
              }
            },
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          startIcon={<AppRegistration sx={{ fontSize: 28 }} />}
        >
           הירשם למערכת
        </Button>
      </motion.div>

     
    
    </Box>
  ];

  // ✅ Debug - הוסף console.log כדי לראות מה קורה
  console.log('Current user state:', currentUser);
  console.log('Is user logged in:', isUserLoggedIn());
  console.log('User state object:', userState);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #764ba2 50%, #667eea 100%)',
          boxShadow: '0 10px 40px rgba(240, 147, 251, 0.3)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: theme.zIndex.drawer + 1,
          direction: 'rtl',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            animation: 'shimmer 3s infinite'
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 
 }}>
          {/* כפתור משתמש - מימין */}
          {renderUserButton()}

          {/* תפריט ניווט - במרכז */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {navigationItems.map((item) => (
                <NavButton key={item.title} item={item} />
              ))}
            </Box>
          )}

          {/* לוגו ושם המערכת - משמאל */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                border: '3px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                width: 50,
                height: 50,
                cursor: 'pointer'
              }}>
                <School sx={{ fontSize: 28, color: 'white' }} />
              </Avatar>
            </motion.div>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                מערכת ניהול חוגים
              </Typography>
              <Typography variant="caption" sx={{ 
                opacity: 0.9,
                fontSize: '0.75rem',
                color: 'white',
                display: 'block',
                textAlign: 'center'
              }}>
                ניהול חכם ויעיל
              </Typography>
            </Box>
          </Box>

          {/* כפתור תפריט נייד */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
                '&:hover': { 
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* תפריט נייד */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 350,
            border: 'none',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* תפריט משתמש */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            minWidth: 400,
            maxWidth: 450,
            mt: 2,
            borderRadius: 4,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* ✅ כאן הבעיה - צריך לבדוק נכון אם המשתמש מחובר */}
        {isUserLoggedIn() ? loggedInMenuItems : guestMenuItems}
      </Menu>

      {/* דיאלוג התחברות */}
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* דיאלוג הרשמה */}
      <UserRegistrationDialog
        open={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        onRegistrationSuccess={handleRegistrationSuccess}
      />

      {/* התראות */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
