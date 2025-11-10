import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Tooltip, Divider, MenuItem, ListItemIcon, ListItemText, FormControlLabel, Checkbox, InputAdornment, Select, FormControl, InputLabel, CircularProgress, TablePagination, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { AddCircle, Person, LocalHospital, CalendarMonth, Healing, AssignmentTurnedIn, Description, Note, Save, Close, Face, LocationCity, Groups, Event, Check as CheckIcon, AttachMoney as AttachMoneyIcon, Info as InfoIcon, FileDownload, Search as SearchIcon, Clear as ClearIcon, ArrowUpward, ArrowDownward, Sort, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import ExcelExportDialog from '../../components/ExcelExportDialog';
import NotesIcon from '@mui/icons-material/Notes';
import StudentNotesDialog from '../Students/components/StudentNotesDialog';
import { fetchStudentHealthFunds } from '../../store/studentHealthFund/fetchStudentHealthFunds';
import { addStudentHealthFund } from '../../store/studentHealthFund/addStudentHealthFund';
import { updateStudentHealthFund } from '../../store/studentHealthFund/updateStudentHealthFund';
import { deleteStudentHealthFund } from '../../store/studentHealthFund/deleteStudentHealthFund';
import { fetchUnreportedDates } from '../../store/studentHealthFund/fetchUnreportedDates';
import { fetchReportedDates } from '../../store/studentHealthFund/fetchReportedDates';
import { reportUnreportedDate } from '../../store/studentHealthFund/reportUnreportedDate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddStudentNoteDialog from '../Students/components/addStudentNoteDialog';
import { getNotesByStudentId } from '../../store/studentNotes/studentNotesGetById';
import { updateStudentNote } from '../../store/studentNotes/studentNoteUpdateThunk';
import { addStudentNote } from '../../store/studentNotes/studentNoteAddThunk';
import { deleteStudentNote } from '../../store/studentNotes/studentNoteDeleteThunk';
import { checkUserPermission } from '../../utils/permissions';
import { fetchHealthFunds } from '../../store/healthFund/fetchHealthFunds';
import { getPaymentNotes, extractStudentIdsByAutomaticBillingNotes } from '../../store/studentNotes/getPaymentNotes';
import { selectPaymentNotes, selectPaymentNotesLoading } from '../../store/studentNotes/studentNoteSlice';
import DraggablePaper, { DragHandle } from '../../components/DraggablePaper';

// Styled table container inspired by instructorsTable and Home

const StudentHealthFundTable = () => {
  // State לחיפוש עם debouncing
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term לביצועים טובים יותר
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsSearching(false);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);
  const [advancedFilters, setAdvancedFilters] = useState({
    healthFundId: '',
    hasReferralFile: 'all', // 'all', 'yes', 'no'
    hasCommitmentFile: 'all', // 'all', 'yes', 'no'
    minTreatments: '',
    maxTreatments: '',
    city: '',
    hasNotes: 'all', // 'all', 'yes', 'no' - הוספת מסנן הערות
    billingNotesFilter: [] // רשימה של סוגי הערות גביה אוטומטיות
  });

  // State למיון
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // State עבור pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog for health fund details
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const handleOpenFundDialog = (row) => {
    const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
    // תמיד צור אובייקט עם נתונים - אם יש נתונים אמיתיים השתמש בהם, אחרת השתמש בברירות מחדל
    const fundToShow = fund ? fund : {
      name: 'לא נמצאו פרטים',
      fundType: '',
      maxTreatmentsPerYear: '',
      pricePerLesson: '',
      monthlyPrice: '',
      requiresReferral: null,
      requiresCommitment: null,
      isActive: null
    };
    setSelectedFund(fundToShow);
    setFundDialogOpen(true);
  };
  const handleCloseFundDialog = () => {
    setFundDialogOpen(false);
    setSelectedFund(null);
  };
  // דיאלוג עדכון
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  // דיאלוג מחיקה
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);

  // דיאלוג צפייה בהערות
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesStudent, setNotesStudent] = useState(null);
  const [studentNotes, setStudentNotes] = useState([]);
  // דיאלוג הוספת הערה
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [addNoteStudent, setAddNoteStudent] = useState(null);
  // דיאלוג תאריכים לא מדווחים
  const [unreportedDatesDialogOpen, setUnreportedDatesDialogOpen] = useState(false);
  const [selectedStudentForDates, setSelectedStudentForDates] = useState(null);
  // State לבחירת תאריכים לדיווח
  const [selectedDatesForReporting, setSelectedDatesForReporting] = useState([]);
  const [reportingInProgress, setReportingInProgress] = useState(false);
  // דיאלוג תאריכים שדווחו
  const [reportedDatesDialogOpen, setReportedDatesDialogOpen] = useState(false);
  const [selectedStudentForReportedDates, setSelectedStudentForReportedDates] = useState(null);
  
  // דיאלוג ייצוא אקסל
  const [excelExportDialogOpen, setExcelExportDialogOpen] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Notification Snackbar close handler
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // TODO: fetch notes from store/api if needed
  const handleOpenNotesDialog = async (studentRow) => {
    // העברת ת.ז. ושם התלמיד מהעמודות
    const notesStudentObj = {
      id: studentRow.studentId || studentRow.id,
      studentId: studentRow.studentId || studentRow.id,
      studentName: studentRow.studentName || '',
      ...studentRow
    };
    setNotesStudent(notesStudentObj);
    // Fetch all notes from store/api
    let notes = [];
    if (notesStudentObj.id) {
      try {
       
        const result = await dispatch(getNotesByStudentId(notesStudentObj.studentId)).unwrap();
        notes = Array.isArray(result) ? result : [];
      } catch (err) {
        notes = Array.isArray(studentRow.notesList) ? studentRow.notesList : [];
      }
    }
    setStudentNotes(notes);
    setNotesDialogOpen(true);
  };
  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setNotesStudent(null);
    setStudentNotes([]);
  };
  // פתיחת דיאלוג הוספת הערה גביה
  const handleAddPaymentNote = (studentObj) => {
    setAddNoteStudent({
      ...studentObj,
      noteType: 'הערת גביה',
    });
    setAddNoteDialogOpen(true);
  };
  const handleCloseAddNoteDialog = () => {
    setAddNoteDialogOpen(false);
    setAddNoteStudent(null);
  };
  const handleAddNote = () => {
    setNotesEditMode(false);
    setNotesEditData(null);
  };
  const handleEditNote = (note) => {
    setNotesEditMode(true);
    setNotesEditData(note);
  };
  const handleSaveNote = async (note) => {
    try {
      if (note.noteId) {
        await dispatch(updateStudentNote(note)).unwrap();
      } else {
        await dispatch(addStudentNote(note)).unwrap();
      }
      // רענון הערות לאחר שמירה
      if (notesStudent?.id) {
        const result = await dispatch(getNotesByStudentId(notesStudent.studentId)).unwrap();
        setStudentNotes(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      // אפשר להציג שגיאה למשתמש
    }
    setAddNoteDialogOpen(false);
  };
  const dispatch = useDispatch();
  const studentHealthFundState = useSelector(state => state.studentHealthFunds || {});
  const healthFunds = Array.isArray(studentHealthFundState.items) ? studentHealthFundState.items : [];
  const loading = studentHealthFundState.loading;
  const error = studentHealthFundState.error;
  // קופות החולים מהסטייט
  const healthFundList = useSelector(state => (state.healthFunds && state.healthFunds.items) ? state.healthFunds.items : []);
  
  // הערות גביה מהסטייט
  const paymentNotes = useSelector(selectPaymentNotes);
  const paymentNotesLoading = useSelector(selectPaymentNotesLoading);

  // יצירת מפה של קופות חולים לביצועים טובים יותר
  const healthFundMap = useMemo(() => {
    const map = new Map();
    healthFundList.forEach(fund => {
      map.set(Number(fund.healthFundId), fund);
    });
    return map;
  }, [healthFundList]);

  // פילטור הנתונים לפי החיפוש והמסננים המתקדמים
  const filteredHealthFunds = useMemo(() => {
    if (!healthFunds.length) return [];
    
    let filtered = [...healthFunds];

    // סינון לפי חיפוש טקסט רגיל - מטוב יותר לביצועים
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      
      filtered = filtered.filter(row => {
        // יצירת מחרוזת חיפוש אחת לכל השדות
        const searchableText = [
          row.studentId,
          row.studentName,
          row.age,
          row.city,
          row.groupName,
          row.treatmentsUsed,
          row.reportedTreatments,
          row.commitmentTreatments,
          row.registeredTreatments,
          row.notes
        ].filter(Boolean).join(' ').toLowerCase();
        
        // חיפוש בקופת חולים - שימוש במפה לביצועים טובים
        const fund = healthFundMap.get(Number(row.healthFundId));
        if (fund) {
          const fundText = [fund.name, fund.fundType].filter(Boolean).join(' ').toLowerCase();
          return searchableText.includes(searchLower) || fundText.includes(searchLower);
        }
        
        return searchableText.includes(searchLower);
        
      // חיפוש במספרי טיפולים
      if (row.treatmentsUsed && String(row.treatmentsUsed).includes(searchLower)) {
        return true;
      }
      if (row.reportedTreatments && String(row.reportedTreatments).includes(searchLower)) {
        return true;
      }
      if (row.commitmentTreatments && String(row.commitmentTreatments).includes(searchLower)) {
        return true;
      }
      if (row.registeredTreatments && String(row.registeredTreatments).includes(searchLower)) {
        return true;
      }        // חיפוש בהערות
        if (row.notes && row.notes.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // חיפוש בתאריכים
        if (row.startDate) {
          const startDateFormatted = new Date(row.startDate).toLocaleDateString('he-IL');
          if (startDateFormatted.includes(searchLower)) {
            return true;
          }
        }
        
        if (row.startDateGroup) {
          const startDateGroupFormatted = new Date(row.startDateGroup).toLocaleDateString('he-IL');
          if (startDateGroupFormatted.includes(searchLower)) {
            return true;
          }
        }
        
        // חיפוש בקבצים (אם קיימים או לא)
        if (searchLower.includes('קיים') || searchLower.includes('אין')) {
          const hasReferral = row.referralFilePath ? 'קיים' : 'אין';
          const hasCommitment = row.commitmentFilePath ? 'קיים' : 'אין';
          if (hasReferral.includes(searchLower) || hasCommitment.includes(searchLower)) {
            return true;
          }
        }
        
        return false;
      });
    }

    // סינון לפי מסננים מתקדמים
    if (advancedFilters.healthFundId) {
      filtered = filtered.filter(row => 
        String(row.healthFundId) === String(advancedFilters.healthFundId)
      );
    }

    if (advancedFilters.hasReferralFile !== 'all') {
      filtered = filtered.filter(row => {
        const hasFile = !!row.referralFilePath;
        return advancedFilters.hasReferralFile === 'yes' ? hasFile : !hasFile;
      });
    }

    if (advancedFilters.hasCommitmentFile !== 'all') {
      filtered = filtered.filter(row => {
        const hasFile = !!row.commitmentFilePath;
        return advancedFilters.hasCommitmentFile === 'yes' ? hasFile : !hasFile;
      });
    }

    if (advancedFilters.minTreatments) {
      filtered = filtered.filter(row => 
        Number(row.treatmentsUsed || 0) >= Number(advancedFilters.minTreatments)
      );
    }

    if (advancedFilters.maxTreatments) {
      filtered = filtered.filter(row => 
        Number(row.treatmentsUsed || 0) <= Number(advancedFilters.maxTreatments)
      );
    }

    if (advancedFilters.city) {
      filtered = filtered.filter(row => 
        row.city && row.city.toLowerCase().includes(advancedFilters.city.toLowerCase())
      );
    }

    // סינון לפי הערות
    if (advancedFilters.hasNotes !== 'all') {
      filtered = filtered.filter(row => {
        const hasNotes = row.notes && row.notes.trim().length > 0;
        return advancedFilters.hasNotes === 'yes' ? hasNotes : !hasNotes;
      });
    }

    // סינון לפי הערות גביה אוטומטיות
    if (advancedFilters.billingNotesFilter && advancedFilters.billingNotesFilter.length > 0) {

      
      // וודא שהנתונים זמינים לפני שנקרא לפונקציה
      if (!Array.isArray(paymentNotes)) {
        console.log('🔍 Payment notes not available, ignoring billing filter');
        // אם אין נתונים כלל, נתעלם מהפילטר ונמשיך עם התוצאות הקיימות
      } else if (paymentNotesLoading) {
        console.log('🔍 Payment notes still loading, ignoring billing filter for now');
        // אם הנתונים עדיין נטענים, נתעלם מהפילטר זמנית
      } else {
        const filteredStudentIds = extractStudentIdsByAutomaticBillingNotes(paymentNotes, advancedFilters.billingNotesFilter);
      

      
      if (filteredStudentIds.length > 0) {

        // בדיקת התאמה בין תלמידים עם הערות גביה לתלמידים בטבלת קופות החולים
        const tableStudentIds = filtered.map(row => row.studentId);
        const foundInTable = filteredStudentIds.filter(id => tableStudentIds.includes(id));
        const missingFromTable = filteredStudentIds.filter(id => !tableStudentIds.includes(id));
        
        filtered = filtered.filter(row => {
          // נבדוק התאמה גם כמספר וגם כמחרוزת
          const rowStudentId = row.studentId;
          const match = filteredStudentIds.some(filteredId => 
            filteredId == rowStudentId || // רק השוואה רגילה (לא חדה)
            String(filteredId) === String(rowStudentId)
          );
          
          return match;
        });
        
        // הצגת הודעת מידע למשתמש אם יש תלמידים עם הערות גביה שלא קיימים בטבלת קופות החולים
        if (missingFromTable.length > 0) {
          setSnackbar({
            open: true,
            message: `נמצאו ${filteredStudentIds.length} תלמידים עם הערות גביה, אך רק ${foundInTable.length} מהם רשומים בטבלת קופות החולים`,
            severity: 'info'
          });
        }
        } else {
          // אם לא נמצאו תלמידים עם הערות הגביה הנבחרות, מציגים רשימה ריקה

          filtered = [];
        }
      }
    }

    // מיון התוצאות
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // טיפול מיוחד לתאריכים
        if (sortConfig.key === 'startDate' || sortConfig.key === 'startDateGroup') {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }
        
        // טיפול מיוחד למספרים
        if (['treatmentsUsed', 'reportedTreatments', 'commitmentTreatments', 'registeredTreatments', 'age', 'studentId'].includes(sortConfig.key)) {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        }

        // טיפול מיוחד לקופת חולים - שימוש במפה לביצועים טובים
        if (sortConfig.key === 'healthFundName') {
          const fundA = healthFundMap.get(Number(a.healthFundId));
          const fundB = healthFundMap.get(Number(b.healthFundId));
          aValue = fundA?.name || '';
          bValue = fundB?.name || '';
        }

        // טיפול מיוחד לטקסט
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [healthFunds, debouncedSearchTerm, advancedFilters, healthFundMap, sortConfig, paymentNotes, paymentNotesLoading]);

  // פונקציה לניקוי החיפוש
  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  // פונקציה לניקוי מסננים מתקדמים
  const handleClearAdvancedFilters = () => {
    setAdvancedFilters({
      healthFundId: '',
      hasReferralFile: 'all',
      hasCommitmentFile: 'all',
      minTreatments: '',
      maxTreatments: '',
      city: '',
      hasNotes: 'all', // הוספת איפוס מסנן הערות
      billingNotesFilter: []
    });
    setPage(0);
  };

  // פונקציה לניקוי כל החיפושים
  const handleClearAllFilters = () => {
    setSearchTerm('');
    handleClearAdvancedFilters();
    setPage(0);
  };

  // פונקציה לעדכון מסנן מתקדם
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  // בדיקה אם יש מסננים מתקדמים פעילים
  const hasActiveAdvancedFilters = Object.entries(advancedFilters).some(([key, value]) => {
    if (key === 'billingNotesFilter') {
      return Array.isArray(value) && value.length > 0;
    }
    return value && value !== 'all';
  });

  // פונקציות pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // נתונים מפולטרים לפני pagination
  const allFilteredHealthFunds = filteredHealthFunds;
  
  // נתונים מפולטרים עם pagination
  const paginatedHealthFunds = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allFilteredHealthFunds.slice(startIndex, endIndex);
  }, [allFilteredHealthFunds, page, rowsPerPage]);

  // פונקציה למיון
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // פונקציה ליצירת כותרת עמודה עם מיון
  const getSortableHeader = (key, label, icon) => {
    const isActive = sortConfig.key === key;
    const direction = sortConfig.direction;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          minHeight: '60px',
          gap: 0.5,
          '&:hover': {
            opacity: 0.8
          }
        }}
        onClick={() => handleSort(key)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, minHeight: '24px' }}>
          {icon}
          {isActive && (
            direction === 'asc' ? 
            <ArrowUpward sx={{ fontSize: 16, color: '#43E97B' }} /> : 
            <ArrowDownward sx={{ fontSize: 16, color: '#43E97B' }} />
          )}
          {!isActive && <Sort sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />}
        </Box>
        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: 1.2 }}>
          {label}
        </Typography>
      </Box>
    );
  };

  // פונקציה להדגשת טקסט חיפוש
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = String(text).split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ 
          backgroundColor: '#fef3c7', 
          color: '#92400e', 
          fontWeight: 'bold',
          padding: '2px 4px',
          borderRadius: '4px'
        }}>
          {part}
        </span>
      ) : part
    );
  };
  // תאריכים לא מדווחים
  const unreportedDates = useSelector(state => state.studentHealthFunds?.unreportedDates || []);
  const unreportedDatesLoading = useSelector(state => state.studentHealthFunds?.unreportedDatesLoading || false);
  // תאריכים שדווחו
  const reportedDates = useSelector(state => state.studentHealthFunds?.reportedDates || []);
  const reportedDatesLoading = useSelector(state => state.studentHealthFunds?.reportedDatesLoading || false);
  
  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    console.log('🔍 Redux state במלואו:', state);
    
    // נסה כמה מקומות שונים למצוא את המשתמש
    if (state.user && state.user.userDetails) {
      console.log('🔍 נמצא ב-state.user.userDetails:', state.user.userDetails);
      return state.user.userDetails;
    }
    if (state.user && state.user.user) {
      console.log('🔍 נמצא ב-state.user.user:', state.user.user);
      return state.user.user;
    }
    if (state.users && state.users.currentUser) {
      console.log('🔍 נמצא ב-state.users.currentUser:', state.users.currentUser);
      return state.users.currentUser;
    }
    if (state.auth && state.auth.user) {
      console.log('🔍 נמצא ב-state.auth.user:', state.auth.user);
      return state.auth.user;
    }
    if (state.user) {
      console.log('🔍 נמצא ב-state.user:', state.user);
      return state.user;
    }
    
    console.log('⚠️ לא נמצא משתמש נוכחי ב-Redux');
    return null;
  });

  // פונקציה לקבלת פרטי המשתמש
  const getUserDetails = (user) => {
    if (!user) {
      return null; // במקום נתוני דמה, נחזיר null
    }
    
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';
    
    return {
      id: parseInt(user.id || user.userId) || null,
      firstName: firstName,
      lastName: lastName, 
      role: user.role || user.userRole || '',
      name: `${firstName} ${lastName}`.trim() // שם מלא
    };
  };

  // הגדרת פריטי הצ'קליסט
  const checklistItems = [
    {
      key: 'noReferralSent',
      label: '🚫 לא שלחו הפניה',
      description: 'עדיין לא נשלחה הפניה לקופת החולים'
    },
    {
      key: 'noEligibility', 
      label: '❌ אין זכאות לטיפולים',
      description: 'התלמיד אינו זכאי לטיפולים דרך קופת החולים'
    },
    {
      key: 'insufficientTreatments',
      label: '📊 מס\' הטיפולים בהתחייבות לא מספיק',
      description: 'יש לשלוח התחייבות חדשה עם מספר טיפולים נוסף'
    },
    {
      key: 'treatmentsFinished',
      label: '🔚 נגמרו הטיפולים',
      description: 'התלמיד סיים את כל הטיפולים הזמינים לו'
    },
    {
      key: 'authorizationCancelled',
      label: '🚨 הו"ק בוטלה',
      description: 'ההרשאה/אישור מקופת החולים בוטל'
    }
  ];

  // פונקציה לטיפול בשינוי בצ'קליסט
  const handleChecklistChange = (key, checked) => {
    setHealthFundChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  // פונקציה לטיפול בהערות נוספות
  const handleAdditionalNoteChange = (key, value) => {
    setAdditionalNotes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    healthFundId: '',
    startDate: '',
    treatmentsUsed: '0',
    commitmentTreatments: '',
    reportedTreatments: '0',
    registeredTreatments: '',
    referralFilePath: '',
    commitmentFilePath: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  // State לצ'קליסט הערות אוטומטיות
  const [healthFundChecklist, setHealthFundChecklist] = useState({
    noReferralSent: false,
    noEligibility: false,
    insufficientTreatments: false,
    treatmentsFinished: false,
    authorizationCancelled: false
  });
  const [additionalTreatmentsNeeded, setAdditionalTreatmentsNeeded] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState({});

  useEffect(() => {
    // טעינה מקבילה של כל הנתונים לביצועים טובים יותר
    Promise.all([
      dispatch(fetchStudentHealthFunds()),
      dispatch(fetchHealthFunds()),
      dispatch(getPaymentNotes())
    ]).catch(error => {
      console.error('שגיאה בטעינת נתונים:', error);
      setNotification({
        open: true,
        message: 'שגיאה בטעינת נתונים. אנא נסה לרענן את הדף.',
        severity: 'error'
      });
    });
  }, [dispatch]);

  // איפוס עמוד כאשר החיפוש משתנה
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const handleOpenAddDialog = () => {
    // Set current date as default for startDate
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      startDate: today
    }));
    setAddDialogOpen(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      studentId: '',
      healthFundId: '',
      startDate: '',
      treatmentsUsed: '0',
      commitmentTreatments: '',
      reportedTreatments: '0',
      registeredTreatments: '',
      referralFilePath: '',
      commitmentFilePath: '',
      notes: ''
    });
    setHealthFundChecklist({
      noReferralSent: false,
      noEligibility: false,
      insufficientTreatments: false,
      treatmentsFinished: false,
      authorizationCancelled: false
    });
    setAdditionalTreatmentsNeeded('');
    setAdditionalNotes({});
    setSaving(false);
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // אם נבחרה קופת חולים, מלא אוטומטית את השדות הרלוונטיים
    if (field === 'healthFundId' && value) {
      const selectedHealthFund = healthFundList.find(fund => fund.healthFundId === parseInt(value));
      if (selectedHealthFund) {
        console.log('🏥 נבחרה קופת חולים:', selectedHealthFund);
        console.log('📊 מקסימום טיפולים בשנה:', selectedHealthFund.maxTreatmentsPerYear);
        
        // מלא אוטומטית את מס' הטיפולים בהתחייבות ומקסימום טיפולים
        setFormData(prev => ({
          ...prev,
          [field]: value,
          commitmentTreatments: selectedHealthFund.maxTreatmentsPerYear ? String(selectedHealthFund.maxTreatmentsPerYear) : '',
          registeredTreatments: selectedHealthFund.maxTreatmentsPerYear ? String(selectedHealthFund.maxTreatmentsPerYear) : ''
        }));
        return; // יצא מהפונקציה כדי למנוע עדכון כפול
      }
    }
  };
  const handleSave = async () => {
    console.log('🔍 התחלת שמירה...');
    console.log('🔍 נתוני טופס:', formData);
    console.log('🔍 צ\'קליסט גביה:', healthFundChecklist);
    
    setSaving(true);
    
    // בדיקת שדות חובה
    const requiredFields = [];
    
    if (!formData.studentId) {
      requiredFields.push('קוד תלמיד');
    }
    if (!formData.healthFundId) {
      requiredFields.push('קופה');
    }
    if (!formData.startDate) {
      requiredFields.push('תאריך התחלה');
    }
    if (!formData.treatmentsUsed && formData.treatmentsUsed !== 0) {
      requiredFields.push('טיפולים שכבר דווחו');
    }
    if (!formData.commitmentTreatments) {
      requiredFields.push('התחייבות טיפולים');
    }
    
    // אם יש שדות חובה שלא מולאו
    if (requiredFields.length > 0) {
      const message = `לא מילאת את כל שדות החובה:\n${requiredFields.join(', ')}`;
      console.error('❌ שדות חובה חסרים:', requiredFields);
      alert(message);
      setSaving(false);
      return;
    }
    
    try {
      // שמירת נתוני קופת החולים
      console.log('🔍 שולח לשרת נתוני קופת חולים...');
      const result = await dispatch(addStudentHealthFund(formData)).unwrap();
      console.log('✅ נתוני קופת חולים נשמרו בהצלחה:', result);
      
      // בדיקה אוטומטית לקופת חולים מאוחדת
      const selectedHealthFund = healthFundList.find(fund => fund.healthFundId == formData.healthFundId);
      const isUnited = selectedHealthFund?.name?.includes('מאוחדת') || selectedHealthFund?.name?.includes('מאוחד');
      const registeredTreatments = parseInt(formData.registeredTreatments) || 0;
      const commitmentTreatments = parseInt(formData.commitmentTreatments) || 0;
      
      console.log('🔍 בדיקת תנאים ליצירת הערה אוטומטית:');
      console.log('  קופת חולים:', selectedHealthFund?.name);
      console.log('  האם מאוחדת:', isUnited);
      console.log('  טיפולים שנרשם:', registeredTreatments);
      console.log('  טיפולים בהתחייבות:', commitmentTreatments);
      console.log('  האם התחייבות נמוכה:', commitmentTreatments < registeredTreatments);
      
      // יצירת הערה אוטומטית אם הקופה מאוחדת ומספר הטיפולים בהתחייבות נמוך
      if (isUnited && commitmentTreatments < registeredTreatments && commitmentTreatments > 0 && registeredTreatments > 0) {
        console.log('🔍 יוצר הערה אוטומטית - קופה מאוחדת וטיפולים נמוכים');
        try {
          await createAutomaticInsufficientTreatmentsNote(formData.studentId, selectedHealthFund?.name);
          console.log('✅ הערה אוטומטית נוצרה בהצלחה');
          setNotification({
            open: true,
            message: 'הערת גביה אוטומטית נוצרה: מס\' הטיפולים בהתחייבות נמוך ממס\' הטיפולים שנרשם',
            severity: 'success'
          });
        } catch (noteError) {
          console.error('❌ שגיאה ביצירת הערה אוטומטית:', noteError);
          setNotification({
            open: true,
            message: 'שגיאה ביצירת הערה אוטומטית: ' + (noteError.message || noteError),
            severity: 'error'
          });
        }
      } else {
        console.log('ℹ️ לא נוצרה הערה אוטומטית - תנאים לא מתקיימים');
        if (!isUnited) console.log('  סיבה: קופה לא מאוחדת');
        if (commitmentTreatments >= registeredTreatments) console.log('  סיבה: טיפולים בהתחייבות לא נמוכים');
        if (commitmentTreatments <= 0) console.log('  סיבה: לא הוזן מספר טיפולים בהתחייבות');
        if (registeredTreatments <= 0) console.log('  סיבה: לא הוזן מספר טיפולים שנרשם');
      }
      
      // יצירת הערות אוטומטיות בהתאם לצ'קליסט
      console.log('🔍 מתחיל יצירת הערות אוטומטיות...');
      try {
        const noteResult = await createAutomaticHealthFundNotes(formData.studentId);
        if (noteResult) {
          console.log('✅ הערות גביה נוצרו בהצלחה');
        } else {
          console.log('ℹ️ לא נוצרו הערות (לא נבחרו פריטים)');
        }
      } catch (noteError) {
        console.error('❌ שגיאה ביצירת הערות, אבל ממשיכים:', noteError);
        // לא עוצרים את התהליך בגלל שגיאה בהערות
      }
      
      handleCloseAddDialog();
      dispatch(fetchStudentHealthFunds());
      
      console.log('✅ התהליך הושלם בהצלחה');
    } catch (err) {
      console.error('❌ Failed to add student health fund:', err);
      alert('שגיאה בשמירת נתוני קופת החולים: ' + (err.message || err));
    }
    setSaving(false);
  };

  // פונקציה ליצירת הערה אוטומטית כאשר קופה מאוחדת וטיפולים נמוכים
  const createAutomaticInsufficientTreatmentsNote = async (studentId, healthFundName) => {
    const userDetails = getUserDetails(currentUser);
    
    if (!userDetails || !userDetails.id) {
      console.error('❌ לא ניתן ליצור הערה - אין פרטי משתמש');
      throw new Error('לא ניתן ליצור הערה - אין פרטי משתמש נוכחי');
    }
    
    const noteData = {
      studentId: studentId,
      authorId: userDetails.id,
      AuthorName: userDetails.name, // שם מלא של המשתמש
      authorRole: userDetails.role,
      noteContent: 'מס\' הטיפולים בהתחייבות נמוך ממס\' הטיפולים שנרשם',
      noteType: 'הערת גביה',
      priority: 'בינוני',
      isPrivate: false,
      isActive: true
    };

    console.log('🔍 יוצר הערה אוטומטית:', noteData);
    console.log('🔍 פרטי משתמש:', userDetails);
    
    try {
      const result = await dispatch(addStudentNote(noteData)).unwrap();
      console.log('✅ הערה אוטומטית נוצרה בהצלחה:', result);
      return result;
    } catch (error) {
      console.error('❌ שגיאה ביצירת הערה אוטומטית:', error);
      throw error;
    }
  };

  // פונקציה ליצירת הערות אוטומטיות
  const createAutomaticHealthFundNotes = async (studentId) => {
    console.log('🔍 התחלת יצירת הערות גביה אוטומטיות לתלמיד:', studentId);
    console.log('🔍 צ\'קליסט נוכחי:', healthFundChecklist);
    console.log('🔍 משתמש נוכחי:', currentUser);
    
    // בדיקת הרשאות - אבל לא נעצור בגלל זה
    const hasPermission = checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => {
      console.log('⚠️ אזהרת הרשאות:', msg);
    });
    
    if (!hasPermission) {
      console.log('⚠️ אין הרשאות, אבל ממשיכים ליצור הערה');
    }
    
    const userDetails = getUserDetails(currentUser);
    console.log('🔍 פרטי משתמש אחרי getUserDetails:', userDetails);
    console.log('🔍 סוג authorId:', typeof userDetails.id, 'ערך:', userDetails.id);
    
    const selectedHealthFund = healthFundList.find(fund => fund.healthFundId == formData.healthFundId);
    const healthFundName = selectedHealthFund?.name || 'קופת חולים';
    console.log('🔍 קופת חולים נבחרת:', selectedHealthFund);
    
    // בניית תוכן ההערה על בסיס הצ'קליסט
    let noteContent = `קופת החולים : ${healthFundName} \n\n`;
    
    const checkedItems = [];
    
    if (healthFundChecklist.noReferralSent) {
      const item = '🚫 לא שלחו הפניה';
      checkedItems.push(item);
      const additionalNote = additionalNotes.noReferralSent || '';
      noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
    }
    
    if (healthFundChecklist.noEligibility) {
      const item = '❌ אין זכאות לטיפולים';
      checkedItems.push(item);
      const additionalNote = additionalNotes.noEligibility || '';
      noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
    }
    
    if (healthFundChecklist.insufficientTreatments) {
      const item = '📊 מס\' הטיפולים בהתחייבות לא מספיק';
      checkedItems.push(item);
      const treatmentsNote = additionalTreatmentsNeeded ? ` - יש לשלוח התחייבות חדשה עם ${additionalTreatmentsNeeded} טיפולים נוספים` : '';
      const additionalNote = additionalNotes.insufficientTreatments || '';
      noteContent += `${item}${treatmentsNote}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
    }
    
    if (healthFundChecklist.treatmentsFinished) {
      const item = '🔚 נגמרו הטיפולים';
      checkedItems.push(item);
      const additionalNote = additionalNotes.treatmentsFinished || '';
      noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
    }
    
    if (healthFundChecklist.authorizationCancelled) {
      const item = '🚨 הו"ק בוטלה';
      checkedItems.push(item);
      const additionalNote = additionalNotes.authorizationCancelled || '';
      noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
    }
    
    console.log('🔍 פריטים שנבחרו:', checkedItems);
    console.log('🔍 תוכן הערה:', noteContent);
    
    // אם יש פריטים שנבחרו, צור הערה
    if (checkedItems.length > 0) {
     
      
      const currentDate = new Date();
      const noteData = {
        studentId: parseInt(studentId),
        authorId: parseInt(userDetails.id), // וודא שה-ID הוא מספר
        authorName: `${userDetails.firstName} ${userDetails.lastName}`,
        authorRole: userDetails.role,
        noteContent: noteContent,
        dateCreated: currentDate.toISOString(), // תאריך ברור
        createdDate: currentDate.toISOString(), // הוספת שדה נוסף למקרה שהשרת מצפה לזה
        created: currentDate.toISOString(), // עוד שדה נוסף
        date: currentDate.toISOString(), // עוד שדה נוסף
        noteType: 'הערת גביה',
        priority: 'בינוני',
        isPrivate: false,
        isActive: true
      };
      
      console.log('🔍 נתוני הערה לשליחה:', noteData);
      console.log('🔍 validation check:');
      console.log('   - studentId:', typeof noteData.studentId, noteData.studentId);
      console.log('   - authorId:', typeof noteData.authorId, noteData.authorId);
      console.log('   - authorName:', typeof noteData.authorName, `"${noteData.authorName}"`);
      console.log('   - noteContent length:', noteData.noteContent.length);
      console.log('   - dateCreated:', noteData.dateCreated);
      console.log('   - תאריך בעברית:', new Date(noteData.dateCreated).toLocaleDateString('he-IL'));
      console.log('   - שנה:', new Date(noteData.dateCreated).getFullYear());
      
      try {
        console.log('🧪 מנסה לשלוח הערה לשרת...');
        
        // בדיקת validation בסיסית לפני שליחה
        if (!noteData.studentId || isNaN(noteData.studentId)) {
          throw new Error('studentId לא תקין');
        }
        if (!noteData.authorId || isNaN(noteData.authorId)) {
          throw new Error('authorId לא תקין');
        }
        if (!noteData.noteContent || noteData.noteContent.trim().length === 0) {
          throw new Error('תוכן ההערה ריק');
        }
        
        const result = await dispatch(addStudentNote(noteData)).unwrap();
        console.log('✅ הערת גביה אוטומטית נוצרה בהצלחה:', result);
        return result;
      } catch (error) {
        console.error('❌ שגיאה ביצירת הערת גביה אוטומטית:', error);
        console.error('❌ פרטי שגיאה:', error.message, error.stack);
        
        // אם זה validation error, נראה את הפרטים
        if (error.errors) {
          console.error('❌ validation errors:', error.errors);
          Object.keys(error.errors).forEach(field => {
            console.error(`   - ${field}: ${error.errors[field].join(', ')}`);
          });
        }
        
        throw error;
      }
    } else {
      console.log('⚠️ לא נבחרו פריטים בצ\'קליסט, לא נוצרת הערה');
      return null;
    }
  };

  // עדכון
  const handleOpenEditDialog = (row) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
    setEditSaving(false);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
    setEditSaving(false);
  };
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await dispatch(updateStudentHealthFund(editFormData)).unwrap();
      handleCloseEditDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('Failed to update student health fund:', err);
    }
    setEditSaving(false);
  };

  // מחיקה
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
    setDeleteSaving(false);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteSaving(false);
  };
  const handleDeleteConfirm = async () => {
    setDeleteSaving(true);
    try {
      await dispatch(deleteStudentHealthFund(deleteId)).unwrap();
      handleCloseDeleteDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('Failed to delete student health fund:', err);
    }
    setDeleteSaving(false);
  };

  // פונקציות לטיפול בדיאלוג תאריכים לא מדווחים
  const handleOpenUnreportedDatesDialog = async (row) => {
    setSelectedStudentForDates(row);
    setUnreportedDatesDialogOpen(true);
    // קריאה לתאריכים הלא מדווחים
    try {
      const result = await dispatch(fetchUnreportedDates(row.id)).unwrap();
      console.log('🔍 תאריכים שחזרו מהשרת:', result);
      console.log('🔍 סוג הנתונים:', typeof result);
      console.log('🔍 האם זה מערך:', Array.isArray(result));
      if (Array.isArray(result) && result.length > 0) {
        console.log('🔍 פריט ראשון:', result[0]);
        console.log('🔍 מפתחות של פריט ראשון:', Object.keys(result[0]));
      }
    } catch (err) {
      console.error('Failed to fetch unreported dates:', err);
    }
  };
  const handleCloseUnreportedDatesDialog = () => {
    setUnreportedDatesDialogOpen(false);
    setSelectedStudentForDates(null);
    setSelectedDatesForReporting([]);
  };

  // פונקציות לטיפול בבחירת תאריכים לדיווח
  const handleDateSelectionToggle = (date) => {
    const dateString = date.toISOString();
    setSelectedDatesForReporting(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      } else {
        return [...prev, dateString];
      }
    });
  };

  // פונקציה לדיווח תאריכים נבחרים
  const handleReportSelectedDates = async () => {
    if (selectedDatesForReporting.length === 0) {
      alert('יש לבחור לפחות תאריך אחד לדיווח');
      return;
    }

    if (!selectedStudentForDates?.id) {
      alert('שגיאה: לא נמצא מזהה תלמיד');
      return;
    }

    setReportingInProgress(true);
    try {
      // שלח כל תאריך בנפרד
      for (const date of selectedDatesForReporting) {
        await dispatch(reportUnreportedDate({
          studentHealthFundId: selectedStudentForDates.id,
          date: date
        })).unwrap();
      }

      // רענן את הרשימות
      await dispatch(fetchUnreportedDates(selectedStudentForDates.id));
      await dispatch(fetchReportedDates(selectedStudentForDates.id));
      await dispatch(fetchStudentHealthFunds());

      // סגור דיאלוג ונקה בחירות
      handleCloseUnreportedDatesDialog();
      
      alert(`${selectedDatesForReporting.length} תאריכים דווחו בהצלחה!`);
    } catch (error) {
      console.error('שגיאה בדיווח תאריכים:', error);
      alert('שגיאה בדיווח התאריכים. אנא נסה שנית.');
    } finally {
      setReportingInProgress(false);
    }
  };

  // פונקציות לטיפול בדיאלוג תאריכים שדווחו
  const handleOpenReportedDatesDialog = async (row) => {
    setSelectedStudentForReportedDates(row);
    setReportedDatesDialogOpen(true);
    // קריאה לתאריכים שדווחו
    try {
      const result = await dispatch(fetchReportedDates(row.id)).unwrap();
      console.log('🔍 תאריכים שדווחו שחזרו מהשרת:', result);
    } catch (err) {
      console.error('Failed to fetch reported dates:', err);
    }
  };
  const handleCloseReportedDatesDialog = () => {
    setReportedDatesDialogOpen(false);
    setSelectedStudentForReportedDates(null);
  };

  // פונקציות לטיפול בדיאלוג ייצוא אקסל
  const handleOpenExcelExportDialog = () => {
    setExcelExportDialogOpen(true);
  };
  const handleCloseExcelExportDialog = () => {
    setExcelExportDialogOpen(false);
  };

  return (
  <Box sx={{ bgcolor: 'transparent', p: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1d4fbaff', textAlign: 'right', ml: 2 }}>
        ניהול גביה תלמידים
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          color="primary"
          sx={{ 
            borderRadius: '24px', 
            direction: 'ltr', 
            fontWeight: 'bold', 
            px: 4, 
            py: 1.5, 
            fontSize: '1rem', 
            transition: 'all 0.2s',
            borderColor: '#2563EB',
            color: '#2563EB',
            '&:hover': { 
              bgcolor: '#2563EB', 
              color: 'white',
              borderColor: '#2563EB'
            }
          }}
          onClick={handleOpenExcelExportDialog}
        >
          ייצוא
        </Button>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          color="primary"
          sx={{ borderRadius: '24px', direction: 'ltr', fontWeight: 'bold', px: 4, py: 1.5, boxShadow: '0 4px 14px rgba(37,99,235,0.18)', fontSize: '1rem', transition: 'all 0.2s', bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
          onClick={handleOpenAddDialog}
        >
          הוספה
        </Button>
      </Box>
    </Box>

    {/* שדה חיפוש וכפתורים */}
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      mb: 3,
      px: 2
    }}>
      {/* שורת החיפוש עם כפתורים */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        width: '100%',
        flexWrap: 'nowrap'
      }}>
        <TextField
          placeholder="חיפוש בכל העמודות (קוד תלמיד, שם, עיר, קופה, מספרי טיפולים, הערות וכו')"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: 'white',
              direction: 'rtl',
              pr: 3,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 20px rgba(37,99,235,0.25)',
              }
            },
            '& input': {
              textAlign: 'right',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#2563EB', fontSize: 24 }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClearSearch}
                  size="small"
                  sx={{ 
                    color: '#64748B',
                    '&:hover': { 
                      color: '#ef4444',
                      bgcolor: '#fef2f2'
                    }
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button
          variant={showAdvancedSearch ? "contained" : "outlined"}
          color="primary"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          sx={{ 
            borderRadius: '24px',
            fontWeight: 'bold',
            minWidth: '260px',
            px: 3,
            whiteSpace: 'nowrap'
          }}
        >
          {showAdvancedSearch ? '🔍 סגור חיפוש מתקדם' : '🔍 חיפוש מתקדם'}
        </Button>
        
        {(hasActiveAdvancedFilters || searchTerm) && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearAllFilters}
            sx={{ 
              borderRadius: '24px',
              fontWeight: 'bold',
              px: 3,
              whiteSpace: 'nowrap'
            }}
          >
            🗑️ נקה הכל
          </Button>
        )}
      </Box>
      
     
    </Box>

    {/* פאנל חיפוש מתקדם */}
    {showAdvancedSearch && (
      <Box sx={{ 
        bgcolor: 'white',
        borderRadius: '16px',
        p: 3,
        mb: 3,
        boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
        border: '1px solid #e2e8f0',
        width: '100%'
      }}>
        <Typography variant="h6" sx={{ 
          color: '#2563EB', 
          fontWeight: 'bold', 
          mb: 2,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          🔍 חיפוש מתקדם ומסננים
        </Typography>
        
       
        
        <Grid container spacing={2} sx={{ direction: 'rtl' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="קופת חולים"
              fullWidth
              value={advancedFilters.healthFundId}
              onChange={(e) => handleAdvancedFilterChange('healthFundId', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  direction: 'rtl',
                  height: '56px'
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '14px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-6px, -9px) scale(0.75)'
                }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        padding: '8px 16px',
                        lineHeight: '1.3'
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="" sx={{ fontWeight: 'bold', color: '#2563EB' }}>
                כל הקופות
              </MenuItem>
              {healthFundList.map(fund => (
                <MenuItem key={fund.healthFundId} value={fund.healthFundId}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: '500', fontSize: '0.85rem' }}>
                      {fund.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.75rem' }}>
                      ({fund.fundType})
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="עיר"
              fullWidth
              value={advancedFilters.city}
              onChange={(e) => handleAdvancedFilterChange('city', e.target.value)}
              placeholder="הקלד שם עיר..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  direction: 'rtl',
                  height: '56px'
                },
                '& input': {
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              label="הערות"
              fullWidth
              value={advancedFilters.hasNotes}
              onChange={(e) => handleAdvancedFilterChange('hasNotes', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px'
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש הערות</MenuItem>
              <MenuItem value="no">אין הערות</MenuItem>
            </TextField>
          </Grid>

          {/* פילטר הערות גביה אוטומטיות */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>הערות גביה אוטומטיות</InputLabel>
              <Select
                multiple
                value={advancedFilters.billingNotesFilter}
                onChange={(e) => handleAdvancedFilterChange('billingNotesFilter', e.target.value)}
                label="הערות גביה אוטומטיות"
                renderValue={(selected) => 
                  selected.length === 0 ? 'בחר הערות גביה...' : `${selected.length} הערות נבחרו`
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    direction: 'rtl',
                    minHeight: '56px'
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    left: '14px',
                    right: 'auto',
                    transformOrigin: 'top left'
                  },
                  '& .MuiInputLabel-shrink': {
                    transform: 'translate(-6px, -9px) scale(0.75)'
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      '& .MuiMenuItem-root': {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        padding: '8px 16px',
                        lineHeight: '1.3'
                      }
                    }
                  }
                }}
              >
                <MenuItem value="noReferralSent">
                  <Checkbox 
                    checked={advancedFilters.billingNotesFilter.indexOf('noReferralSent') > -1} 
                    size="small"
                  />
                  <ListItemText 
                    primary="🚫 לא שלחו הפניה" 
                    secondary="עדיין לא נשלחה הפניה לקופת החולים"
                  />
                </MenuItem>
                <MenuItem value="noEligibility">
                  <Checkbox 
                    checked={advancedFilters.billingNotesFilter.indexOf('noEligibility') > -1} 
                    size="small"
                  />
                  <ListItemText 
                    primary="❌ אין זכאות לטיפולים" 
                    secondary="התלמיד אינו זכאי לטיפולים דרך קופת החולים"
                  />
                </MenuItem>
                <MenuItem value="insufficientTreatments">
                  <Checkbox 
                    checked={advancedFilters.billingNotesFilter.indexOf('insufficientTreatments') > -1} 
                    size="small"
                  />
                  <ListItemText 
                    primary="📊 מס' הטיפולים בהתחייבות לא מספיק" 
                    secondary="יש לשלוח התחייבות חדשה עם מספר טיפולים נוסף"
                  />
                </MenuItem>
                <MenuItem value="treatmentsFinished">
                  <Checkbox 
                    checked={advancedFilters.billingNotesFilter.indexOf('treatmentsFinished') > -1} 
                    size="small"
                  />
                  <ListItemText 
                    primary="🔚 נגמרו הטיפולים" 
                    secondary="התלמיד סיים את כל הטיפולים הזמינים לו"
                  />
                </MenuItem>
                <MenuItem value="authorizationCancelled">
                  <Checkbox 
                    checked={advancedFilters.billingNotesFilter.indexOf('authorizationCancelled') > -1} 
                    size="small"
                  />
                  <ListItemText 
                    primary="🚨 הו״ק בוטלה" 
                    secondary="ההרשאה/אישור מקופת החולים בוטל"
                  />
                </MenuItem>
              </Select>
            </FormControl>
            {paymentNotesLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  טוען הערות גביה...
                </Typography>
              </Box>
            )}
            {advancedFilters.billingNotesFilter && advancedFilters.billingNotesFilter.length > 0 && paymentNotesLoading && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                ⏳ הפילטר יופעל לאחר טעינת הערות הגביה...
              </Typography>
            )}
            {!paymentNotesLoading && paymentNotes && paymentNotes.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                נמצאו {paymentNotes.length} הערות גביה במערכת
              </Typography>
            )}
            {!paymentNotesLoading && (!paymentNotes || paymentNotes.length === 0) && (
              <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                ⚠️ אין הערות גביה במערכת - הפילטר לא יפעל
              </Typography>
            )}
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              label="קובץ הפניה"
              fullWidth
              value={advancedFilters.hasReferralFile}
              onChange={(e) => handleAdvancedFilterChange('hasReferralFile', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px'
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש קובץ</MenuItem>
              <MenuItem value="no">אין קובץ</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              label="קובץ התחייבות"
              fullWidth
              value={advancedFilters.hasCommitmentFile}
              onChange={(e) => handleAdvancedFilterChange('hasCommitmentFile', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px'
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש קובץ</MenuItem>
              <MenuItem value="no">אין קובץ</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              type="number"
              label="מינימום טיפולים"
              fullWidth
              value={advancedFilters.minTreatments}
              onChange={(e) => handleAdvancedFilterChange('minTreatments', e.target.value)}
              placeholder="0"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px'
                },
                '& input': {
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              type="number"
              label="מקסימום טיפולים"
              fullWidth
              value={advancedFilters.maxTreatments}
              onChange={(e) => handleAdvancedFilterChange('maxTreatments', e.target.value)}
              placeholder="∞"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px'
                },
                '& input': {
                  textAlign: 'right',
                  fontSize: '0.9rem',
                  height: '100%',
                  paddingTop: 0,
                  paddingBottom: 0
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  left: '25px',
                  right: 'auto',
                  transformOrigin: 'top left'
                },
                '& .MuiInputLabel-shrink': {
                  transform: 'translate(-14px, -9px) scale(0.75)'
                }
              }}
            />
          </Grid>
          
          {/* כפתורי ניקוי מהירים */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 2, 
              mt: 2,
              pt: 2,
              borderTop: '1px solid #e2e8f0'
            }}>
              {hasActiveAdvancedFilters && (
                <Button 
                  variant="outlined" 
                  onClick={handleClearAdvancedFilters}
                  size="small"
                  sx={{ 
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    px: 3
                  }}
                >
                  🗑️ נקה מסננים
                </Button>
              )}
              {(searchTerm || hasActiveAdvancedFilters) && (
                <Button 
                  variant="contained" 
                  onClick={handleClearAllFilters}
                  size="small"
                  sx={{ 
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    px: 3,
                    bgcolor: '#ef4444',
                    '&:hover': {
                      bgcolor: '#dc2626'
                    }
                  }}
                >
                  🔄 נקה הכל
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    )}

    {/* הצגת תוצאות החיפוש */}
    {(searchTerm || hasActiveAdvancedFilters) && (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mb: 2,
        gap: 2,
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Chip 
          label={`נמצאו ${filteredHealthFunds.length} תוצאות`}
          color="primary"
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.9rem',
            px: 1
          }}
        />
        {filteredHealthFunds.length !== healthFunds.length && (
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            מתוך {healthFunds.length} רשומות סה"כ
          </Typography>
        )}
        
        {/* הצגת מסננים פעילים */}
        {hasActiveAdvancedFilters && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            alignItems: 'center',
            mb: 1
          }}>
            {advancedFilters.healthFundId && (
              <Chip 
                label={`קופה: ${healthFundList.find(f => String(f.healthFundId) === String(advancedFilters.healthFundId))?.name || advancedFilters.healthFundId}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('healthFundId', '')}
                sx={{
                  maxWidth: '200px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            )}
            {advancedFilters.city && (
              <Chip 
                label={`עיר: ${advancedFilters.city}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('city', '')}
                sx={{
                  maxWidth: '150px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}
              />
            )}
            {advancedFilters.hasReferralFile !== 'all' && (
              <Chip 
                label={`הפניה: ${advancedFilters.hasReferralFile === 'yes' ? 'יש' : 'אין'}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('hasReferralFile', 'all')}
              />
            )}
            {advancedFilters.hasCommitmentFile !== 'all' && (
              <Chip 
                label={`התחייבות: ${advancedFilters.hasCommitmentFile === 'yes' ? 'יש' : 'אין'}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('hasCommitmentFile', 'all')}
              />
            )}
            {advancedFilters.minTreatments && (
              <Chip 
                label={`מינימום: ${advancedFilters.minTreatments}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('minTreatments', '')}
              />
            )}
            {advancedFilters.maxTreatments && (
              <Chip 
                label={`מקסימום: ${advancedFilters.maxTreatments}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('maxTreatments', '')}
              />
            )}
            {advancedFilters.hasNotes !== 'all' && (
              <Chip 
                label={`הערות: ${advancedFilters.hasNotes === 'yes' ? 'יש' : 'אין'}`}
                size="small"
                color="secondary"
                onDelete={() => handleAdvancedFilterChange('hasNotes', 'all')}
              />
            )}
            {advancedFilters.billingNotesFilter && advancedFilters.billingNotesFilter.length > 0 && (
              <Chip 
                label={`הערות גביה: ${advancedFilters.billingNotesFilter.length} נבחרו`}
                size="small"
                color="warning"
                onDelete={() => handleAdvancedFilterChange('billingNotesFilter', [])}
                sx={{
                  maxWidth: '200px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '160px'
                  }
                }}
              />
            )}
            {advancedFilters.billingNotesFilter && advancedFilters.billingNotesFilter.length > 0 && Array.isArray(paymentNotes) && !paymentNotesLoading && (
              <Chip 
                label={`מסנן לפי ${extractStudentIdsByAutomaticBillingNotes(paymentNotes, advancedFilters.billingNotesFilter).length} תלמידים`}
                size="small"
                color="info"
                variant="outlined"
                sx={{
                  maxWidth: '180px',
                  '& .MuiChip-label': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px'
                  }
                }}
              />
            )}
          </Box>
        )}
        
        {/* הצגת מידע על מיון */}
        {sortConfig.key && (
          <Chip 
            label={`מיון לפי: ${
              sortConfig.key === 'studentId' ? 'קוד תלמיד' :
              sortConfig.key === 'studentName' ? 'שם תלמיד' :
              sortConfig.key === 'age' ? 'גיל' :
              sortConfig.key === 'city' ? 'עיר' :
              sortConfig.key === 'startDateGroup' ? 'תאריך התחלה' :
              sortConfig.key === 'groupName' ? 'שם קבוצה' :
              sortConfig.key === 'healthFundName' ? 'קופה' :
              sortConfig.key === 'startDate' ? 'תאריך יצירה' :
              sortConfig.key === 'reportedTreatments' ? 'טיפולים שדווחו' :
              sortConfig.key === 'treatmentsUsed' ? 'טיפולים שלא דווחו' :
              sortConfig.key === 'commitmentTreatments' ? 'טיפולים עם התחייבות' :
              sortConfig.key === 'registeredTreatments' ? 'טיפולים שנרשם אליהם' :
              sortConfig.key === 'notes' ? 'הערות' :
              sortConfig.key
            } ${sortConfig.direction === 'asc' ? '↗️' : '↘️'}`}
            size="small"
            color="info"
            onDelete={() => setSortConfig({ key: null, direction: 'asc' })}
            sx={{
              maxWidth: '250px',
              '& .MuiChip-label': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }
            }}
          />
        )}
      </Box>
    )}

    {/* מונה תלמידים */}
    <Box sx={{ 
      mb: 2, 
      p: 2, 
      bgcolor: '#f8fafc', 
      borderRadius: 2, 
      border: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      direction: 'rtl'
    }}>
      <Typography variant="h6" sx={{ 
        color: '#1e40af', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        📊
        סה"כ תלמידים בטבלה: {allFilteredHealthFunds.length}
      </Typography>
      
      <Typography variant="body2" sx={{ 
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <InfoIcon sx={{ fontSize: 16 }} />
        מציג {paginatedHealthFunds.length} מתוך {allFilteredHealthFunds.length} תלמידים
      </Typography>
    </Box>

    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', background: 'white', p: 0 }}>
      <Table sx={{ minWidth: 1800 }}>
          <TableHead sx={{ background: '#1d4fbaff' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('studentId', 'קוד תלמיד', <Person sx={{ color: '#2563EB' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('studentName', 'שם תלמיד', <Face sx={{ color: '#43E97B' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('age', 'גיל', <Face sx={{ color: '#764ba2' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('city', 'עיר', <LocationCity sx={{ color: '#38F9D7' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('startDateGroup', 'תאריך התחלה', <Event sx={{ color: '#F59E42' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('groupName', 'שם קבוצה', <Groups sx={{ color: '#667eea' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('healthFundName', 'קופה', <LocalHospital sx={{ color: '#764ba2' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('startDate', 'תאריך יצירה', <CalendarMonth sx={{ color: '#38F9D7' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('reportedTreatments', 'טיפולים שדווחו', <AssignmentTurnedIn sx={{ color: '#10b981' }} />)}
              </TableCell>
              
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('treatmentsUsed', 'טיפולים שלא דווחו', <Healing sx={{ color: '#F59E42' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('commitmentTreatments', 'טיפולים עם התחייבות', <AssignmentTurnedIn sx={{ color: '#667eea' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('registeredTreatments', 'טיפולים שנרשם אליהם', <Event sx={{ color: '#10b981' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60px', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '24px' }}>
                    <Description sx={{ color: '#2563EB' }} />
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                    קובץ הפניה
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60px', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '24px' }}>
                    <Description sx={{ color: '#764ba2' }} />
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                    קובץ התחייבות
                  </Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                {getSortableHeader('notes', 'הערות', <Note sx={{ color: '#F59E42' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60px', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '24px' }}>
                    <EditIcon sx={{ color: 'white' }} />
                  </Box>
                  <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 'bold', lineHeight: 1.2 }}>
                    פעולות
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(16)].map((__, i) => (
                    <TableCell key={i}><Skeleton variant="rectangular" height={24} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredHealthFunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  <Box sx={{ py: 4 }}>
                    {(searchTerm || hasActiveAdvancedFilters) ? (
                      <>
                        <SearchIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                          לא נמצאו תוצאות 
                          {searchTerm && ` עבור "${searchTerm}"`}
                          {hasActiveAdvancedFilters && ` עם המסננים הנוכחיים`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          נסה לשנות את קריטריוני החיפוש או לנקות את המסננים
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          {searchTerm && (
                            <Button 
                              variant="outlined" 
                              onClick={handleClearSearch}
                              sx={{ borderRadius: '24px' }}
                            >
                              נקה חיפוש טקסט
                            </Button>
                          )}
                          {hasActiveAdvancedFilters && (
                            <Button 
                              variant="outlined" 
                              onClick={handleClearAdvancedFilters}
                              sx={{ borderRadius: '24px' }}
                            >
                              נקה מסננים מתקדמים
                            </Button>
                          )}
                          <Button 
                            variant="contained" 
                            onClick={handleClearAllFilters}
                            sx={{ borderRadius: '24px' }}
                          >
                            נקה הכל
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="h6" color="text.secondary">אין נתונים להצגה</Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paginatedHealthFunds.map((row, idx) => (
                <TableRow
                  key={row.id || `row-${idx}`}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  sx={{ background: idx % 2 === 0 ? '#f8fafc' : '#e2e8f0', height: 36 }}
                >
                  <TableCell align="center">{highlightSearchTerm(row.studentId, searchTerm)}</TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.studentName || '-', searchTerm)}</TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.age ?? '-', searchTerm)}</TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.city || '-', searchTerm)}</TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.startDateGroup ? new Date(row.startDateGroup).toLocaleDateString('he-IL') : '-', searchTerm)}</TableCell>
                  <TableCell align="center" sx={{ p: 0.5 }}>
                    {row.groupName ? (
                      <Tooltip title={row.groupName} arrow>
                        <span style={{ cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word', direction: 'rtl', textAlign: 'right', display: 'inline-block', maxWidth: 120 }}>
                          {(() => {
                            const words = row.groupName.split(' ');
                            const shown = words.slice(0, 3).join(' ');
                            const rest = words.slice(3).join(' ');
                            const displayText = rest ? `${shown}...` : shown;
                            return highlightSearchTerm(displayText, searchTerm);
                          })()}
                        </span>
                      </Tooltip>
                    ) : '-' }
                  </TableCell>
                  <TableCell align="center">
                    {(() => {
                      const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
                      const fundText = fund ? `${fund.name} ${fund.fundType}` : row.healthFundId;
                      return highlightSearchTerm(fundText, searchTerm);
                    })()}
                  </TableCell>
                  <TableCell align="center">{highlightSearchTerm(new Date(row.startDate).toLocaleDateString('he-IL'), searchTerm)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="לחץ כדי לראות תאריכים" arrow>
                      <Typography 
                        sx={{ 
                          cursor: 'pointer', 
                          color: '#10b981', 
                          fontWeight: 'bold',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenReportedDatesDialog(row)}
                      >
                        {row.reportedTreatments || 0}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="לחץ כדי לראות תאריכים" arrow>
                      <Typography 
                        sx={{ 
                          cursor: 'pointer', 
                          color: '#2563EB', 
                          fontWeight: 'bold',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenUnreportedDatesDialog(row)}
                      >
                        {row.treatmentsUsed}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.commitmentTreatments, searchTerm)}</TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.registeredTreatments || '-', searchTerm)}</TableCell>
                  <TableCell align="center">
                    {row.referralFilePath ? (
                      <Chip 
                        label={highlightSearchTerm("קיים", searchTerm)} 
                        color="primary" 
                        sx={{ 
                          '& .MuiChip-label': searchTerm && 'קיים'.toLowerCase().includes(searchTerm.toLowerCase()) ? {
                            backgroundColor: '#fef3c7',
                            color: '#92400e'
                          } : {}
                        }}
                      />
                    ) : (
                      <Chip 
                        label={highlightSearchTerm("אין", searchTerm)} 
                        color="default"
                        sx={{ 
                          '& .MuiChip-label': searchTerm && 'אין'.toLowerCase().includes(searchTerm.toLowerCase()) ? {
                            backgroundColor: '#fef3c7',
                            color: '#92400e'
                          } : {}
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.commitmentFilePath ? (
                      <Chip 
                        label={highlightSearchTerm("קיים", searchTerm)} 
                        color="primary"
                        sx={{ 
                          '& .MuiChip-label': searchTerm && 'קיים'.toLowerCase().includes(searchTerm.toLowerCase()) ? {
                            backgroundColor: '#fef3c7',
                            color: '#92400e'
                          } : {}
                        }}
                      />
                    ) : (
                      <Chip 
                        label={highlightSearchTerm("אין", searchTerm)} 
                        color="default"
                        sx={{ 
                          '& .MuiChip-label': searchTerm && 'אין'.toLowerCase().includes(searchTerm.toLowerCase()) ? {
                            backgroundColor: '#fef3c7',
                            color: '#92400e'
                          } : {}
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">{highlightSearchTerm(row.notes || '-', searchTerm)}</TableCell>
                  <TableCell align="center" sx={{  py: 0 }}>
                    <Tooltip title="עריכה" arrow>
                      <IconButton color="info" onClick={() => handleOpenEditDialog(row)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחיקה" arrow>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(row.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'צפיה בפרטי קופ"ח'} arrow>
                      <IconButton color="primary" onClick={() => handleOpenFundDialog(row)} size="small" sx={{ ml: 1 }}>
                        <LocalHospital />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הערות גביה" arrow>
                      <IconButton color="secondary" onClick={() => handleOpenNotesDialog(row)} size="small" sx={{ ml: 1 }}>
                        <NotesIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={allFilteredHealthFunds.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} מתוך ${count !== -1 ? count : `יותר מ-${to}`}`
        }
        sx={{
          direction: 'rtl',
          '& .MuiTablePagination-toolbar': {
            direction: 'rtl'
          },
          '& .MuiTablePagination-selectLabel': {
            margin: 0
          },
          '& .MuiTablePagination-displayedRows': {
            margin: 0
          },
          '& .MuiTablePagination-select': {
            direction: 'ltr'
          },
          bgcolor: '#f8fafc',
          borderRadius: '0 0 12px 12px',
          borderTop: '1px solid #e2e8f0'
        }}
      />

      {/* דיאלוג הערות גביה */}
      <StudentNotesDialog
        open={notesDialogOpen}
        onClose={handleCloseNotesDialog}
        notes={studentNotes}
        student={notesStudent}
        onAddNote={handleAddPaymentNote}
        onEditNote={(note) => {
          setAddNoteStudent({ ...notesStudent, ...note });
          setAddNoteDialogOpen(true);
        }}
        onDeleteNote={async (note) => {
          try {
            if (note.noteId) {
              console.log('מחיקת הערה: שולח לשרת noteId', note.noteId);
              const deleteResult = await dispatch(deleteStudentNote(note.noteId)).unwrap();
              console.log('תוצאת מחיקה מהשרת:', deleteResult);
              if (notesStudent?.id) {
                const result = await dispatch(getNotesByStudentId(notesStudent.studentId)).unwrap();
                console.log('רענון הערות לאחר מחיקה:', result);
                setStudentNotes(Array.isArray(result) ? result : []);
              }
            } else {
              console.log('אין noteId למחיקה');
            }
          } catch (err) {
            console.error('שגיאת מחיקה:', err);
          }
        }}
      />
      <AddStudentNoteDialog
        open={addNoteDialogOpen}
        onClose={handleCloseAddNoteDialog}
        student={addNoteStudent}
        onSave={handleSaveNote}
        editMode={!!addNoteStudent?.noteId}
        noteData={addNoteStudent}
        studentNotes={studentNotes}
      />
      {/* דיאלוג פרטי קופה */}
      <Dialog
        open={fundDialogOpen}
        onClose={handleCloseFundDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.10)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{
            bgcolor: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            direction: 'rtl',
            minHeight: 60,
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
            cursor: 'move',
            '&:hover': {
              background: 'linear-gradient(90deg, #1d4ed8 0%, #38F9D7 100%)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20 }} />
            <LocalHospital sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold', ml: 1 }}>פרטי קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseFundDialog} sx={{ color: '#2563EB' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 4,
          direction: 'rtl',
          bgcolor: 'white',
          background: 'white',
          borderRadius: 0,
        }}>
          <br />
          {selectedFund && (
            <Box sx={{
              bgcolor: 'white',
              borderRadius: 0,
              p: 3,
              boxShadow: 'none',
              minWidth: 320,
              border: 'none',
            }}>
              <Typography variant="h5" sx={{ 
                color: (selectedFund.name && selectedFund.name !== 'לא נמצאו פרטים' && selectedFund.fundType) ? '#2563EB' : '#64748B', 
                fontWeight: 'bold', 
                mb: 2, 
                textAlign: 'center', 
                letterSpacing: 1 
              }}>
                {selectedFund.name || 'פרטי קופת חולים'}
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: '#e3f0ff' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.fundType ? '#2563EB' : '#64748B' }}>
                    <b>סוג:</b> {selectedFund.fundType || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.maxTreatmentsPerYear ? '#2563EB' : '#64748B' }}>
                    <b>מקסימום טיפולים בשנה:</b> {selectedFund.maxTreatmentsPerYear || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.pricePerLesson ? '#2563EB' : '#64748B' }}>
                    <b>מחיר לשיעור:</b> {selectedFund.pricePerLesson || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.monthlyPrice ? '#2563EB' : '#64748B' }}>
                    <b>מחיר חודשי:</b> {selectedFund.monthlyPrice || '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.requiresReferral !== null ? '#2563EB' : '#64748B' }}>
                    <b>הפניה נדרשת:</b> <Chip 
                      label={selectedFund.requiresReferral !== null ? (selectedFund.requiresReferral ? 'כן' : 'לא') : '-'} 
                      color={selectedFund.requiresReferral ? 'primary' : 'default'} 
                      size="small" 
                      sx={{ 
                        bgcolor: selectedFund.requiresReferral ? '#e3f0ff' : '#e0e7ef', 
                        color: selectedFund.requiresReferral !== null ? '#2563EB' : '#64748B' 
                      }} 
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.requiresCommitment !== null ? '#2563EB' : '#64748B' }}>
                    <b>התחייבות נדרשת:</b> <Chip 
                      label={selectedFund.requiresCommitment !== null ? (selectedFund.requiresCommitment ? 'כן' : 'לא') : '-'} 
                      color={selectedFund.requiresCommitment ? 'primary' : 'default'} 
                      size="small" 
                      sx={{ 
                        bgcolor: selectedFund.requiresCommitment ? '#e3f0ff' : '#e0e7ef', 
                        color: selectedFund.requiresCommitment !== null ? '#2563EB' : '#64748B' 
                      }} 
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: selectedFund.isActive !== null ? '#2563EB' : '#64748B' }}>
                    <b>פעילה:</b> <Chip 
                      label={selectedFund.isActive !== null ? (selectedFund.isActive ? 'כן' : 'לא') : '-'} 
                      color={selectedFund.isActive ? 'primary' : 'default'} 
                      size="small" 
                      sx={{ 
                        bgcolor: selectedFund.isActive ? '#e3f0ff' : '#e0e7ef', 
                        color: selectedFund.isActive !== null ? '#2563EB' : '#64748B' 
                      }} 
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'transparent',
          borderRadius: '0 0 20px 20px',
          background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
        }}>
          <Button variant="contained" color="primary" onClick={handleCloseFundDialog} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 8px rgba(37,99,235,0.18)', bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}>סגור</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג עדכון */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{ 
            bgcolor: '#2563EB', 
            color: 'white', 
            fontWeight: 'bold', 
            borderRadius: '16px 16px 0 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            direction: 'rtl',
            cursor: 'move',
            '&:hover': {
              bgcolor: '#1d4ed8'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20 }} />
            <EditIcon />
            <Typography variant="h6" component="span">עדכון סטודנט-קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseEditDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
       
               <br />
   {editFormData && (
            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
              <Grid item xs={12} sm={6}>
                <TextField label="תלמיד" fullWidth variant="outlined" value={editFormData.studentId} onChange={e => handleEditInputChange('studentId', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>קופה</InputLabel>
                  <Select
                    value={editFormData.healthFundId}
                    onChange={e => handleEditInputChange('healthFundId', e.target.value)}
                    label="קופה"
                    sx={{ textAlign: 'right' }}
                  >
                    {healthFundList.map((fund) => (
                      <MenuItem key={fund.healthFundId} value={fund.healthFundId}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
                          <LocalHospital sx={{ color: '#764ba2' }} />
                          <span>{fund.name} - {fund.fundType}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="תאריך התחלה" type="date" fullWidth variant="outlined" value={editFormData.startDate} onChange={e => handleEditInputChange('startDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים שלא דווחו" type="number" fullWidth variant="outlined" value={editFormData.treatmentsUsed} onChange={e => handleEditInputChange('treatmentsUsed', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים שדווחו" type="number" fullWidth variant="outlined" value={editFormData.reportedTreatments || ''} onChange={e => handleEditInputChange('reportedTreatments', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים עם התחייבות" type="number" fullWidth variant="outlined" value={editFormData.commitmentTreatments} onChange={e => handleEditInputChange('commitmentTreatments', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים שנרשם אליהם" type="number" fullWidth variant="outlined" value={editFormData.registeredTreatments || ''} onChange={e => handleEditInputChange('registeredTreatments', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="קובץ הפניה" fullWidth variant="outlined" value={editFormData.referralFilePath} onChange={e => handleEditInputChange('referralFilePath', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="קובץ התחייבות" fullWidth variant="outlined" value={editFormData.commitmentFilePath} onChange={e => handleEditInputChange('commitmentFilePath', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="הערות" fullWidth variant="outlined" value={editFormData.notes} onChange={e => handleEditInputChange('notes', e.target.value)} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseEditDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleEditSave} disabled={editSaving} sx={{ borderRadius: '8px', px: 3, py: 1,direction:'ltr' ,bgcolor: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', '&:hover': { bgcolor: '#1D4ED8' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{editSaving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>
      {/* דיאלוג מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{
            bgcolor: 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
            color: '#b71c1c',
            fontWeight: 'bold',
            borderRadius: '16px 16px 0 0',
            direction: 'rtl',
            textAlign: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 2px 8px rgba(237,66,69,0.10)',
            cursor: 'move',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            '&:hover': {
              bgcolor: 'linear-gradient(90deg, #ffcdd2 0%, #e57373 100%)'
            }
          }}
        >
          <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20, color: '#b71c1c' }} />
          האם אתה בטוח שברצונך למחוק?
        </DialogTitle>
        <DialogContent sx={{
          bgcolor: 'white',
          p: 3,
          textAlign: 'center',
          fontSize: '1.1rem',
        }}>
          <Typography sx={{ color: '#2563EB', fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
            {(() => {
              const student = healthFunds.find(s => String(s.id) === String(deleteId));
              return student ? `תלמיד: ${student.studentName || student.studentId}` : '';
            })()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'white',
          borderRadius: '0 0 16px 16px',
        }}>
          <Button variant="outlined" color="primary" onClick={handleCloseDeleteDialog} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', color: '#2563EB', borderColor: '#2563EB' }}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteSaving} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>{deleteSaving ? 'מוחק...' : 'מחק'}</Button>
        </DialogActions>
      </Dialog>
      {/* דיאלוג הוספה */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{ 
            bgcolor: '#2563EB', 
            color: 'white', 
            fontWeight: 'bold', 
            borderRadius: '16px 16px 0 0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            direction: 'rtl',
            cursor: 'move',
            '&:hover': {
              bgcolor: '#1d4ed8'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20 }} />
            <AddCircle />
            <Typography variant="h6" component="span">הוספת סטודנט-קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseAddDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}> <br />
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: '#e3f2fd', 
            borderRadius: '8px', 
            border: '1px solid #2196f3',
            direction: 'rtl'
          }}>            

            <Typography variant="body2" sx={{ 
              color: '#1565c0', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              direction: 'rtl'
            }}>
              <InfoIcon sx={{ fontSize: 18 }} />
           הערה: כאשר מכניסים תלמיד חדש, אוטומטית כל השיעורים שהוא היה בהם יסומנו כטיפולים שעוד לא דווחו.
            </Typography>
          </Box>
          <Grid container spacing={2} sx={{ direction: 'rtl' }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Person sx={{ color: '#2563EB'}} /> <span>קוד תלמיד </span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                fullWidth 
                variant="outlined" 
                value={formData.studentId} 
                onChange={e => handleInputChange('studentId', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={<Box sx={{ display: 'flex', alignItems: 'center', direction: 'rtl' }}><LocalHospital sx={{ color: '#764ba2' }} /> <span>קופה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
                fullWidth
                variant="outlined"
                value={formData.healthFundId}
                onChange={e => handleInputChange('healthFundId', e.target.value)}
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
                SelectProps={{ native: false, renderValue: (selected) => {
                  const fund = Array.isArray(healthFundList) ? healthFundList.find(f => String(f.healthFundId) === String(selected)) : null;
                  return fund ? `${fund.name} (${fund.fundType})` : '';
                }}}
                helperText="בחירת קופה תמלא אוטומטית את שדות הטיפולים"
              >
                {Array.isArray(healthFundList) && healthFundList.map(fund => (
                  <MenuItem key={fund.healthFundId} value={fund.healthFundId}>
                    {fund.name} ({fund.fundType})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><CalendarMonth sx={{ color: '#38F9D7' }} /> <span>תאריך התחלה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="date" 
                fullWidth 
                variant="outlined" 
                value={formData.startDate} 
                onChange={e => handleInputChange('startDate', e.target.value)} 
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Healing sx={{ color: '#F59E42' }} /> <span>טיפולים שלא דווחו</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.treatmentsUsed} 
                onChange={e => handleInputChange('treatmentsUsed', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#10b981' }} /> <span>טיפולים שדווחו</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.reportedTreatments} 
                onChange={e => handleInputChange('reportedTreatments', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#667eea' }} /> <span>טיפולים עם התחייבות</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.commitmentTreatments} 
                onChange={e => handleInputChange('commitmentTreatments', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
                helperText="מתמלא אוטומטית לפי הקופה הנבחרת"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Event sx={{ color: '#10b981' }} /> <span>טיפולים שנרשם אליהם</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.registeredTreatments} 
                onChange={e => handleInputChange('registeredTreatments', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
                helperText="מתמלא אוטומטית, ניתן לשינוי"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Description sx={{ color: '#2563EB' }} /> <span>קובץ הפניה</span></Box>} fullWidth variant="outlined" value={formData.referralFilePath} onChange={e => handleInputChange('referralFilePath', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Description sx={{ color: '#764ba2' }} /> <span>קובץ התחייבות</span></Box>} fullWidth variant="outlined" value={formData.commitmentFilePath} onChange={e => handleInputChange('commitmentFilePath', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Note sx={{ color: '#F59E42' }} /> <span>הערות</span></Box>} fullWidth variant="outlined" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} />
            </Grid>
          </Grid>

          <Divider sx={{ width: '100%', my: 3 }} />

          {/* צ'קליסט הערות אוטומטיות */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#374151', textAlign: 'right', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon sx={{ color: '#10b981' }} />
              📋 הערות גביה אוטומטיות
            </Typography>
            <Box sx={{ 
              bgcolor: '#F8FAFC', 
              borderRadius: '12px', 
              p: 2, 
              border: '1px solid #E2E8F0' 
            }}>
              <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'right', mb: 2 }}>
                סמן את הבעיות הרלוונטיות. הערות שיסומנו יתווספו אוטומטית כהערת גביה לתלמיד
              </Typography>
              <Grid container spacing={2}>
                {checklistItems.map((item) => (
                  <Grid item xs={12} key={item.key}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: healthFundChecklist[item.key] ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${healthFundChecklist[item.key] ? '#BBF7D0' : '#FECACA'}`,
                      transition: 'all 0.2s ease'
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={healthFundChecklist[item.key]}
                            onChange={(e) => handleChecklistChange(item.key, e.target.checked)}
                            sx={{
                              color: healthFundChecklist[item.key] ? '#22C55E' : '#D1D5DB',
                              '&.Mui-checked': {
                                color: '#22C55E',
                              },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ textAlign: 'right', flex: 1 }}>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 500, 
                              color: healthFundChecklist[item.key] ? '#166534' : '#DC2626',
                            }}>
                              {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#6B7280',
                              fontSize: '0.85rem'
                            }}>
                              {item.description}
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          alignItems: 'flex-start',
                          margin: 0,
                          width: '100%',
                          '& .MuiFormControlLabel-label': {
                            flex: 1,
                            textAlign: 'right'
                          }
                        }}
                      />
                      
                      {/* שדה טקסט נוסף לכל פריט */}
                      {healthFundChecklist[item.key] && (
                        <TextField
                          size="small"
                          placeholder={item.key === 'insufficientTreatments' 
                            ? "מספר טיפולים נוספים נדרש..." 
                            : " פרטים נוספים..."}
                          value={item.key === 'insufficientTreatments' 
                            ? additionalTreatmentsNeeded 
                            : additionalNotes[item.key] || ''}
                          onChange={(e) => {
                            if (item.key === 'insufficientTreatments') {
                              setAdditionalTreatmentsNeeded(e.target.value);
                            } else {
                              handleAdditionalNoteChange(item.key, e.target.value);
                            }
                          }}
                          multiline
                          rows={2}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'white',
                              direction: 'rtl',
                              textAlign: 'right'
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseAddDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#2563EB',direction:'ltr', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', '&:hover': { bgcolor: '#1D4ED8' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{saving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג תאריכים לא מדווחים */}
      <Dialog
        open={unreportedDatesDialogOpen}
        onClose={handleCloseUnreportedDatesDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{
            bgcolor: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            direction: 'rtl',
            minHeight: 60,
            boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
            background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
            cursor: 'move',
            '&:hover': {
              background: 'linear-gradient(90deg, #1d4ed8 0%, #38F9D7 100%)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20 }} />
            <CalendarMonth sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold', ml: 1 }}>
              תאריכי טיפולים לא מדווחים
            </Typography>
          </Box>
          <IconButton onClick={handleCloseUnreportedDatesDialog} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 4,
          direction: 'rtl',
          bgcolor: 'white',
          background: 'white',
          borderRadius: 0,
        }}>
          <br />
          {selectedStudentForDates && (
            <Typography variant="h6" sx={{ 
              color: '#2563EB', 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <Person />
              תלמיד: {selectedStudentForDates.studentName || selectedStudentForDates.studentId}
            </Typography>
          )}
          
          <Divider sx={{ mb: 3, bgcolor: '#e3f0ff' }} />
          
          {unreportedDatesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>טוען תאריכים...</Typography>
            </Box>
          ) : unreportedDates.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                 כל הטיפולים דווחו! 🎉
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                אין תאריכים שטרם דווחו עבור תלמיד זה
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ 
                color: '#374151', 
                fontWeight: 'bold', 
                mb: 2,
                textAlign: 'center'
              }}>
                תאריכים שטרם דווחו ({unreportedDates.length}):
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: '#6B7280', 
                mb: 2,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                לחץ על התאריכים כדי לבחור אותם לדיווח
              </Typography>
              
              {(() => {
                // קיבוץ התאריכים לפי חודשים
                const datesByMonth = unreportedDates.reduce((acc, dateItem) => {
                  const date = new Date(dateItem);
                  const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                  const monthName = date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });
                  
                  if (!acc[monthKey]) {
                    acc[monthKey] = {
                      monthName: monthName,
                      dates: []
                    };
                  }
                  acc[monthKey].dates.push(date);
                  return acc;
                }, {});
                
                // מיון החודשים לפי תאריך
                const sortedMonths = Object.keys(datesByMonth).sort((a, b) => {
                  const [yearA, monthA] = a.split('-').map(Number);
                  const [yearB, monthB] = b.split('-').map(Number);
                  return yearA !== yearB ? yearA - yearB : monthA - monthB;
                });
                
                return sortedMonths.map((monthKey, monthIndex) => (
                  <Box key={monthKey} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#2563EB', 
                      fontWeight: 'bold', 
                      mb: 2,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}>
                      📅 {datesByMonth[monthKey].monthName}
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center">
                      {datesByMonth[monthKey].dates
                        .sort((a, b) => a - b) // מיון התאריכים בתוך החודש
                        .map((date, dateIndex) => {
                          const dateString = date.toISOString();
                          const isSelected = selectedDatesForReporting.includes(dateString);
                          
                          return (
                            <Grid item xs={6} sm={4} md={3} key={`${monthKey}-${dateIndex}`}>
                              <Box 
                                sx={{
                                  p: 2,
                                  bgcolor: isSelected ? '#F0FDF4' : '#FEF2F2',
                                  borderRadius: '8px',
                                  border: isSelected ? '2px solid #10B981' : '1px solid #FECACA',
                                  textAlign: 'center',
                                  mx: 'auto',
                                  maxWidth: 120,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                  }
                                }}
                                onClick={() => handleDateSelectionToggle(date)}
                              >
                                <Typography sx={{ 
                                  color: isSelected ? '#10B981' : '#DC2626',
                                  fontWeight: 'bold',
                                  fontSize: '1.1rem'
                                }}>
                                  {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Box>
                ));
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'transparent',
          borderRadius: '0 0 16px 16px',
          background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
        }}>

          
          <Button 
            variant="outlined" 
            onClick={handleCloseUnreportedDatesDialog} 
            sx={{ 
              borderRadius: '8px', 
              px: 3, 
              py: 1, 
              fontWeight: 'bold', 
              fontSize: '1rem',
              color: 'white',
              borderColor: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white'
              } 
            }}
          >
            ביטול
          </Button>
          
          {selectedDatesForReporting.length > 0 && (
            <Button 
              variant="contained" 
              onClick={handleReportSelectedDates}
              disabled={reportingInProgress}
              sx={{ 
                borderRadius: '8px', 
                px: 3, 
                py: 1, 
                fontWeight: 'bold', 
                fontSize: '1rem', 
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)', 
                bgcolor: '#10B981', 
                '&:hover': { bgcolor: '#059669' },
                '&:disabled': { bgcolor: '#9CA3AF' }
              }}
              endIcon={reportingInProgress ? <CircularProgress size={16} color="inherit" /> : <CheckIcon />}
            >
              {reportingInProgress ? 'מדווח...' : `דווח ${selectedDatesForReporting.length} תאריכים`}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* דיאלוג תאריכים שדווחו */}
      <Dialog
        open={reportedDatesDialogOpen}
        onClose={handleCloseReportedDatesDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus={false}
        disableAutoFocus={false}
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle 
          className="drag-handle"
          sx={{
            bgcolor: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            direction: 'rtl',
            minHeight: 60,
            boxShadow: '0 2px 8px rgba(16,185,129,0.10)',
            background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
            cursor: 'move',
            '&:hover': {
              background: 'linear-gradient(90deg, #059669 0%, #2563eb 100%)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon sx={{ opacity: 0.8, fontSize: 20 }} />
            <CheckIcon sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold', ml: 1 }}>
              תאריכי טיפולים שדווחו
            </Typography>
          </Box>
          <IconButton onClick={handleCloseReportedDatesDialog} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 4,
          direction: 'rtl',
          bgcolor: 'white',
          background: 'white',
          borderRadius: 0,
        }}>
          <br />
          {selectedStudentForReportedDates && (
            <Typography variant="h6" sx={{ 
              color: '#10b981', 
              fontWeight: 'bold', 
              mb: 3, 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}>
              <Person />
              תלמיד: {selectedStudentForReportedDates.studentName || selectedStudentForReportedDates.studentId}
            </Typography>
          )}
          
          <Divider sx={{ mb: 3, bgcolor: '#d1fae5' }} />
          
          {reportedDatesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>טוען תאריכים...</Typography>
            </Box>
          ) : reportedDates.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                 לא דווחו טיפולים עדיין 📋
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                אין תאריכים שדווחו עבור תלמיד זה
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ 
                color: '#374151', 
                fontWeight: 'bold', 
                mb: 2,
                textAlign: 'center'
              }}>
                תאריכים שדווחו ({reportedDates.length}):
              </Typography>
              
              {(() => {
                // קיבוץ התאריכים לפי חודשים
                const datesByMonth = reportedDates.reduce((acc, dateItem) => {
                  const date = new Date(dateItem);
                  const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                  const monthName = date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' });
                  
                  if (!acc[monthKey]) {
                    acc[monthKey] = {
                      monthName: monthName,
                      dates: []
                    };
                  }
                  acc[monthKey].dates.push(date);
                  return acc;
                }, {});
                
                // מיון החודשים לפי תאריך
                const sortedMonths = Object.keys(datesByMonth).sort((a, b) => {
                  const [yearA, monthA] = a.split('-').map(Number);
                  const [yearB, monthB] = b.split('-').map(Number);
                  return yearA !== yearB ? yearA - yearB : monthA - monthB;
                });
                
                return sortedMonths.map((monthKey, monthIndex) => (
                  <Box key={monthKey} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#10b981', 
                      fontWeight: 'bold', 
                      mb: 2,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1
                    }}>
                      ✅ {datesByMonth[monthKey].monthName}
                    </Typography>
                    
                    <Grid container spacing={2} justifyContent="center">
                      {datesByMonth[monthKey].dates
                        .sort((a, b) => a - b) // מיון התאריכים בתוך החודש
                        .map((date, dateIndex) => (
                        <Grid item xs={6} sm={4} md={3} key={`${monthKey}-${dateIndex}`}>
                          <Box sx={{
                            p: 2,
                            bgcolor: '#f0fdf4',
                            borderRadius: '8px',
                            border: '1px solid #bbf7d0',
                            textAlign: 'center',
                            mx: 'auto',
                            maxWidth: 120
                          }}>
                            <Typography sx={{ 
                              color: '#166534',
                              fontWeight: 'bold',
                              fontSize: '1.1rem'
                            }}>
                              {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ));
              })()}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'transparent',
          borderRadius: '0 0 16px 16px',
          background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
        }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCloseReportedDatesDialog} 
            sx={{ 
              borderRadius: '8px', 
              px: 3, 
              py: 1, 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              boxShadow: '0 2px 8px rgba(16,185,129,0.18)', 
              bgcolor: '#10b981', 
              '&:hover': { bgcolor: '#059669' } 
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      {/* דיאלוג ייצוא אקסל */}
      <ExcelExportDialog
        open={excelExportDialogOpen}
        onClose={handleCloseExcelExportDialog}
        data={healthFunds}
        healthFundList={healthFundList}
        dispatch={dispatch}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            direction: 'rtl',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentHealthFundTable;
