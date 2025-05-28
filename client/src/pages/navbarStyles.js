export const navbarStyles = {
  appBar: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  
  toolbar: {
    minHeight: '70px',
    padding: '0 24px',
    justifyContent: 'space-between'
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.3s ease'
    }
  },
  
  logoAvatar: {
    bgcolor: 'rgba(255,255,255,0.2)',
    width: 45,
    height: 45,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  
  logoText: {
    fontWeight: 'bold',
    lineHeight: 1,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  
  logoSubtext: {
    opacity: 0.8,
    lineHeight: 1,
    fontSize: '0.75rem'
  },
  
  desktopMenu: {
    display: 'flex',
    gap: 1,
    alignItems: 'center'
  },
  
  menuButton: {
    borderRadius: 2,
    px: 2,
    py: 1,
    minWidth: 'auto',
    textTransform: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    transition: 'all 0.3s ease'
  },
  
  activeMenuButton: {
    bgcolor: 'rgba(255,255,255,0.2)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  
  userActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  
  actionButton: {
    color: 'white',
    '&:hover': {
      bgcolor: 'rgba(255,255,255,0.1)',
      transform: 'scale(1.1)'
    },
    transition: 'all 0.3s ease'
  },
  
  userAvatar: {
    width: 36,
    height: 36,
    bgcolor: 'rgba(255,255,255,0.2)',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    },
    transition: 'all 0.3s ease'
  },
  
  drawer: {
    width: 280,
    height: '100%',
    bgcolor: 'background.paper'
  },
  
  drawerHeader: {
    p: 3,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  
  drawerHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },
  
  drawerAvatar: {
    bgcolor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50
  },
  
  drawerList: {
    px: 1,
    py: 2
  },
  
  drawerItem: {
    mb: 1,
    borderRadius: 2,
    mx: 1,
    '&:hover': {
      transform: 'translateX(8px)',
    },
    transition: 'all 0.3s ease'
  },
  
  activeDrawerItem: {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark'
    }
  },
  
  drawerItemIcon: {
    minWidth: 40
  },
  
  drawerActions: {
    p: 2,
    borderTop: '1px solid',
    borderColor: 'divider'
  },
  
  notificationMenu: {
    width: 350,
    maxHeight: 450
  },
  
  notificationHeader: {
    p: 2,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'primary.main',
    color: 'white'
  },
  
  notificationItem: {
    py: 1.5,
    px: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      bgcolor: 'action.hover'
    }
  },
  
  profileMenu: {
    minWidth: 200
  },
  
  profileHeader: {
    p: 2,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'grey.50'
  }
};