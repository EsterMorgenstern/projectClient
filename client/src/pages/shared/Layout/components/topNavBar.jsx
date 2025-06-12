// import React, { useState, useEffect } from 'react';
// import { 
//   AppBar, 
//   Toolbar, 
//   Box, 
//   IconButton, 
//   Typography, 
//   Menu, 
//   MenuItem, 
//   ListItemIcon, 
//   ListItemText,
//   Avatar, 
//   Tooltip, 
//   Badge, 
//   Switch, 
//   useMediaQuery, 
//   Drawer, 
//   List, 
//   ListItem, 
//   ListItemButton,
//   Divider,
//   Button,
//   InputBase,
//   Collapse
// } from '@mui/material';
// import { styled, alpha, useTheme } from '@mui/material/styles';
// import { 
//   Menu as MenuIcon, 
//   Notifications as NotificationsIcon, 
//   Search as SearchIcon, 
//   Home as HomeIcon,
//   People as StudentsIcon,
//   School as InstructorsIcon,
//   EventNote as CoursesIcon,
//   AssignmentInd as AssignIcon,
//   DarkMode as DarkModeIcon,
//   LightMode as LightModeIcon,
//   Settings as SettingsIcon,
//   AccountCircle as AccountIcon,
//   Help as HelpIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   Dashboard as DashboardIcon,
//   CalendarMonth as CalendarIcon,
//   Logout as LogoutIcon
// } from '@mui/icons-material';
// import { FaRegLightbulb } from 'react-icons/fa';
// import { Link, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// // Styled components
// const StyledAppBar = styled(AppBar)(({ theme, darkMode }) => ({
//   background: darkMode 
//     ? 'linear-gradient(90deg, #1A237E 0%, #283593 100%)' 
//     : 'linear-gradient(90deg, #1E3A8A 0%, #3B82F6 100%)',
//   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//   position: 'sticky',
//   top: 0,
//   zIndex: theme.zIndex.drawer + 1,
// }));

// const StyledToolbar = styled(Toolbar)({
//   display: 'flex',
//   justifyContent: 'space-between',
//   padding: '0 16px',
// });

// const LogoContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '12px',
// }));

// const SearchContainer = styled('div')(({ theme, darkMode }) => ({
//   position: 'relative',
//   borderRadius: '50px',
//   backgroundColor: alpha(theme.palette.common.white, darkMode ? 0.1 : 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, darkMode ? 0.15 : 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
//   transition: 'all 0.3s ease',
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//       '&:focus': {
//         width: '30ch',
//       },
//     },
//   },
// }));

// const ActionsContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '8px',
// }));

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: '#44b700',
//     color: '#44b700',
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     '&::after': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       animation: 'ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""',
//     },
//   },
//   '@keyframes ripple': {
//     '0%': {
//       transform: 'scale(.8)',
//       opacity: 1,
//     },
//     '100%': {
//       transform: 'scale(2.4)',
//       opacity: 0,
//     },
//   },
// }));

// const StyledDrawer = styled(Drawer)(({ theme, darkMode }) => ({
//   width: 280,
//   flexShrink: 0,
//   '& .MuiDrawer-paper': {
//     width: 280,
//     boxSizing: 'border-box',
//     background: darkMode 
//       ? 'linear-gradient(180deg, #1A237E 0%, #283593 100%)' 
//       : 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
//     color: 'white',
//     borderRight: 'none',
//   },
// }));

// const DrawerHeader = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: theme.spacing(2),
//   borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
// }));

// const StyledListItemButton = styled(ListItemButton)(({ theme, active, darkMode }) => ({
//   margin: '4px 8px',
//   borderRadius: '10px',
//   backgroundColor: active 
//     ? alpha(theme.palette.common.white, darkMode ? 0.15 : 0.1) 
//     : 'transparent',
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, darkMode ? 0.2 : 0.15),
//   },
//   transition: 'all 0.2s ease',
// }));

// const TopNavbar = () => {
//   const theme = useTheme();
//   const location = useLocation();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
//   const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
//   const [searchValue, setSearchValue] = useState('');
//   const [reportsOpen, setReportsOpen] = useState(false);
  
//   // Mock notifications
//   const [notifications, setNotifications] = useState([
//     { id: 1, message: 'תלמיד חדש נרשם לחוג ציור', time: '10:30', read: false },
//     { id: 2, message: 'שיעור בוטל: יוגה מתחילים', time: '12:45', read: false },
//     { id: 3, message: 'תזכורת: פגישת צוות בשעה 14:00', time: '13:30', read: true },
//   ]);
  
//   // Toggle dark mode
//   const handleDarkModeToggle = () => {
//     const newDarkMode = !darkMode;
//     setDarkMode(newDarkMode);
//     localStorage.setItem('darkMode', newDarkMode.toString());
//     // Here you would also update your theme context/provider
//   };
  
//   // Handle notifications menu
//   const handleNotificationsOpen = (event) => {
//     setNotificationsAnchorEl(event.currentTarget);
//   };
  
//   const handleNotificationsClose = () => {
//     setNotificationsAnchorEl(null);
//   };
  
//   // Handle user menu
//   const handleUserMenuOpen = (event) => {
//     setUserMenuAnchorEl(event.currentTarget);
//   };
  
//   const handleUserMenuClose = () => {
//     setUserMenuAnchorEl(null);
//   };
  
//   // Handle drawer
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };
  
//   // Handle search
//   const handleSearchChange = (event) => {
//     setSearchValue(event.target.value);
//   };
  
//   const handleSearchSubmit = (event) => {
//     if (event.key === 'Enter') {
//       console.log('Searching for:', searchValue);
//       // Implement search functionality
//     }
//   };
  
//   // Mark notification as read
//   const markNotificationAsRead = (id) => {
//     setNotifications(notifications.map(notification => 
//       notification.id === id ? { ...notification, read: true } : notification
//     ));
//     handleNotificationsClose();
//   };
  
//   // Check if a route is active
//   const isRouteActive = (route) => {
//     if (route === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname.startsWith(route);
//   };
  
//   // Navigation items
//   const navigationItems = [
//     { text: 'דף הבית', icon: <HomeIcon />, path: '/' },
//     { text: 'ניהול תלמידים', icon: <StudentsIcon />, path: '/students' },
//     { text: 'ניהול מדריכים', icon: <InstructorsIcon />, path: '/instructors' },
//     { text: 'ניהול חוגים', icon: <CoursesIcon />, path: '/courses' },
//     { text: 'שיבוץ תלמידים לחוגים', icon: <AssignIcon />, path: '/entrollStudent' },
//     { text: 'לוח שנה', icon: <CalendarIcon />, path: '/calendar' },
//     { 
//       text: 'דוחות', 
//       icon: <DashboardIcon />, 
//       path: '/reports',
//       subItems: [
//         { text: 'דוח נוכחות', path: '/reports/attendance' },
//         { text: 'דוח הכנסות', path: '/reports/revenue' },
//         { text: 'דוח תלמידים', path: '/reports/students' },
//       ]
//     },
//     { text: 'אודות המערכת', icon: <FaRegLightbulb style={{ fontSize: '1.2rem' }} />, path: '/aboutSystem' },
//   ];
  
//   // Render drawer content
//   const renderDrawerContent = () => (
//     <>
//       <DrawerHeader>
//         <Typography variant="h5" sx={{ fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
//           מערכת לניהול חוגים
//         </Typography>
//       </DrawerHeader>
      
//       <Box sx={{ p: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <StyledBadge
//             overlap="circular"
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             variant="dot"
//           >
//             <Avatar 
//               sx={{ width: 50, height: 50, border: '2px solid white' }}
//               alt="Admin User"
//               src="/assets/avatar.jpg"
//             />
//           </StyledBadge>
//           <Box sx={{ ml: 2 }}>
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//               שלום, מנהל
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.8 }}>
//               מנהל מערכת
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
      
//       <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
//       <List sx={{ pt: 1 }}>
//         {navigationItems.map((item) => (
//           <React.Fragment key={item.text}>
//             {item.subItems ? (
//               <>
//                 <ListItem disablePadding>
//                   <StyledListItemButton
//                     active={isRouteActive(item.path)}
//                     darkMode={darkMode}
//                     onClick={() => setReportsOpen(!reportsOpen)}
//                   >
//                     <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
//                       {item.icon}
//                     </ListItemIcon>
//                     <ListItemText primary={item.text} />
//                     {reportsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                   </StyledListItemButton>
//                 </ListItem>
                
//                 <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
//                   <List component="div" disablePadding>
//                     {item.subItems.map((subItem) => (
//                       <ListItem key={subItem.text} disablePadding>
//                         <StyledListItemButton
//                           component={Link}
//                           to={subItem.path}
//                           active={location.pathname === subItem.path}
//                           darkMode={darkMode}
//                           sx={{ pl: 4 }}
//                         >
//                           <ListItemText 
//                             primary={subItem.text} 
//                             primaryTypographyProps={{ fontSize: '0.9rem' }}
//                           />
//                         </StyledListItemButton>
//                       </ListItem>
//                     ))}
//                   </List>
//                 </Collapse>
//               </>
//             ) : (
//               <ListItem disablePadding>
//                 <StyledListItemButton
//                   component={Link}
//                   to={item.path}
//                   active={isRouteActive(item.path)}
//                   darkMode={darkMode}
//                   onClick={() => setDrawerOpen(false)}
//                 >
//                   <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText primary={item.text} />
//                 </StyledListItemButton>
//               </ListItem>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//             <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//           <Typography variant="body2">מצב לילה</Typography>
//           <Switch
//             checked={darkMode}
//             onChange={handleDarkModeToggle}
//             icon={<LightModeIcon sx={{ color: 'orange' }} />}
//             checkedIcon={<DarkModeIcon sx={{ color: '#5C6BC0' }} />}
//             sx={{
//               '& .MuiSwitch-switchBase.Mui-checked': {
//                 color: '#5C6BC0',
//               },
//               '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                 backgroundColor: '#3949AB',
//               },
//             }}
//           />
//         </Box>
        
//         <Button
//           variant="contained"
//           fullWidth
//           startIcon={<LogoutIcon />}
//           sx={{
//             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             '&:hover': {
//               backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             },
//             borderRadius: '10px',
//             textTransform: 'none',
//           }}
//         >
//           התנתקות
//         </Button>
//       </Box>
//     </>
//   );
  
//   return (
//     <>
//       <StyledAppBar darkMode={darkMode}>
//         <StyledToolbar>
//           <LogoContainer>
//             {isMobile && (
//               <IconButton
//                 color="inherit"
//                 aria-label="open drawer"
//                 edge="start"
//                 onClick={toggleDrawer}
//                 sx={{ mr: 1 }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}
            
//             <Typography
//               variant="h6"
//               noWrap
//               component={Link}
//               to="/"
//               sx={{
//                 fontWeight: 700,
//                 textDecoration: 'none',
//                 color: 'white',
//                 display: { xs: 'none', sm: 'block' },
//                 textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
//               }}
//             >
//               מערכת לניהול חוגים
//             </Typography>
//           </LogoContainer>
          
//           {!isMobile && (
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               {navigationItems.slice(0, 5).map((item) => (
//                 <Button
//                   key={item.text}
//                   component={Link}
//                   to={item.path}
//                   startIcon={item.icon}
//                   sx={{
//                     color: 'white',
//                     textTransform: 'none',
//                     borderRadius: '8px',
//                     px: 1.5,
//                     backgroundColor: isRouteActive(item.path) 
//                       ? 'rgba(255, 255, 255, 0.15)' 
//                       : 'transparent',
//                     '&:hover': {
//                       backgroundColor: 'rgba(255, 255, 255, 0.25)',
//                     },
//                   }}
//                 >
//                   {item.text}
//                 </Button>
//               ))}
//             </Box>
//           )}
          
//           <ActionsContainer>
//             <SearchContainer darkMode={darkMode}>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase
//                 placeholder="חיפוש..."
//                 inputProps={{ 'aria-label': 'search' }}
//                 value={searchValue}
//                 onChange={handleSearchChange}
//                 onKeyPress={handleSearchSubmit}
//               />
//             </SearchContainer>
            
//             <Tooltip title="התראות">
//               <IconButton
//                 size="large"
//                 aria-label="show new notifications"
//                 color="inherit"
//                 onClick={handleNotificationsOpen}
//               >
//                 <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
//                   <NotificationsIcon />
//                 </Badge>
//               </IconButton>
//             </Tooltip>
            
//             <Tooltip title="הגדרות משתמש">
//               <IconButton
//                 size="large"
//                 edge="end"
//                 aria-label="account of current user"
//                 aria-haspopup="true"
//                 onClick={handleUserMenuOpen}
//                 color="inherit"
//               >
//                 <StyledBadge
//                   overlap="circular"
//                   anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                   variant="dot"
//                 >
//                   <Avatar alt="Admin User" src="/assets/avatar.jpg" />
//                 </StyledBadge>
//               </IconButton>
//             </Tooltip>
            
//             {!isMobile && (
//               <Tooltip title={darkMode ? "מצב יום" : "מצב לילה"}>
//                 <IconButton color="inherit" onClick={handleDarkModeToggle}>
//                   {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
//                 </IconButton>
//               </Tooltip>
//             )}
//           </ActionsContainer>
//         </StyledToolbar>
//       </StyledAppBar>
      
//       {/* Drawer for mobile */}
//       <StyledDrawer
//         variant="temporary"
//         open={drawerOpen}
//         onClose={toggleDrawer}
//         ModalProps={{
//           keepMounted: true, // Better open performance on mobile
//         }}
//         darkMode={darkMode}
//       >
//         {renderDrawerContent()}
//       </StyledDrawer>
      
//       {/* Notifications Menu */}
//       <Menu
//         anchorEl={notificationsAnchorEl}
//         open={Boolean(notificationsAnchorEl)}
//         onClose={handleNotificationsClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             overflow: 'visible',
//             filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
//             mt: 1.5,
//             minWidth: 300,
//             maxWidth: 360,
//             borderRadius: '12px',
//             '&:before': {
//               content: '""',
//               display: 'block',
//               position: 'absolute',
//               top: 0,
//               right: 14,
//               width: 10,
//               height: 10,
//               bgcolor: 'background.paper',
//               transform: 'translateY(-50%) rotate(45deg)',
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
//           <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//             התראות
//           </Typography>
//         </Box>
        
//         <Box sx={{ maxHeight: 360, overflow: 'auto' }}>
//           <AnimatePresence>
//             {notifications.length > 0 ? (
//               notifications.map((notification) => (
//                 <motion.div
//                   key={notification.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <MenuItem
//                     onClick={() => markNotificationAsRead(notification.id)}
//                     sx={{
//                       py: 1.5,
//                       px: 2,
//                       borderLeft: notification.read ? 'none' : '3px solid #3B82F6',
//                       backgroundColor: notification.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
//                       '&:hover': {
//                         backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                       },
//                     }}
//                   >
//                     <Box sx={{ width: '100%' }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                         <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
//                           {notification.message}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           {notification.time}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </MenuItem>
//                 </motion.div>
//               ))
//             ) : (
//               <Box sx={{ p: 3, textAlign: 'center' }}>
//                 <Typography variant="body2" color="text.secondary">
//                   אין התראות חדשות
//                 </Typography>
//               </Box>
//             )}
//           </AnimatePresence>
//         </Box>
        
//         <Box sx={{ p: 1, borderTop: '1px solid #eee', textAlign: 'center' }}>
//           <Button
//             size="small"
//             sx={{ textTransform: 'none', color: 'primary.main' }}
//             onClick={handleNotificationsClose}
//           >
//             סמן הכל כנקרא
//           </Button>
//         </Box>
//       </Menu>
      
//       {/* User Menu */}
//       <Menu
//         anchorEl={userMenuAnchorEl}
//         open={Boolean(userMenuAnchorEl)}
//         onClose={handleUserMenuClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             overflow: 'visible',
//             filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
//             mt: 1.5,
//             minWidth: 220,
//             borderRadius: '12px',
//             '&:before': {
//               content: '""',
//               display: 'block',
//               position: 'absolute',
//               top: 0,
//               right: 14,
//               width: 10,
//               height: 10,
//               bgcolor: 'background.paper',
//               transform: 'translateY(-50%) rotate(45deg)',
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//         anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//       >
//         <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Avatar 
//               sx={{ width: 40, height: 40, mr: 1.5 }}
//               alt="Admin User"
//               src="/assets/avatar.jpg"
//             />
//             <Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                 מנהל מערכת
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 admin@example.com
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
        
//         <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
//           <ListItemIcon>
//             <AccountIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>הפרופיל שלי</ListItemText>
//         </MenuItem>
        
//         <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
//           <ListItemIcon>
//             <SettingsIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>הגדרות</ListItemText>
//         </MenuItem>
        
//         <MenuItem component={Link} to="/help" onClick={handleUserMenuClose}>
//           <ListItemIcon>
//             <HelpIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>עזרה ותמיכה</ListItemText>
//         </MenuItem>
        
//         <Divider />
        
//         <MenuItem onClick={handleUserMenuClose}>
//           <ListItemIcon>
//             <LogoutIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>התנתקות</ListItemText>
//         </MenuItem>
//       </Menu>
//     </>
//   );
// };

// export default TopNavbar;

