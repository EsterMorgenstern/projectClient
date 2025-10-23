
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
  AppRegistration,
   MoreHoriz, 
  StickyNote2, 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clearCurrentUser, selectUserData, setCurrentUser } from '../../../../store/user/userSlice';
import LoginDialog from '../../../LogIn/LogInDialog';
import UserRegistrationDialog from '../../../LogIn/UserRegistrationDialog';

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
const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  // ✅ תיקון Redux state - בדיקה מדויקת יותר
  const userState = useSelector(state => state.users);
  const { userById, currentUser } = useSelector(selectUserData);
  const loading = userState?.loading;

  // ✅ פונקציה לבדיקה אם המשתמש באמת מחובר
  const isUserLoggedIn = () => {
  // console.log('🔍 Checking if user is logged in...');
  // console.log('currentUser:', currentUser);
  // console.log('userById:', userById);
  
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
// עדכן את navigationItems (שורה ~80 בערך) עם צבעים חמים יותר:
const navigationItems = [
  { 
    title: 'בית', 
    path: '/', 
    icon: <Home />, 
    color: '#FF6B6B', // אדום חם
    description: 'דף הבית - סקירה כללית של המערכת',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFB347 100%)',
    shadowColor: 'rgba(255, 107, 107, 0.4)'
  },
  { 
    title: 'תלמידים', 
    path: '/students', 
    icon: <People />, 
    color: '#45B7D1', // כחול בהיר
    description: 'ניהול תלמידים - רישום, מעקב והערכה',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #4FACFE 50%, #00F2FE 100%)',
    shadowColor: 'rgba(69, 183, 209, 0.4)'
  },
  { 
    title: 'מדריכים', 
    path: '/instructors', 
    icon: <Person />, 
    color: '#A78BFA', // סגול
    description: 'ניהול מדריכים - צוות הוראה ומשאבים',
    gradient: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 50%, #F093FB 100%)',
    shadowColor: 'rgba(167, 139, 250, 0.4)'
  },
  { 
    title: 'חוגים', 
    path: '/attendanceCalendar', 
    icon: <School />, 
    color: '#43E97B', // ירוק חי
    description: 'ניהול חוגים ונוכחות - מעקב ודיווח',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 50%, #4FACFE 100%)',
    shadowColor: 'rgba(67, 233, 123, 0.4)'
  },
  { 
    title: 'רישום', 
    path: '/entrollStudent', 
    icon: <PersonAdd />, 
    color: '#F6D365', // צהב זהב
    description: 'רישום תלמיד חדש למערכת בקלות',
    gradient: 'linear-gradient(135deg, #F6D365 0%, #FDA085 50%, #FF9A9E 100%)',
    shadowColor: 'rgba(246, 211, 101, 0.4)'
  },
  { 
    title: 'שיעורים', 
    path: '/lesson-management', 
    icon: <Assignment />, 
    color: '#FF8A80', // ורוד אדמדם
    description: 'ניהול שיעורים והנפקת דוחות',
    gradient: 'linear-gradient(135deg, #FF8A80 0%, #FFAB91 50%, #FFECD2 100%)',
    shadowColor: 'rgba(255, 138, 128, 0.4)'
  },
  {
    title: 'גביה',
    path: '/health-fund-management',
    icon: <AssessmentIcon />,
    color: '#43E97B', // ירוק חי
    description: 'ניהול קופות חולים והצגת גביה',
    gradient: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 50%, #4FACFE 100%)',
    shadowColor: 'rgba(67, 233, 123, 0.4)'
  },
  // { 
  //   title: 'GROW תשלומים', 
  //   path: '/grow-payment-test', 
  //   icon: <AccountCircle />, 
  //   color: '#00E676', // ירוק בהיר
  //   description: 'בדיקת מערכת תשלומי GROW Wallet',
  //   gradient: 'linear-gradient(135deg, #00E676 0%, #00C853 50%, #4CAF50 100%)',
  //   shadowColor: 'rgba(0, 230, 118, 0.4)'
  // },
  { 
    title: 'עוד', 
    path: null, 
    color: '#FFA726', // כתום חם
    description: 'תפריט נוסף - הערות אישיות ומידע על המערכת',
    gradient: 'linear-gradient(135deg, #FFA726 0%, #FF7043 50%, #F48FB1 100%)',
    shadowColor: 'rgba(255, 167, 38, 0.4)',
    isMore: true 
  }
];

  // ✅ כל הפונקציות מוגדרות כאן

const handleMoreMenuOpen = (event) => {
  setMoreMenuAnchor(event.currentTarget);
};

const handleMoreMenuClose = () => {
  setMoreMenuAnchor(null);
};

const handleNavigateToAbout = () => {
  navigate('/aboutSystem');
  handleMoreMenuClose();
};

const handleNavigateToRegistrationTracking = () => {
  navigate('/registration-tracking');
  handleMoreMenuClose();
};
  const handleNavigateToNotes = () => {
  navigate('/my-notes');
  handleUserMenuClose();
};
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
  
  // קבל שם פרטי ומשפחה
  const firstName = user.FirstName || user.firstName || '';
  const lastName = user.LastName || user.lastName || '';
  
  // אם יש שם פרטי, החזר אותו
  if (firstName) {
    console.log('✅ Display name from firstName:', firstName);
    return firstName;
  }
  
  // אם יש שם מלא, נסה לחלץ את השם הפרטי
  if (lastName && !firstName) {
    // אם יש רק שם משפחה, השתמש בו
    console.log('✅ Display name from lastName:', lastName);
    return lastName;
  }
  
  // נסה לחלץ מאימייל
  if (user.Email || user.email) {
    const email = user.Email || user.email;
    const emailName = email.split('@')[0];
    console.log('✅ Display name from email:', emailName);
    return emailName;
  }
  
  // נסה לחלץ מטלפון
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
            
            <Box>
              <Box sx={{ minWidth: 10, maxWidth: 30 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  maxWidth: 30,
                  whiteSpace: 'normal'
                }}>
                  מערכת ניהול חוגים
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontSize: '0.8rem',
                  color: 'white',
                  maxWidth: 30,
                  whiteSpace: 'normal'
                }}>
                  ניהול חכם ויעיל
                </Typography>
              </Box>
            </Box>
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
      <List sx={{ px: 2, pt: 2, position: 'relative', zIndex: 1}}>
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
                minWidth: 40, // רווח קבוע בין האייקון לטקסט
  mr: 2,        // רווח נוסף אם צריך
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
  const displayName = isUserLoggedIn() ? getUserDisplayName() : 'ברוכים הבאים!';
  const userRole = isUserLoggedIn() ? (currentUser?.Role || 'משתמש') : 'לחץ להתחברות';
  
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
  py: 0.7,
  minWidth: '130px',
  maxWidth: '210px',
  width: 'auto',
  background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.25) 0%, rgba(67, 233, 123, 0.25) 50%, rgba(246, 211, 101, 0.25) 100%)', // ✅ גרדיאנט צבעוני
  backdropFilter: 'blur(20px)',
  border: '2px solid rgba(255,255,255,0.3)',
  color: 'white',
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // ✅ הוסף display flex ו-alignItems
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1, // רווח בין האלמנטים
          position: 'relative', // ✅ חשוב לבקרת z-index
          '&:hover': {
    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.4) 0%, rgba(67, 233, 123, 0.4) 50%, rgba(246, 211, 101, 0.4) 100%)', // ✅ גרדיאנט hover צבעוני
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 40px rgba(240, 147, 251, 0.3)',
    border: '2px solid rgba(255,255,255,0.5)'
  },
          // ✅ תקן את ה-MuiButton-startIcon ו-endIcon
          '& .MuiButton-startIcon': {
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
            position: 'relative',
            zIndex: 1
          },
          '& .MuiButton-endIcon': {
            margin: 0,
            marginLeft: 0,
            marginRight: 0,
            position: 'relative',
            zIndex: 1
          }
        }}
        // ✅ הסר את startIcon ו-endIcon מהכפתור עצמו
      >
        {/* ✅ בנה את התוכן ידנית */}
        <Avatar sx={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
          border: '2px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 5px 20px rgba(0,0,0,0.15)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1 // ✅ z-index נמוך יותר מהטקסט
        }}>
          {getUserIcon()}
        </Avatar>

        <Box sx={{ 
          textAlign: 'right',
          overflow: 'hidden',
          minWidth: 0,
          flex: 1,
          position: 'relative',
          zIndex: 2, // ✅ z-index גבוה יותר מהאווטאר
          mx: 1 // מרווח מהצדדים
        }}>
          <Typography variant="body1" sx={{ 
            fontWeight: 'bold',
            fontSize: '1rem',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '140px',
            position: 'relative',
            zIndex: 2 // ✅ וודא שהטקסט מעל הכל
          }}>
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ 
            opacity: 0.9, 
            fontSize: '0.75rem',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '140px',
            display: 'block',
            position: 'relative',
            zIndex: 2 // ✅ וודא שהטקסט מעל הכל
          }}>
            {userRole} {isUserLoggedIn() ? '• מחובר' : ''}
          </Typography>
        </Box>

        <ExpandMore sx={{ 
          flexShrink: 0,
          position: 'relative',
          zIndex: 1 // ✅ z-index נמוך יותר מהטקסט
        }} />
      </Button>
    </motion.div>
  );
};
  // כפתור ניווט מעוצב
 const NavButton = ({ item, index }) => (
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
    >
      <Button
        onClick={item.isMore ? handleMoreMenuOpen : () => handleNavigate(item.path)}
        startIcon={item.isMore ? <ExpandMore sx={{ fontSize: '18px !important' }} /> : item.icon}
        sx={{
          color: (item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path) ? '#1E3A8A' : '#FFFFFF',
          background: (item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path)
            ? 'rgba(255, 255, 255, 0.95)'
            : item.isMore 
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          px: { xs: 0.5, sm: 0.8, md: 1.2, lg: 1.5 },
          py: { xs: 1, sm: 1.1, md: 1.2 },
          mx: 0,
          minWidth: item.isMore ? { xs: '40px', sm: '50px', md: '60px' } : { xs: '45px', sm: '65px', md: '80px', lg: '100px' },
          maxWidth: item.isMore ? { xs: '40px', sm: '50px', md: '60px' } : { xs: '70px', sm: '90px', md: '110px', lg: '130px' },
          flex: '1 1 0',
          width: 'auto',
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem', lg: '1rem' },
          fontWeight: ((item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path)) ? 600 : 500,
          textTransform: 'none',
          backdropFilter: 'blur(10px)',
          border: item.isMore 
            ? '1px solid rgba(255, 255, 255, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&:hover': {
            background: ((item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path))
              ? 'rgba(255, 255, 255, 1)'
              : item.gradient || 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          },
          '& .MuiButton-startIcon': {
            marginLeft: 0,
            marginRight: item.isMore ? { xs: 0, sm: 0.3, md: 0.5 } : { xs: 0.3, sm: 0.5, md: 0.7 },
            '& svg': {
              fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '22px' },
              color: ((item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path)) ? 'inherit' : item.color,
              transition: 'color 0.2s ease',
              filter: ((item.isMore && Boolean(moreMenuAnchor)) || isActive(item.path)) ? 'none' : `drop-shadow(0 0 4px ${item.color}40)`
            }
          },
          '&:hover .MuiButton-startIcon svg': {
            color: '#FFFFFF !important'
          }
        }}
      >
        {item.isMore ? (
          <Box sx={{ 
            display: { xs: 'none', sm: 'block', md: 'block' },
            fontSize: { sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
            fontWeight: 600
          }}>
            {item.title}
          </Box>
        ) : item.title}
      </Button>
    </Tooltip>
  </motion.div>
);

  // ✅ תפריט משתמש מחובר
  const loggedInMenuItems = [
    <Paper key="user-header" sx={{ 
      p: 4, 
  background: 'linear-gradient(135deg, #43E97B 0%, #f093fb 30%, #667eea 60%, #F6D365 100%)', // ✅ גרדיאנט צבעוני
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
          width: 50,
          height: 50,
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
           👋  שלום {getUserDisplayName()}
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

    <MenuItem key="my-notes" onClick={handleNavigateToNotes} sx={{ py: 2, px: 3 }}>
    <StickyNote2 sx={{ mr: 2, color: '#667eea' }} />
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>ההערות שלי</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        צפייה וניהול ההערות האישיות שלי
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
  background: 'linear-gradient(135deg, #43E97B 0%, #f093fb 30%, #667eea 60%, #F6D365 100%)', // ✅ אותו צבע כמו loggedIn
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
            background: '#2e46b1ff ',
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
              background: '#5a67d8 ',
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

  // console.log('Current user state:', currentUser);
  // console.log('Is user logged in:', isUserLoggedIn());
  // console.log('User state object:', userState);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg,#2a5298 50%,#4facfe 100%)',
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
        <Toolbar sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 0.3, md: 0.8 }, 
          minHeight: '64px !important',
          width: '100%'
        }}>
          {/* כפתור משתמש - מימין */}
          <Box sx={{ flexShrink: 0, minWidth: { xs: '70px', sm: '80px', md: '90px' }, display: 'flex', justifyContent: 'flex-end' }}>
            {renderUserButton()}
          </Box>

          {/* תפריט ניווט - במרכז */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flex: 1,
              gap: { xs: 0.2, sm: 0.4, md: 0.6 },
              px: { xs: 0.5, sm: 1, md: 1.5 },
              minHeight: 64,
              width: '100%',
              maxWidth: 'none',
              overflow: 'hidden',
            }}>
              {navigationItems.map((item, index) => (
                <NavButton key={item.title} item={item} index={index} />
              ))}
            </Box>
          )}

          {/* לוגו ושם המערכת - משמאל */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0, minWidth: { xs: '70px', sm: '80px', md: '90px' } }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
             
            </motion.div>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ maxWidth: { sm: '120px', md: '150px', lg: '180px' } }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  fontSize: { sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(45deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  מערכת ניהול חוגים
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.9,
                  fontSize: { sm: '0.7rem', md: '0.75rem' },
                  color: 'white',
                  display: 'block',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  ניהול חכם ויעיל
                </Typography>
              </Box>
            </Box>

             <Avatar sx={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                border: '2px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                width: { xs: 40, sm: 45, md: 50 },
                height: { xs: 40, sm: 45, md: 50 },
                cursor: 'pointer'
              }}>
                <School sx={{ fontSize: { xs: 22, sm: 25, md: 28 }, color: 'white' }} />
              </Avatar>
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

       <Menu
      anchorEl={moreMenuAnchor}
      open={Boolean(moreMenuAnchor)}
      onClose={handleMoreMenuClose}
      PaperProps={{
        sx: {
          minWidth: 300,
          mt: 2,
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }
      }}
      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
    >
      {/* כותרת התפריט */}
      <Paper sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)',
        color: 'white',
        m: 0,
        borderRadius: 0,
        textAlign: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          תפריט נוסף
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          כלים ומידע נוסף
        </Typography>
      </Paper>

      <Divider />

      {/* מעקב רישום תלמידים */}
      <MenuItem onClick={handleNavigateToRegistrationTracking} sx={{ py: 2, px: 3 }}>
        <ListItemIcon>
          <Assignment sx={{ color: '#667eea' }} />
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>מעקב רישום</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            מעקב אחר תהליכי רישום ומשימות תלמידים
          </Typography>
        </ListItemText>
      </MenuItem>

      <Divider />

      {/* הערות אישיות */}
      <MenuItem onClick={handleNavigateToNotes} sx={{ py: 2, px: 3 }}>
        <ListItemIcon>
          <StickyNote2 sx={{ color: '#667eea' }} />
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>ההערות שלי</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            צפייה וניהול ההערות האישיות שלי
          </Typography>
        </ListItemText>
      </MenuItem>

      <Divider />

      {/* אודות המערכת */}
      <MenuItem onClick={handleNavigateToAbout} sx={{ py: 2, px: 3 }}>
        <ListItemIcon>
          <Info sx={{ color: '#667eea' }} />
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>אודות המערכת</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            מידע על המערכת, גרסאות ותמיכה
          </Typography>
        </ListItemText>
      </MenuItem>
    </Menu>
  </>
);
 
};

export default Navbar;
