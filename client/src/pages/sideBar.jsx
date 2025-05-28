import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as StudentsIcon,
  School as InstructorsIcon,
  EventNote as CoursesIcon,
  AssignmentInd as AssignIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { FaRegLightbulb } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 200,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 100%)',
        color: 'white',
        padding: 2,
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Varela Round, sans-serif',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        מערכת לניהול חוגים
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon sx={{ color: 'white' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="דף הבית" />
          </ListItemButton>
        </ListItem>

       

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/students">
            <ListItemIcon sx={{ color: 'white' }}>
              <StudentsIcon />
            </ListItemIcon>
            <ListItemText primary="ניהול תלמידים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/instructors">
            <ListItemIcon sx={{ color: 'white' }}>
              <InstructorsIcon />
            </ListItemIcon>
            <ListItemText primary="ניהול מדריכים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses">
            <ListItemIcon sx={{ color: 'white' }}>
              <CoursesIcon />
            </ListItemIcon>
            <ListItemText primary="ניהול חוגים" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/entrollStudent">
            <ListItemIcon sx={{ color: 'white' }}>
              <AssignIcon />
            </ListItemIcon>
            <ListItemText primary="שיבוץ תלמידים לחוגים" />
          </ListItemButton>
        </ListItem>

         <ListItem disablePadding>
          <ListItemButton component={Link} to="/aboutSystem">
            <ListItemIcon sx={{ color: 'white' }}>
                  <FaRegLightbulb />
            </ListItemIcon>
            <ListItemText primary="אודות המערכת" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
