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
      path: '/courses', 
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
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
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
              {navigationItems.slice(0, 6).map((item) => (
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
