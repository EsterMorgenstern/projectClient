export const styles = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    py: 3,
    direction: 'rtl'
  },
  
  pageContainer: {
    position: 'relative',
    direction: 'rtl'
  },
  
  pageHeader: {
    textAlign: 'center',
    mb: 4,
    py: 4,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '24px',
    color: 'white',
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      pointerEvents: 'none'
    }
  },
  
  pageTitle: {
    fontWeight: 'bold',
    mb: 1,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
  },
  
  pageSubtitle: {
    opacity: 0.9,
    fontWeight: '400',
    fontSize: { xs: '1rem', sm: '1.2rem' }
  },

  // Calendar Root Styles
  calendarRoot: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    direction: 'rtl'
  },

  // Month Header Styles
  monthHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, md: 0 }
  },

  monthHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    flexDirection: { xs: 'column', sm: 'row' }
  },

  monthTitle: {
    fontWeight: 'bold',
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },

  monthSubtitle: {
    fontSize: { xs: '0.9rem', sm: '1rem' },
    opacity: 0.9
  },

  monthAvatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    width: { xs: 60, md: 80 },
    height: { xs: 60, md: 80 },
    fontSize: { xs: '1.5rem', md: '2rem' },
    fontWeight: 'bold',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)'
  },

  // Week Days Header
  weekDaysHeader: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    py: 2,
    direction: 'rtl'
  },

  weekDayCell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    py: 1
  },

  weekDayText: {
    fontWeight: 'bold',
    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
    color: '#4a5568',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  // Days Grid
  daysGrid: {
    display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)', // בדיוק 7 עמודות שוות
  gap: '8px',
  direction: 'rtl',
  width: '100%',
  
  '& > *': {
      minHeight: { xs: '120px', sm: '150px', md: '180px' }, 
    aspectRatio: 'auto',
    width: '100%'
  }
},
  dayCell: {
minHeight: { xs: '120px', sm: '150px', md: '180px' },
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    direction: 'rtl',
    
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      borderColor: '#667eea'
    },

    '&.today': {
      backgroundColor: '#f0f4ff',
      border: '2px solid #667eea',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
    },

    '&.other-month': {
      backgroundColor: '#f8fafc',
      opacity: 0.6,
      '& *': {
        color: '#a0aec0 !important'
      }
    },

    '&.weekend': {
      backgroundColor: '#fef5e7',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #f6ad55, #ed8936)'
      }
    },

    '&.inactive': {
      backgroundColor: '#f7fafc',
      opacity: 0.7,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
        boxShadow: 'none'
      }
    },

    '&.has-events': {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #48bb78, #38a169)'
      }
    },

    '&.has-attendance': {
      '&::before': {
        background: 'linear-gradient(90deg, #10b981, #059669)'
      }
    }
  },

  // Day Header
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
    pb: 1,
    borderBottom: '1px dashed #e2e8f0',
    direction: 'rtl'
  },

  dayNumber: {
    fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.8rem' },
    fontWeight: 'bold',
    color: '#2d3748',
    lineHeight: 1
  },

  hebrewDate: {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    color: '#718096',
    fontWeight: '500',
    mt: 0.5,
    direction: 'rtl'
  },

  dayOfWeek: {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    color: '#a0aec0',
    fontWeight: '500',
    textAlign: 'center'
  },

  // Groups Count Container - חדש
  groupsCountContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    direction: 'rtl'
  },

  // Groups Count Badge - חדש
  groupsCountBadge: {
    backgroundColor: '#667eea',
    color: 'white',
    borderRadius: '50%',
    width: { xs: 40, sm: 50, md: 60 },
    height: { xs: 40, sm: 50, md: 60 },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s ease-in-out',
    
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
    }
  },

  // Groups Count Text - חדש
  groupsCountText: {
    fontSize: { xs: '0.75rem', sm: '0.85rem' },
    color: '#4a5568',
    fontWeight: '600',
    textAlign: 'center',
    mt: 0.5
  },

  // Attendance Status Badge - חדש
  attendanceStatusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 5,
    backgroundColor: '#10b981',
    color: 'white',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
  },

  // Empty Day State - חדש
  emptyDayState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
    gap: 1
  },

  emptyDayIcon: {
    fontSize: { xs: '2rem', sm: '2.5rem' },
    color: '#cbd5e0'
  },

  emptyDayText: {
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    color: '#a0aec0',
    textAlign: 'center'
  },

  // Holiday Indicator
  holidayIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 5,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    borderRadius: '50%',
    padding: '4px',
    boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)'
  },

  holidayText: {
    fontSize: { xs: '0.65rem', sm: '0.7rem' },
    color: '#d69e2e',
    textAlign: 'center',
    fontWeight: '600',
    mt: 1,
    px: 1,
    py: 0.5,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: '6px'
  },

  // Calendar Header (Navigation)
  calendarHeader: {
    mb: 3,
    p: 3,
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    direction: 'rtl'
  },

  dateNavigation: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    justifyContent: { xs: 'center', md: 'flex-start' },
    direction: 'rtl'
  },

  dateTitle: {
    fontWeight: 'bold',
    color: '#2d3748',
    minWidth: { xs: '150px', sm: '200px' },
    textAlign: 'center',
    fontSize: { xs: '1.2rem', sm: '1.5rem' }
  },

  todayButton: {
    mr: 1,
    backgroundColor: '#f7fafc',
    '&:hover': {
      backgroundColor: '#edf2f7'
    }
  },

  viewModeSwitcher: {
    display: 'flex',
    justifyContent: 'center',
    mt: { xs: 2, md: 0 }
  },

  tabs: {
    backgroundColor: '#f7fafc',
    borderRadius: '12px',
    minHeight: '48px',
    
    '& .MuiTab-root': {
      minHeight: '48px',
      borderRadius: '12px',
      mx: 0.5,
      fontWeight: '600',
      fontSize: { xs: '0.8rem', sm: '0.9rem' },
      
      '&.Mui-selected': {
        backgroundColor: '#667eea',
        color: 'white',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      }
    },
    
    '& .MuiTabs-indicator': {
      display: 'none'
    }
  },

  searchAndFilter: {
    display: 'flex',
    gap: 2,
    justifyContent: { xs: 'center', md: 'flex-end' },
    mt: { xs: 2, md: 0 },
    direction: 'rtl'
  },

  searchField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f7fafc',
      
      '&:hover': {
        backgroundColor: '#edf2f7'
      },
      
      '&.Mui-focused': {
        backgroundColor: 'white'
      }
    }
  },

  filterButton: {
    borderRadius: '12px',
    px: 3,
    fontWeight: '600',
    backgroundColor: '#f7fafc',
    
    '&:hover': {
      backgroundColor: '#edf2f7'
    }
  },
  // Calendar Paper (המשך)
  calendarPaper: {
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    minHeight: '600px',
    backgroundColor: 'white'
  },

  calendarContainer: {
    width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  direction: 'rtl'
},
  // Loading States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: 3
  },

  loadingText: {
    color: '#4a5568',
    fontWeight: '600',
    fontSize: '1.2rem'
  },

  // Alert Styles
  alert: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    
    '& .MuiAlert-message': {
      fontSize: '1rem',
      fontWeight: '500'
    }
  },

  // Groups Count Variants - חדש
  groupsCountVariants: {
    none: {
      backgroundColor: '#e2e8f0',
      color: '#718096'
    },
    few: {
      backgroundColor: '#48bb78',
      color: 'white'
    },
    many: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    full: {
      backgroundColor: '#f56565',
      color: 'white'
    }
  },

  // Attendance Percentage Colors - חדש
  attendanceColors: {
    excellent: '#10b981', // 90%+
    good: '#48bb78',      // 75-89%
    average: '#f59e0b',   // 60-74%
    poor: '#ef4444',      // <60%
    none: '#9ca3af'       // לא נרשמה נוכחות
  },

  // Day Status Indicators - חדש
  dayStatusIndicators: {
    active: {
      borderLeft: '4px solid #10b981'
    },
    inactive: {
      borderLeft: '4px solid #e2e8f0'
    },
    holiday: {
      borderLeft: '4px solid #f59e0b'
    },
    weekend: {
      borderLeft: '4px solid #8b5cf6'
    }
  },

  // Responsive Design
  '@media (max-width: 600px)': {
    dayCell: {
      minHeight: '90px',
      padding: '8px'
    },
    
    groupsCountBadge: {
      width: '35px',
      height: '35px',
      fontSize: '1rem'
    },
    
    dayNumber: {
      fontSize: '1.1rem'
    },
    
    hebrewDate: {
      fontSize: '0.65rem'
    },
    
    monthTitle: {
      fontSize: '1.3rem'
    },

    groupsCountText: {
      fontSize: '0.7rem'
    }
  },

  '@media (max-width: 400px)': {
    dayCell: {
      minHeight: '80px',
      padding: '6px'
    },
    
    groupsCountBadge: {
      width: '30px',
      height: '30px',
      fontSize: '0.9rem'
    },
    
    dayNumber: {
      fontSize: '1rem'
    }
  },

  // Animation Classes
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out'
  },

  slideIn: {
    animation: 'slideInRight 0.3s ease-out'
  },

  bounceIn: {
    animation: 'bounceIn 0.6s ease-out'
  },

  // Custom Scrollbar
  customScrollbar: {
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f5f9',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5e0',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: '#a0aec0'
      }
    }
  },

  // Gradient Backgrounds
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    pink: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    teal: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  },

  // Shadow Variants
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    colored: {
      primary: '0 10px 25px rgba(102, 126, 234, 0.3)',
      success: '0 10px 25px rgba(16, 185, 129, 0.3)',
      warning: '0 10px 25px rgba(245, 158, 11, 0.3)',
      error: '0 10px 25px rgba(239, 68, 68, 0.3)'
    }
  },

  // Transitions
  transitions: {
    fast: 'all 0.15s ease-out',
    base: 'all 0.2s ease-out',
    slow: 'all 0.3s ease-out',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // Hover Effects
  hoverEffects: {
    lift: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    },
    scale: {
      transform: 'scale(1.05)'
    },
    glow: {
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)'
    }
  },

  // Keyframes for animations
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 }
  },

  '@keyframes slideInRight': {
    '0%': { 
      transform: 'translateX(100%)',
      opacity: 0 
    },
    '100%': { 
      transform: 'translateX(0)',
      opacity: 1 
    }
  },

  '@keyframes bounceIn': {
    '0%': {
      transform: 'scale(0.3)',
      opacity: 0
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.8
    },
    '70%': {
      transform: 'scale(0.9)',
      opacity: 0.9
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1
    }
  },

  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  },

  // Dark Mode Support
  darkMode: {
    backgroundColor: '#1a202c',
    color: '#e2e8f0',
    
    dayCell: {
      backgroundColor: '#2d3748',
      borderColor: '#4a5568',
      color: '#e2e8f0'
    },
    
    weekDaysHeader: {
      backgroundColor: '#2d3748',
      borderColor: '#4a5568'
    },
    
    groupsCountBadge: {
      backgroundColor: '#4a5568',
      color: '#e2e8f0'
    }
  },

  // Print Styles
  '@media print': {
    root: {
      backgroundColor: 'white !important'
    },
    
    dayCell: {
      boxShadow: 'none !important',
      border: '1px solid #000 !important'
    },
    
    groupsCountBadge: {
      backgroundColor: '#f0f0f0 !important',
      color: '#000 !important'
    }
  }
};

// Export utility functions
export const getGroupsCountColor = (count) => {
  if (count === 0) return '#e2e8f0';
  if (count <= 2) return '#48bb78';
  if (count <= 5) return '#667eea';
  return '#f56565';
};

export const getGroupsCountTextColor = (count) => {
  if (count === 0) return '#718096';
  return 'white';
};

export const getAttendanceColor = (percentage) => {
  if (percentage >= 90) return '#10b981';
  if (percentage >= 75) return '#48bb78';
  if (percentage >= 60) return '#f59e0b';
  return '#ef4444';
};

export const formatGroupsCountText = (count) => {
  if (count === 0) return 'אין חוגים';
  if (count === 1) return 'חוג אחד';
  if (count === 2) return 'שני חוגים';
  return `${count} חוגים`;
};
