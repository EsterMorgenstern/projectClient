
export const styles = {
  // Common styles
  calendarRoot: {
    width: '100%',
  },
  
  // Monthly calendar styles
  weekDaysHeader:(theme) => ({
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  }),
  weekDayCell: (theme) => ({
    padding: theme.spacing(1),
  }),
  weekDayText: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
  sabbathDay: {
    color: '#E11D48',
  },
  daysGrid: {
    width: '100%',
  },
  dayCell:(theme) => ({
    padding: theme.spacing(1, 1, 2, 1),
    height: {
      xs: 100,
      sm: 120,
      md: 140,
    },
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'white',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      backgroundColor: 'rgba(241, 245, 249, 0.5)',
    },
  }),
  outsideMonthDay: {
    opacity: 0.6,
    backgroundColor: 'rgba(241, 245, 249, 0.7)',
  },
  todayCell: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    border: '2px solid #3B82F6',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
  },
  hasAttendanceCell: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '2px solid rgba(16, 185, 129, 0.5)',
    '&:hover': {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
  },
  dayHeader: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  }),
  dayNumber: {
    color: 'text.primary',
  },
  todayNumber: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  hasAttendanceNumber: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  hebrewDate:(theme) => ({
    color: 'text.secondary',
    fontSize: '0.75rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.65rem',
    },
  }),
  eventsContainer: (theme) => ({
    marginTop: theme.spacing(1),
    maxHeight: {
      xs: 60,
      sm: 70,
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
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#4338CA',
    '& .MuiChip-label': {
      padding: theme.spacing(0, 1),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
  attendanceRecorded: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#065F46',
    fontWeight: 'bold',
  },
  moreEventsText:(theme) => ({
    marginTop: theme.spacing(0.5),
    textAlign: 'center',
    color: 'text.secondary',
  }),
  
  // Weekly calendar styles
  weeklyCalendarRoot: {
    width: '100%',
    overflowX: 'auto',
  },
  tableContainer: (theme) => ({
    boxShadow: 'none',
    border: '1px solid #E2E8F0',
    borderRadius: theme.shape.borderRadius * 2,
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
  weeklyEventsContainer:(theme) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  }),
  weeklyEventCard: (theme) => ({
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    border: '1px solid rgba(99, 102, 241, 0.5)',
       weeklyEventCard: {
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
  }}),
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
  dailyEventCardContent:(theme) => ({
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
  noEventsForDayContainer:(theme) => ({
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
}

