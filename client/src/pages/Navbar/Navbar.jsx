import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import {
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
  ExitToApp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // תפריט ניווט
  const navigationItems = [
    { 
      title: 'בית', 
      path: '/', 
      icon: <Home />, 
      color: '#2196F3',
      description: 'דף הבית'
    },
    { 
      title: 'תפריט ראשי', 
      path: '/menu', 
      icon: <Dashboard />, 
      color: '#4CAF50',
      description: 'תפריט ראשי'
    },
    { 
      title: 'תלמידים', 
      path: '/students', 
      icon: <People />, 
      color: '#FF9800',
      description: 'ניהול תלמידים'
    },
    { 
      title: 'מדריכים', 
      path: '/instructors', 
      icon: <Person />, 
      color: '#9C27B0',
      description: 'ניהול מדריכים'
    },
    { 
      title: 'חוגים', 
      path: '/attendanceCalendar', 
      icon: <School />, 
      color: '#F44336',
      description: 'ניהול חוגים ונוכחות'
    },
    { 
      title: 'רישום תלמיד', 
      path: '/entrollStudent', 
      icon: <PersonAdd />, 
      color: '#00BCD4',
      description: 'רישום תלמיד חדש'
    },
    { 
      title: 'שיעורים', 
      path: '/lesson-management', 
      icon: <Assignment />, 
      color: '#795548',
      description: 'ניהול שיעורים'
    },
    { 
      title: 'מטלות', 
      path: '/assignments', 
      icon: <Assignment />, 
      color: '#795548',
      description: 'ניהול מטלות'
    },
    
    { 
      title: 'אודות המערכת', 
      path: '/aboutSystem', 
      icon: <Info />, 
      color: '#607D8B',
      description: 'מידע על המערכת'
    }
  ];

  // התראות דמה
  const notifications = [
    { id: 1, title: 'תלמיד חדש נרשם', time: '5 דקות', type: 'success' },
    { id: 2, title: 'שיעור מתחיל בעוד 15 דקות', time: '10 דקות', type: 'warning' },
    { id: 3, title: 'דוח נוכחות מוכן', time: '1 שעה', type: 'info' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // תפריט נייד
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper',direction:'rtl' }}>
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
            <School />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              מערכת ניהול
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              חוגים ותלמידים
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              button
              onClick={() => handleNavigate(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                mx: 1,
                bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                  transform: 'translateX(8px)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : item.color,
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: { 
                    color: location.pathname === item.path ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    fontSize: '0.75rem'
                  }
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Settings />}
          sx={{ mb: 1 }}
        >
          הגדרות
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExitToApp />}
          color="error"
        >
          התנתקות
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg,#667eea 0%,   rgb(108, 242, 195) 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between',direction:'rtl' }}>
          {/* לוגו וכותרת */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
                    מערכת ניהול חוגים
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                    ניהול מתקדם ויעיל
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>

          {/* תפריט דסקטופ */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navigationItems.slice(0, 7).map((item) => (
                <Tooltip key={item.path} title={item.description}>
                  <Button
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => handleNavigate(item.path)}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.title}
                  </Button>
                </Tooltip>
              ))}
            </Box>
          )}

          {/* פעולות משתמש */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* החלפת מצב */}
            <Tooltip title={darkMode ? 'מצב בהיר' : 'מצב כהה'}>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* התראות */}
            <Tooltip title="התראות">
              <IconButton color="inherit" onClick={handleNotificationsOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* פרופיל משתמש */}
            <Tooltip title="פרופיל משתמש">
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* תפריט נייד */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* תפריט התראות */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">התראות</Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsClose}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2">{notification.title}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  לפני {notification.time}
                </Typography>
                <Chip 
                  label={notification.type} 
                  size="small" 
                  color={notification.type === 'success' ? 'success' : 
                         notification.type === 'warning' ? 'warning' : 'info'}
                />
              </Box>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
            צפה בכל ההתראות
          </Typography>
        </MenuItem>
      </Menu>

      {/* תפריט פרופיל */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1">שלום, משתמש</Typography>
          <Typography variant="body2" color="text.secondary">admin@system.com</Typography>
        </Box>
             <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>פרופיל אישי</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon><Settings /></ListItemIcon>
          <ListItemText>הגדרות</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText>התנתקות</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
   
// import React, { useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Divider,
//   useTheme,
//   useMediaQuery,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Tooltip
// } from '@mui/material';
// import {
//   School as SchoolIcon,
//   People as PeopleIcon,
//   Person as PersonIcon,
//   Class as ClassIcon,
//   Business as BusinessIcon,
//   Assessment as AssessmentIcon,
//   Settings as SettingsIcon,
//   AccountCircle as AccountCircleIcon,
//   Menu as MenuIcon,
//   Logout as LogoutIcon,
//   Dashboard as DashboardIcon,
//   CalendarToday as CalendarIcon,
//   Assignment as AssignmentIcon
// } from '@mui/icons-material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const menuItems = [
//     { 
//       text: 'לוח בקרה', 
//       icon: <DashboardIcon />, 
//       path: '/dashboard',
//       color: '#3B82F6',
//       description: 'סקירה כללית של המערכת, סטטיסטיקות ונתונים חשובים'
//     },
//     { 
//       text: 'תלמידים', 
//       icon: <PeopleIcon />, 
//       path: '/students',
//       color: '#10B981',
//       description: 'ניהול תלמידים - הוספה, עריכה, מחיקה וצפייה בפרטים'
//     },
//     { 
//       text: 'מדריכים', 
//       icon: <PersonIcon />, 
//       path: '/instructors',
//       color: '#F59E0B',
//       description: 'ניהול מדריכים - רשימת המדריכים והקצאת חוגים'
//     },
//     { 
//       text: 'חוגים', 
//       icon: <SchoolIcon />, 
//       path: '/courses',
//       color: '#EF4444',
//       description: 'ניהול חוגים - יצירת חוגים חדשים ועריכת קיימים'
//     },
//     { 
//       text: 'קבוצות', 
//       icon: <ClassIcon />, 
//       path: '/groups',
//       color: '#8B5CF6',
//       description: 'ניהול קבוצות - חלוקת תלמידים לקבוצות לפי חוגים'
//     },
//     { 
//       text: 'סניפים', 
//       icon: <BusinessIcon />, 
//       path: '/branches',
//       color: '#06B6D4',
//       description: 'ניהול סניפים - מיקומים ופרטי קשר של הסניפים'
//     },
//     { 
//       text: 'נוכחות', 
//       icon: <CalendarIcon />, 
//       path: '/attendance',
//       color: '#84CC16',
//       description: 'מעקב נוכחות - רישום נוכחות תלמידים ודוחות'
//     },
//     { 
//       text: 'דוחות', 
//       icon: <AssessmentIcon />, 
//       path: '/reports',
//       color: '#F97316',
//       description: 'דוחות מפורטים - נתונים סטטיסטיים וניתוחים'
//     }
//   ];

//   const isActive = (path) => location.pathname === path;

//   const NavButton = ({ item, isMobile = false }) => (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//     >
//       {isMobile ? (
//         <ListItemButton
//           onClick={() => {
//             navigate(item.path);
//             setMobileOpen(false);
//           }}
//           sx={{
//             borderRadius: 2,
//             mb: 0.5,
//             backgroundColor: isActive(item.path) ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
//             border: isActive(item.path) ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
//             '&:hover': {
//               backgroundColor: 'rgba(59, 130, 246, 0.08)',
//               border: '1px solid rgba(59, 130, 246, 0.2)',
//             },
//           }}
//         >
//           <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
//             {item.icon}
//           </ListItemIcon>
//           <ListItemText 
//             primary={item.text}
//             secondary={item.description}
//             sx={{
//               '& .MuiListItemText-primary': {
//                 fontWeight: isActive(item.path) ? 600 : 500,
//                 color: isActive(item.path) ? '#1E3A8A' : '#374151',
//                 fontSize: '0.95rem'
//               },
//               '& .MuiListItemText-secondary': {
//                 fontSize: '0.75rem',
//                 color: '#6B7280',
//                 mt: 0.5
//               }
//             }}
//           />
//         </ListItemButton>
//       ) : (
//         <Tooltip
//           title={
//             <Box sx={{ p: 1 }}>
//               <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
//                 {item.text}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
//                 {item.description}
//               </Typography>
//             </Box>
//           }
//           arrow
//           placement="bottom"
//           sx={{
//             '& .MuiTooltip-tooltip': {
//               backgroundColor: 'rgba(30, 58, 138, 0.95)',
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               borderRadius: 2,
//               maxWidth: 280,
//             },
//             '& .MuiTooltip-arrow': {
//               color: 'rgba(30, 58, 138, 0.95)',
//             }
//           }}
//         >
//           <Button
//             onClick={() => navigate(item.path)}
//             startIcon={item.icon}
//             sx={{
//               color: isActive(item.path) ? '#1E3A8A' : '#FFFFFF',
//               backgroundColor: isActive(item.path) 
//                 ? 'rgba(255, 255, 255, 0.9)' 
//                 : 'rgba(255, 255, 255, 0.1)',
//               borderRadius: 2,
//               px: 2,
//               py: 1,
//               mx: 0.4,
//               minWidth: 'auto',
//               fontSize: '0.875rem',
//               fontWeight: isActive(item.path) ? 600 : 500,
//               textTransform: 'none',
//               border: isActive(item.path) 
//                 ? '1px solid rgba(59, 130, 246, 0.3)' 
//                 : '1px solid rgba(255, 255, 255, 0.2)',
//               transition: 'all 0.3s ease-in-out',
//               backdropFilter: 'blur(10px)',
//               boxShadow: isActive(item.path) 
//                 ? '0 4px 12px rgba(59, 130, 246, 0.2)' 
//                 : '0 2px 8px rgba(0, 0, 0, 0.1)',
//               '&:hover': {
//                 backgroundColor: isActive(item.path) 
//                   ? 'rgba(255, 255, 255, 0.95)' 
//                   : 'rgba(255, 255, 255, 0.2)',
//                 transform: 'translateY(-2px)',
//                 boxShadow: '0 6px 20px rgba(59, 130, 246, 0.25)',
//                 border: '1px solid rgba(255, 255, 255, 0.4)',
//               },
//               '& .MuiButton-startIcon': {
//                 color: isActive(item.path) ? item.color : '#FFFFFF',
//                 marginLeft: 0.5,
//                 marginRight: 0,
//                 fontSize: '1.1rem',
//               }
//             }}
//           >
//             {item.text}
//           </Button>
//         </Tooltip>
//       )}
//     </motion.div>
//   );

//   const drawer = (
//     <Box sx={{ width: 320, pt: 2, direction: 'rtl' }}>
//       <Box sx={{ px: 2, pb: 2 }}>
//         <Typography
//           variant="h6"
//           sx={{
//             fontWeight: 'bold',
//             background: 'linear-gradient(45deg, #3B82F6, #1E3A8A)',
//             backgroundClip: 'text',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             textAlign: 'center'
//           }}
//         >
//           מערכת ניהול חוגים
//         </Typography>
//       </Box>
//       <Divider />
//       <List sx={{ px: 1, pt: 1 }}>
//         {menuItems.map((item) => (
//           <NavButton key={item.text} item={item} isMobile={true} />
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(30, 58, 138, 0.98) 100%)',
//           backdropFilter: 'blur(15px)',
//           borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//           zIndex: theme.zIndex.drawer + 1,
//           direction: 'rtl',
//         }}
//       >
//         <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
//           {/* Profile Menu - מימין */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <IconButton
//               size="large"
//               edge="end"
//               aria-label="account of current user"
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               sx={{
//                 color: 'white',
//                 '&:hover': {
//                   backgroundColor: 'rgba(255, 255, 255, 0.1)',
//                 }
//               }}
//             >
//               <Avatar sx={{ 
//                 width: 36, 
//                 height: 36, 
//                 bgcolor: 'rgba(255, 255, 255, 0.2)',
//                 border: '2px solid rgba(255, 255, 255, 0.3)'
//               }}>
//                 <AccountCircleIcon />
//               </Avatar>
//             </IconButton>
//           </Box>

//           {/* Desktop Navigation - במרכז */}
//           {!isMobile && (
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               gap: 0.5,
//               backgroundColor: 'rgba(0, 0, 0, 0.1)',
//               borderRadius: 3,
//               p: 0.8,
//               backdropFilter: 'blur(10px)',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//             }}>
//               {menuItems.map((item) => (
//                 <NavButton key={item.text} item={item} />
//               ))}
//             </Box>
//           )}

//           {/* Logo - משמאל */}
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {/* Mobile Menu Button */}
//             {isMobile && (
//               <IconButton
//                 color="inherit"
//                 aria-label="open drawer"
//                 edge="start"
//                 onClick={handleDrawerToggle}
//                 sx={{ ml: 2 }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}
            
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Typography
//                   variant="h6"
//                   component="div"
//                   sx={{
//                     fontWeight: 'bold',
//                     color: 'white',
//                     textShadow: '0 2px 4px rgba(0,0,0,0.3)',
//                     display: { xs: 'none', sm: 'block' }
//                   }}
//                 >
//                   מערכת ניהול חוגים
//                 </Typography>
//                 <SchoolIcon sx={{ fontSize: 32, color: '#FBBF24' }} />
//               </Box>
//             </motion.div>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         variant="temporary"
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true,
//         }}
//         sx={{
//           display: { xs: 'block', md: 'none' },
//           '& .MuiDrawer-paper': {
//             boxSizing: 'border-box',
//             width: 320,
//             background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)',
//           },
//         }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'left',
//         }}
//         keepMounted
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'left',
//         }}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//                 sx={{
//           '& .MuiPaper-root': {
//             borderRadius: 2,
//             minWidth: 200,
//             boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//             border: '1px solid rgba(0, 0, 0, 0.05)',
//             direction: 'rtl',
//           }
//         }}
//       >
//         <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, direction: 'rtl' }}>
//           <AccountCircleIcon sx={{ color: '#3B82F6' }} />
//           פרופיל
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, direction: 'rtl' }}>
//           <SettingsIcon sx={{ color: '#6B7280' }} />
//           הגדרות
//         </MenuItem>
//         <Divider />
//         <MenuItem 
//           onClick={() => {
//             handleMenuClose();
//             // Add logout logic here
//           }}
//           sx={{ 
//             gap: 1.5,
//             direction: 'rtl',
//             color: '#EF4444',
//             '&:hover': {
//               backgroundColor: 'rgba(239, 68, 68, 0.05)'
//             }
//           }}
//         >
//           <LogoutIcon />
//           התנתק
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// export default Navbar;

