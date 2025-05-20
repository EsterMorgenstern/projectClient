
export const styles = {
  // Common dialog styles
  dialog: {
    direction: 'rtl',
  },
   dialogPaper: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    maxHeight: '90vh',
  }),
  dialogTitle: (theme) => ({
    padding: theme.spacing(2),
  }),
  dialogTitleContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogTitleText: {
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'inherit',
  },
  dialogContent: (theme) => ({
    padding: theme.spacing(3),
  }),
  dialogActions: (theme) => ({
    padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)}`,
  }),
  cancelButton: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  }),
  
  // Course selection dialog styles
  backButton: (theme) => ({
    marginTop: theme.spacing(1),
    textAlign: 'right',
  }),
  backButtonIcon: {
    transform: 'rotate(180deg)',
  },
  selectionGrid: (theme) => ({
    marginTop: theme.spacing(2),
  }),
  courseCard: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    },
  }),
  courseCardContent: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
  }),
  courseAvatar: (theme) => ({
    width: 60,
    height: 60,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
  }),
  courseName: (theme) => ({
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  }),
  courseDescription: {
    textAlign: 'center',
    color: 'text.secondary',
  },
  branchesList: {
    padding: 0,
  },
  branchItem:(theme) => ({
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
  }),
  branchListItem:(theme) => ({ 
    padding: theme.spacing(2),
  }),
  branchIcon: {
    minWidth: 40,
  },
  branchText: {
    '& .MuiListItemText-primary': {
      fontWeight: 'bold',
    },
  },
  nextIcon: {
    transform: 'rotate(180deg)',
  },
  groupsList: {
    padding: 0,
  },
  groupItem: (theme) => ({
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
  }),
  groupListItem:(theme) => ({
    padding: theme.spacing(2),
  }),
  groupIcon: {
    minWidth: 40,
  },
  groupText: {
    '& .MuiListItemText-primary': {
      fontWeight: 'bold',
    },
  },
  groupDetails: (theme) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  }),
  groupDetail: {
    display: 'flex',
    alignItems: 'center',
  },
  detailIcon: (theme) => ({
    fontSize: '0.8rem',
    marginRight: theme.spacing(0.5),
    color: 'text.secondary',
  }),
  noGroupsContainer: (theme) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
  }),
  noGroupsText: {
    color: 'text.secondary',
  },
  
  // Attendance dialog styles
  attendanceDialogTitle:(theme) => ({
    backgroundColor: '#6366F1',
    color: 'white',
    padding: theme.spacing(2),
  }),
  dialogSubtitle: (theme) => ({
    marginTop: theme.spacing(0.5),
    opacity: 0.9,
  }),
  courseInfoPaper:(theme) => ({
    padding: theme.spacing(3),
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(3),
  }),
  courseInfoItem: {
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon:(theme) => ({
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }),
  infoLabel: {
    '& strong': {
      fontWeight: 'bold',
    },
  },
  attendanceHeader:(theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  }),
  studentsListTitle: {
    fontWeight: 'bold',
    color: '#1E3A8A',
    display: 'flex',
    alignItems: 'center',
  },
  titleIcon:(theme) => ({
    marginRight: theme.spacing(1),
  }),
  attendanceActions:(theme) => ({
    display: 'flex',
    gap: theme.spacing(1),
  }),
  markAllButton: (theme) => ({
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.8rem',
  }),
  studentsListPaper:(theme) => ({
    border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: theme.shape.borderRadius * 2,
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
  }),
  studentsList: {
    padding: 0,
  },
  studentListItem:(theme) => ({
    padding: theme.spacing(1, 2),
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
  }),
  studentAvatar:(theme) => ({
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  }),
  avatar: {
    width: 40,
    height: 40,
  },
  presentAvatar: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10B981',
  },
  absentAvatar: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#EF4444',
  },
  studentText: {
    margin: 0,
  },
  studentDetails:(theme) => ({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  }),
  studentAge: {
    fontSize: '0.875rem',
  },
  detailDivider:(theme) => ({
    margin: theme.spacing(0, 1),
    height: 14,
  }),
  attendanceRateChip: {
    height: 20,
    fontSize: '0.65rem',
  },
  attendanceCheckbox:(theme) => ({
    padding: theme.spacing(1),
  }),
  noteSection:(theme) => ({
    marginBottom: theme.spacing(3),
  }),
  noteSectionTitle: (theme) => ({
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
  }),
  noteTextField: (theme) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius * 2,
    },
  }),
  attendanceStats:(theme) => ({
    position: 'relative',
    padding: theme.spacing(1, 0),
  }),
  statsText: (theme) => ({
    marginBottom: theme.spacing(1),
  }),
  progressBar: {
    height: 8,
    borderRadius: 4,
    transition: 'width 0.5s ease',
  },
  highAttendance: {
    backgroundColor: '#10B981',
  },
  mediumAttendance: {
    backgroundColor: '#F59E0B',
  },
  lowAttendance: {
    backgroundColor: '#EF4444',
  },
  saveButton: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 4),
    backgroundColor: '#6366F1',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
    '&:hover': {
      backgroundColor: '#4F46E5',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
    },
    transition: 'all 0.3s ease',
  }),
}
