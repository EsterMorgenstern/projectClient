import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Avatar,
  Menu as MuiMenu,
  MenuItem,
  Divider,
  Fade,
  useMediaQuery,
  Switch,
  Badge,
  Tooltip,
  Paper,
  alpha,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ClassIcon from "@mui/icons-material/Class";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentIcon from "@mui/icons-material/Payment";

const drawerWidth = 280;

// Styled components
const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  minHeight: "calc(100vh - 64px - 56px)",
  transition: "all 0.3s ease",
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(90deg, #1a237e 0%, #283593 100%)'
    : 'linear-gradient(90deg, #1a237e 0%, #3949ab 100%)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  margin: theme.spacing(0, 0.5),
  color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
  fontWeight: active ? 700 : 500,
  position: "relative",
  borderRadius: "8px",
  padding: theme.spacing(0.8, 1.5),
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
  },
  "&::after": active
    ? {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "3px",
        backgroundColor: '#ffffff',
        borderRadius: "3px 3px 0 0",
      }
    : {},
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#3949ab' : '#c5cae9',
  color: theme.palette.mode === 'dark' ? '#ffffff' : '#1a237e',
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

// סגנון חדש לפריטי התפריט עם אנימציות ואפקטים
const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.8, 1),
  borderRadius: "12px",
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : "transparent",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.main, 0.08),
    transform: "translateY(-2px)",
    boxShadow: active ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&::before": active ? {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0 4px 4px 0",
  } : {},
}));

// סגנון חדש לאייקונים בתפריט
const StyledListItemIcon = styled(ListItemIcon)(({ theme, active }) => ({
  minWidth: '50px',
  color: active ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.7),
  transition: "all 0.3s ease",
  "& .MuiSvgIcon-root": {
    fontSize: "1.4rem",
    transition: "transform 0.2s ease",
  },
  ".MuiListItem-root:hover &": {
    "& .MuiSvgIcon-root": {
      transform: "scale(1.1)",
    }
  }
}));

// סגנון חדש לטקסט בתפריט
const StyledListItemText = styled(ListItemText)(({ theme, active }) => ({
  "& .MuiTypography-root": {
    fontWeight: active ? 600 : 400,
    fontSize: "0.95rem",
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    transition: "all 0.3s ease",
  },
  ".MuiListItem-root:hover & .MuiTypography-root": {
    color: active ? theme.palette.primary.main : theme.palette.primary.dark,
  }
}));

// כרטיס פרופיל משתמש משופר
const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.primary.dark, 0.2)
    : alpha(theme.palette.primary.light, 0.1),
  backgroundImage: theme.palette.mode === 'dark'
    ? `linear-gradient(to bottom right, ${alpha(theme.palette.primary.dark, 0.05)}, ${alpha(theme.palette.primary.main, 0.2)})`
    : `linear-gradient(to bottom right, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.primary.main, 0.15)})`,
  border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.2)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 6px 25px ${alpha(theme.palette.common.black, 0.08)}`,
    transform: "translateY(-2px)",
  }
}));

// כפתור התנתקות משופר
const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 10,
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.error.dark, 0.15)
    : alpha(theme.palette.error.light, 0.1),
  color: theme.palette.error.main,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.error.dark, 0.25)
      : alpha(theme.palette.error.light, 0.2),
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  }
}));

// מתג מצב לילה משופר
const DarkModeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.light,
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const Menu = () => {
  // מידע על המשתמש - בהמשך יתקבל מהשרת
  const userData = {
    firstName: "שרה",
    lastName: "ישראלי",
    email: "sarah@example.com",
    phone: "050-1234567",
    role: "מנהלת חוגים",
  };
  
  // const navigate = useNavigate();
  const location = useLocation();
  
  // State

  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  
//   const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);
//   const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  // Theme
  const theme = useMemo(
    () =>
      createTheme({
        direction: 'rtl',
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#3f51b5',
            light: '#757de8',
            dark: '#002984',
          },
          secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                backgroundImage: darkMode 
                  ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))'
                  : 'linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0))',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  // Navigation items
  const navItems = [
    { text: "דף הבית", icon: <HomeIcon />, path: "/" },
    { text: "חיפוש תלמידים", icon: <PersonSearchIcon />,path:"/"},
    { text: "הוספת תלמיד", icon: <PersonAddIcon />, path: "/" },
    { text: "ניהול חוגים", icon: <ClassIcon />, path: "/" },
    { text: "לוח שנה", icon: <CalendarMonthIcon />, path: "/" },
    { text: "ניהול נוכחות", icon: <EventAvailableIcon />, path: "/" },
    { text: "תשלומים", icon: <PaymentIcon />, path: "/" },
    { text: "דוחות", icon: <AssessmentIcon />, path: "/" },
    { text: "ניהול צוות", icon: <PeopleIcon />, path: "/" },
    { text: "הגדרות", icon: <SettingsIcon />, path: "/" },
  ];

  // Handlers
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const handleNavigation = (path) => {
    // navigate(path);
    // if (isMobile) {
    //   setDrawerOpen(false);
    // }
  };

  const handleLogout = () => {
    // לוגיקת התנתקות תתווסף בהמשך
    console.log("Logging out...");
    handleMenuClose();
    // navigate("/login");
  };

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Render profile menu
  const renderProfileMenu = (
    <MuiMenu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 220,
          mt: 1,
          p: 1,
          overflow: 'visible',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 1,
            bgcolor: theme.palette.primary.main,
          }}
        >
          {userData.firstName.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {userData.firstName} {userData.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {userData.role}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => { handleMenuClose(); 
        // navigate('/');
         }}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="הפרופיל שלי" />
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose();
        //  navigate('/');
          }}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="הגדרות" />
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="התנתקות" />
      </MenuItem>
    </MuiMenu>
  );

  // Render notifications menu
  const renderNotificationsMenu = (
    <MuiMenu
      anchorEl={notificationsAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          minWidth: 300,
          maxWidth: 360,
          mt: 1,
          overflow: 'visible',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          התראות
        </Typography>
        <Button size="small" color="primary">
          סמן הכל כנקרא
        </Button>
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
        {/* דוגמאות להתראות */}
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              תשלום חדש התקבל
            </Typography>
            <Typography variant="body2" color="text.secondary">
              התקבל תשלום חדש מאת דני כהן עבור חוג ג'ודו
            </Typography>
            <Typography variant="caption" color="primary" sx={{ alignSelf: 'flex-end', mt: 0.5 }}>
              לפני 5 דקות
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              תלמיד חדש נרשם
            </Typography>
            <Typography variant="body2" color="text.secondary">
              רונית לוי נרשמה לחוג ציור
            </Typography>
            <Typography variant="caption" color="primary" sx={{ alignSelf: 'flex-end', mt: 0.5 }}>
              לפני שעתיים
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ py: 1.5, px: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              תזכורת: שיעור מחר
            </Typography>
            <Typography variant="body2" color="text.secondary">
              מחר בשעה 16:00 מתקיים שיעור פסנתר
            </Typography>
            <Typography variant="caption" color="primary" sx={{ alignSelf: 'flex-end', mt: 0.5 }}>
              לפני 5 שעות
            </Typography>
          </Box>
        </MenuItem>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <Button fullWidth color="primary" onClick={() => { handleMenuClose(); navigate('/'); }}>
          צפה בכל ההתראות
        </Button>
      </Box>
    </MuiMenu>
  );

  // Drawer content
  const drawer = (
    <>
      <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            מערכת ניהול חוגים
          </Typography>
        </Box>
        {/* {isMobile && (
          <IconButton onClick={handleDrawerToggle} edge="end">
            <CloseIcon />
          </IconButton>
        )} */}
      </DrawerHeader>
      <Divider />
      
      {/* User profile card */}
      <Box sx={{ px: 2, py: 3 }}>
        <ProfileCard elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {userData.firstName.charAt(0)}
            </Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.role}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary" noWrap>
                {userData.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {userData.phone}
              </Typography>
            </Box>
          </Box>
          
          <LogoutButton
            fullWidth
            variant="text"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            התנתקות
          </LogoutButton>
        </ProfileCard>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 1, py: 2 }}>
        {navItems.map((item) => (
          <StyledListItem
            key={item.text}
            active={isActive(item.path)}
            button
            onClick={() => handleNavigation(item.path)}
            sx={{ mb: 0.5 }}
          >
            <StyledListItemIcon active={isActive(item.path)}>
              {item.icon}
            </StyledListItemIcon>
            <StyledListItemText active={isActive(item.path)} primary={item.text} />
          </StyledListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">מצב לילה</Typography>
          <DarkModeSwitch checked={darkMode} onChange={handleDarkModeToggle} />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          startIcon={<HelpOutlineIcon />}
          onClick={() =>
            alert()
            //  navigate('/')
            }
          sx={{ borderRadius: 2 }}
        >
          עזרה ותמיכה
        </Button>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
        <StyledAppBar position="fixed">
          <StyledToolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => 
                    // navigate('/')
                    alert()}
                >
                  מערכת ניהול חוגים
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {navItems.slice(0, 5).map((item) => (
                <NavButton
                  key={item.text}
                  active={isActive(item.path)}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.text}
                </NavButton>
              ))}
              
              <Button
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleMobileMenuOpen}
                sx={{ ml: 1 }}
              >
                עוד
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="התראות">
                <IconButton color="inherit" onClick={handleNotificationsOpen}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="החלף מצב תצוגה">
                <IconButton color="inherit" onClick={handleDarkModeToggle} sx={{ mx: 1 }}>
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="הפרופיל שלי">
                <IconButton
                  edge="end"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <UserAvatar>
                    {userData.firstName.charAt(0)}
                  </UserAvatar>
                </IconButton>
              </Tooltip>
            </Box>
          </StyledToolbar>
        </StyledAppBar>

        {/* Mobile menu */}
        <MuiMenu
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        //   open={isMobileMenuOpen}
          onClose={handleMenuClose}
        >
          {navItems.slice(5).map((item) => (
            <MenuItem key={item.text} onClick={() => { handleNavigation(item.path); handleMenuClose(); }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
        </MuiMenu>

        {/* Render profile menu */}
        {renderProfileMenu}
        
        {/* Render notifications menu */}
        {renderNotificationsMenu}

        {/* Drawer for navigation */}
        {/* <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer> */}

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <ContentContainer maxWidth="xl">
            <Outlet />
          </ContentContainer>
          
          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.light, 0.1)
                  : alpha(theme.palette.primary.dark, 0.2),
              borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Container maxWidth="xl">
              <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} מערכת ניהול חוגים. כל הזכויות שמורות.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Button size="small" color="primary" sx={{ mr: 1 }}>
                    תנאי שימוש
                  </Button>
                  <Button size="small" color="primary" sx={{ mr: 1 }}>
                    פרטיות
                  </Button>
                  <Button size="small" color="primary">
                    עזרה
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Menu;


