
export const styles = {
  // Common styles
  calendarRoot: {
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  
  // Monthly calendar styles
  weekDaysHeader: (theme) => ({
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    padding: theme.spacing(1.5, 0),
  }),
  weekDayCell: (theme) => ({
    padding: theme.spacing(1),
  }),
  weekDayText: {
    fontSize: '0.95rem',
    textAlign: 'center',
  },
  sabbathDay: {
    color: '#E11D48',
  },
  daysGrid: {
    width: '100%',
    gap: '8px',
  },
  dayCell: (theme) => ({
    padding: theme.spacing(1.5, 1, 2, 1),
    height: {
      xs: 120,
      sm: 140,
      md: 160,
    },
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    margin: '4px',
    transition: 'all 0.3s ease',
  }),
  dayHeader: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5, 0),
  }),
  dayNumber: {
    fontSize: '1.2rem',
  },
  hebrewDate: (theme) => ({
    fontSize: '0.7rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6rem',
    },
    lineHeight: 1,
    marginTop: '2px',
  }),
  dayOfWeek: (theme) => ({
    fontSize: '0.75rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
    },
    fontWeight: 500,
  }),
  eventsContainer: (theme) => ({
    marginTop: theme.spacing(1),
    maxHeight: {
      xs: 70,
      sm: 80,
      md: 90,
    },
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  }),
  eventChip: (theme) => ({
    height: 'auto',
    padding: theme.spacing(0.3, 0),
    fontSize: {
      xs: '0.65rem',
      sm: '0.75rem',
    },
    '& .MuiChip-label': {
      padding: theme.spacing(0, 1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    '& .MuiChip-icon': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(-0.5),
    },
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateX(-2px)',
    },
  }),
  moreEventsText: (theme) => ({
    marginTop: theme.spacing(0.5),
    textAlign: 'center',
    fontSize: '0.7rem',
    fontWeight: 500,
    borderRadius: '4px',
    padding: '2px 4px',
  }),
  attendanceBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 2,
  },
  percentageBadge: {
    '& .MuiBadge-badge': {
      fontSize: '0.65rem',
      height: '18px',
      minWidth: '18px',
      padding: '0 4px',
      fontWeight: 'bold',
    },
  },
  
  
  weeklyCalendarRoot: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    padding: '16px',
  },
  tableContainer: (theme) => ({
    boxShadow: 'none',
    border: '1px solid #E2E8F0',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
  }),
  timeHeaderCell: {
    width: '80px',
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #E2E8F0',
    fontWeight: 'bold',
  },
  dayHeaderCell: {
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #E2E8F0',
    borderLeft: '1px solid #E2E8F0',
    fontWeight: 'bold',
    minWidth: '150px',
  },
  todayHeaderCell: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  dayHeaderContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dayName: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
  dayDate: {
    color: 'text.secondary',
  },
  hebrewDateSmall: {
    color: 'text.secondary',
    fontSize: '0.7rem',
  },
  evenRow: {
    backgroundColor: 'rgba(241, 245, 249, 0.3)',
  },
  timeCell: {
    width: '80px',
    borderRight: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    fontWeight: 'bold',
    color: '#64748B',
  },
  eventCell: (theme) => ({
    position: 'relative',
    height: '100px',
    padding: theme.spacing(1),
    borderLeft: '1px solid #E2E8F0',
    cursor: 'default',
  }),
  todayCell: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  weeklyEventsContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  }),
  weeklyEventCard: (theme) => ({
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  }),
  attendanceRecordedCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    border: '1px solid rgba(16, 185, 129, 0.5)',
  },
  eventTitle: {
    fontWeight: 'bold',
    color: '#4338CA',
    fontSize: '0.875rem',
  },
  eventDetails: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(0.5),
    gap: theme.spacing(1),
  }),
  eventDetail: {
    display: 'flex',
    alignItems: 'center',
  },
  eventIcon: (theme) => ({
    fontSize: '0.8rem',
    marginRight: theme.spacing(0.5),
    color: 'text.secondary',
  }),
  attendanceChip: (theme) => ({
    height: 20,
    marginTop: theme.spacing(0.5),
    fontSize: '0.65rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#065F46',
  }),
  
  // Daily calendar styles
  dailyCalendarRoot: {
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    padding: '16px',
  },
  dayViewHeader: (theme) => ({
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    display: 'flex',
    flexDirection: {
      xs: 'column',
      sm: 'row'
    },
    alignItems: {
      xs: 'start',
      sm: 'center'
    },
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  }),
  todayHeader: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
  },
  dayViewTitle: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  dayViewHebrewDate: {
    color: 'text.secondary',
  },
  eventsCountChip: {
    fontWeight: 'bold',
  },
  dailyTableContainer: (theme) => ({
    boxShadow: 'none',
    border: '1px solid #E2E8F0',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
  }),
  eventsHeaderCell: {
    backgroundColor: '#F8FAFC',
    borderBottom: '2px solid #E2E8F0',
    fontWeight: 'bold',
  },
    timeSlotRow: {
    height: 'auto',
  },
  dailyEventsCell: (theme) => ({
    padding: theme.spacing(2),
  }),
  dailyEventCard: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    backgroundColor: 'white',
    border: '1px solid rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      transform: 'translateY(-2px)'
    }
  }),
  dailyEventCardContent: (theme) => ({
    padding: theme.spacing(2),
  }),
  dailyEventHeader: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  }),
  dailyEventTitle: {
    fontWeight: 'bold',
  },
  eventDivider: (theme) => ({
    margin: theme.spacing(1, 0),
  }),
  eventDetailsList: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
  eventDetailItem: {
    display: 'flex',
    alignItems: 'center',
  },
  eventDetailIcon: (theme) => ({
    color: '#6366F1',
    marginRight: theme.spacing(1),
  }),
  attendanceInfo: (theme) => ({
    marginTop: theme.spacing(1),
  }),
  attendanceText: {
    color: 'text.secondary',
  },
  noEventsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
  },
  noEventsText: {
    color: 'text.secondary',
  },
  noEventsForDayContainer: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    textAlign: 'center',
  }),
  noEventsIcon: (theme) => ({
    fontSize: 60,
    color: '#94a3b8',
    marginBottom: theme.spacing(2),
  }),
  noEventsTitle: {
    color: 'text.secondary',
  },
  noEventsSubtitle: (theme) => ({
    color: 'text.secondary',
    marginTop: theme.spacing(1),
  }),
  attendanceIndicator: (theme) => ({
        position: 'absolute',
        bottom: theme.spacing(0.5),
        right: theme.spacing(0.5),
    }),
    
    attendanceChip: {
        height: 18,
        fontSize: '0.6rem',
        '& .MuiChip-label': {
            padding: '0 4px',
        },
    },
    
    studentItem: (theme) => ({
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }),
    
    studentAvatar: (theme) => ({
        backgroundColor: theme.palette.primary.main,
        width: 40,
        height: 40,
    }),
    
    attendanceControls: (theme) => ({
        display: 'flex',
        gap: theme.spacing(1),
    }),
    
    attendanceButton: (theme) => ({
        minWidth: 80,
        borderRadius: theme.shape.borderRadius * 2,
    }),
    
    emptyState: (theme) => ({
        textAlign: 'center',
        padding: theme.spacing(4),
    }),

}