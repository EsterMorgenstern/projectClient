// import { makeStyles } from '@mui/styles';


// export const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//   },
//   pageContainer: {
//     padding: theme.spacing(3, 4),
//     background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
//     minHeight: '100vh',
//     borderRadius: theme.shape.borderRadius * 2,
//   },
//   pageHeader: {
//     marginBottom: theme.spacing(4),
//     textAlign: 'center',
//   },
//   pageTitle: {
//     fontWeight: 'bold',
//     color: '#1E3A8A',
//     marginBottom: theme.spacing(1),
//     fontFamily: 'Heebo, sans-serif',
//   },
//   pageSubtitle: {
//     color: '#334155',
//     fontSize: '1.25rem',
//     [theme.breakpoints.down('sm')]: {
//       fontSize: '1rem',
//     },
//   },
//   calendarHeader: {
//     marginBottom: theme.spacing(3),
//   },
//   dateNavigation: {
//     display: 'flex',
//     alignItems: 'center',
//     [theme.breakpoints.down('sm')]: {
//       justifyContent: 'center',
//       marginBottom: theme.spacing(2),
//     },
//   },
//   dateTitle: {
//     fontWeight: 'bold',
//     color: '#1E3A8A',
//     margin: theme.spacing(0, 2),
//   },
//   todayButton: {
//     marginLeft: theme.spacing(1),
//     backgroundColor: 'rgba(59, 130, 246, 0.1)',
//     '&:hover': {
//       backgroundColor: 'rgba(59, 130, 246, 0.2)',
//     },
//   },
//   viewModeSwitcher: {
//     display: 'flex',
//     justifyContent: 'center',
//     [theme.breakpoints.down('sm')]: {
//       marginBottom: theme.spacing(2),
//     },
//   },
//   tabs: {
//     '& .MuiTab-root': {
//       minWidth: 'auto',
//       padding: theme.spacing(1, 2),
//       [theme.breakpoints.down('sm')]: {
//         padding: theme.spacing(1),
//       },
//     },
//   },
//   searchAndFilter: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//     gap: theme.spacing(2),
//     [theme.breakpoints.down('sm')]: {
//       justifyContent: 'center',
//     },
//   },
//   searchField: {
//     flexGrow: 1,
//     maxWidth: 300,
//     '& .MuiOutlinedInput-root': {
//       borderRadius: theme.shape.borderRadius * 2,
//     },
//     [theme.breakpoints.down('sm')]: {
//       maxWidth: '100%',
//     },
//   },
//   filterButton: {
//     borderRadius: theme.shape.borderRadius * 2,
//     borderWidth: 2,
//     '&:hover': {
//       borderWidth: 2,
//     },
//   },
//   calendarPaper: {
//     padding: theme.spacing(3),
//     borderRadius: theme.shape.borderRadius * 3,
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
//     overflow: 'hidden',
//     border: '1px solid rgba(0, 0, 0, 0.05)',
//   },
//   calendarContainer: {
//     width: '100%',
//   },
//   loadingContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '50vh',
//   },
//   loadingText: {
//     marginTop: theme.spacing(2),
//     color: theme.palette.text.secondary,
//   },
//   alert: {
//     width: '100%',
//     borderRadius: theme.shape.borderRadius * 2,
//     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
//     '& .MuiAlert-icon': {
//       fontSize: '1.5rem',
//     },
//   },
// }));
// מחליף את makeStyles באובייקטים של סגנונות

export const styles = {
  root: {
    width: '100%',
  },
  pageContainer: (theme) => ({
    padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
    background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
    minHeight: '100vh',
    borderRadius: theme.shape.borderRadius * 2,
  }),
  pageHeader: (theme) => ({
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  }),
  pageTitle: (theme) => ({
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: theme.spacing(1),
    fontFamily: 'Heebo, sans-serif',
    direction:'rtl',
 }),
  pageSubtitle: (theme) => ({
    color: '#334155',
    fontSize: '1.25rem',
        direction:'rtl',

    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  }),
  calendarHeader: (theme) => ({
    marginBottom: theme.spacing(3),
        direction:'rtl',

  }),
  dateNavigation: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      marginBottom: theme.spacing(2),
    },
  }),
  dateTitle: (theme) => ({
    fontWeight: 'bold',
    color: '#1E3A8A',
    margin: theme.spacing(0, 2),
    
  }),
  todayButton: (theme) => ({
    marginLeft: theme.spacing(1),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    },
  }),
  viewModeSwitcher: (theme) => ({
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  }),
  tabs: (theme) => ({
    '& .MuiTab-root': {
      minWidth: 'auto',
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
  }),
  searchAndFilter: (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  }),
  searchField: (theme) => ({
    flexGrow: 1,
    maxWidth: 300,
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius * 2,
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  }),
  filterButton: (theme) => ({
    borderRadius: theme.shape.borderRadius * 2,
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  }),
  calendarPaper: (theme) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  }),
  calendarContainer: {
    width: '100%',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  },
  loadingText: (theme) => ({
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  }),
  alert: (theme) => ({
    width: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    '& .MuiAlert-icon': {
      fontSize: '1.5rem',
    },
  }),
};
