import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 240,
        background: 'rgba(59, 131, 246, 0.83)',
        color: 'white',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, fontFamily: 'Roboto, sans-serif' }}>
        מערכת לניהול חוגים 
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="דף הבית" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/students">
            <ListItemText primary="ניהול תלמידים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/instructors">
            <ListItemText primary="ניהול מדריכים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/courses">
            <ListItemText primary="ניהול חוגים" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/assignments">
            <ListItemText primary="שיבוץ תלמידים לחוגים" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
