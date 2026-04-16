import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, Divider, MenuItem, ListItemIcon, ListItemText, FormControlLabel, Checkbox, InputAdornment, Select, FormControl, InputLabel, CircularProgress, TablePagination, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { motion } from 'framer-motion';
import { AddCircle, Person, LocalHospital, CalendarMonth, Healing, AssignmentTurnedIn, Description, Note, Save, Close, Face, LocationCity, Groups, Event, Check as CheckIcon, AttachMoney as AttachMoneyIcon, Info as InfoIcon, FileDownload, Search as SearchIcon, Clear as ClearIcon, ArrowUpward, ArrowDownward, Sort, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import ExcelExportDialog from '../../components/ExcelExportDialog';
import NotesIcon from '@mui/icons-material/Notes';
import StudentNotesDialog from '../Students/components/StudentNotesDialog';
import {
  fetchStudentHealthFunds,
  addStudentHealthFund,
  updateStudentHealthFund,
  deleteStudentHealthFund,
  fetchUnreportedDates,
  fetchReportedDates,
  reportUnreportedDate,
} from '../../store/studentHealthFund/studentHealthFundApi';
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
import StudentCoursesDialog from '../Students/components/studentCoursesDialog';
import { getgroupStudentByStudentId } from '../../store/groupStudent/groupStudentGetByStudentIdThunk';
import { getAttendanceByStudent } from '../../store/attendance/attendanceGetByStudent';
import { batchUpdateAttendances } from '../../store/attendance/batchUpdateAttendances';
import {
  fetchCommitmentsByStudentHealthFund,
  addHealthFundCommitment,
  updateHealthFundCommitment,
  deleteHealthFundCommitment,
} from '../../store/healthFundCommitment/healthFundCommitmentApi';
import {
  selectHealthFundCommitments,
  selectHealthFundCommitmentsLoading,
} from '../../store/healthFundCommitment/healthFundCommitmentSlice';

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
  const [fallbackUnreportedDates, setFallbackUnreportedDates] = useState([]);
  const [fallbackUnreportedEntries, setFallbackUnreportedEntries] = useState([]);
  // State לבחירת תאריכים לדיווח
  const [selectedDatesForReporting, setSelectedDatesForReporting] = useState([]);
  const [reportingInProgress, setReportingInProgress] = useState(false);
  // דיאלוג תאריכים שדווחו
  const [reportedDatesDialogOpen, setReportedDatesDialogOpen] = useState(false);
  const [selectedStudentForReportedDates, setSelectedStudentForReportedDates] = useState(null);
  const [fallbackReportedDates, setFallbackReportedDates] = useState([]);
  const [fallbackReportedEntries, setFallbackReportedEntries] = useState([]);
  
  // דיאלוג ייצוא אקסל
  const [excelExportDialogOpen, setExcelExportDialogOpen] = useState(false);

  // דיאלוג התחייבויות
  const [commitmentsDialogOpen, setCommitmentsDialogOpen] = useState(false);
  const [selectedStudentForCommitments, setSelectedStudentForCommitments] = useState(null);
  const [commitmentFormOpen, setCommitmentFormOpen] = useState(false);
  const [commitmentFormMode, setCommitmentFormMode] = useState('add');
  const [commitmentSaving, setCommitmentSaving] = useState(false);
  const [commitmentFormData, setCommitmentFormData] = useState({
    id: null,
    studentHealthFundId: '',
    commitmentNumber: '',
    commitmentTreatments: '',
    usedTreatments: 0,
    startDate: '',
    endDate: '',
    filePath: '',
    notes: '',
    isActive: true,
  });

  // Student details dialog states
  const [studentDetailsDialogOpen, setStudentDetailsDialogOpen] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]);
  const [loadingStudentCourses, setLoadingStudentCourses] = useState(false);

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
      if (!(ensurePermission())) return;
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
  const rawHealthFunds = Array.isArray(studentHealthFundState.items) ? studentHealthFundState.items : [];
  const [attendanceCountsByRecordId, setAttendanceCountsByRecordId] = useState({});
  const loading = studentHealthFundState.loading;
  const error = studentHealthFundState.error;

  useEffect(() => {
    const rowsNeedingCountsSync = rawHealthFunds.filter((row) => {
      const recordId = row?.id ?? row?.Id;
      const studentId = row?.studentId ?? row?.StudentId;

      if (!recordId || !studentId || attendanceCountsByRecordId[recordId]) {
        return false;
      }

      const pendingFromServer = Number(row?.treatmentsUsed ?? row?.TreatmentsUsed ?? 0);
      const reportedFromServer = Number(row?.reportedTreatments ?? row?.ReportedTreatments ?? 0);

      return pendingFromServer === 0 && reportedFromServer === 0;
    });

    if (!rowsNeedingCountsSync.length) {
      return;
    }

    let isCancelled = false;

    const loadAttendanceCounts = async () => {
      const results = await Promise.allSettled(
        rowsNeedingCountsSync.map(async (row) => {
          const recordId = row?.id ?? row?.Id;
          const studentId = row?.studentId ?? row?.StudentId;
          const healthFundId = row?.healthFundId ?? row?.HealthFundId;
          const attendanceResult = await dispatch(getAttendanceByStudent(studentId)).unwrap();

          const relevantAttendances = (Array.isArray(attendanceResult) ? attendanceResult : []).filter((attendanceRow) => {
            const isPresent = attendanceRow?.wasPresent ?? attendanceRow?.WasPresent;
            const reportedHealthFundId = attendanceRow?.healthFundReport ?? attendanceRow?.HealthFundReport;

            return Boolean(isPresent) && (!healthFundId || Number(reportedHealthFundId) === Number(healthFundId));
          });

          return {
            recordId,
            treatmentsUsed: relevantAttendances.filter((attendanceRow) => Number(attendanceRow?.statusReport ?? attendanceRow?.StatusReport) === 3).length,
            reportedTreatments: relevantAttendances.filter((attendanceRow) => Number(attendanceRow?.statusReport ?? attendanceRow?.StatusReport) === 1).length,
          };
        })
      );

      if (isCancelled) {
        return;
      }

      const nextCounts = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value?.recordId) {
          nextCounts[result.value.recordId] = {
            treatmentsUsed: result.value.treatmentsUsed,
            reportedTreatments: result.value.reportedTreatments,
          };
        }
      });

      if (Object.keys(nextCounts).length > 0) {
        setAttendanceCountsByRecordId((prev) => ({ ...prev, ...nextCounts }));
      }
    };

    loadAttendanceCounts();

    return () => {
      isCancelled = true;
    };
  }, [dispatch, rawHealthFunds, attendanceCountsByRecordId]);

  const healthFunds = useMemo(() => (
    rawHealthFunds.map((row) => {
      const recordId = row?.id ?? row?.Id;
      const computedCounts = attendanceCountsByRecordId[recordId];

      return {
        ...row,
        id: recordId,
        studentId: row?.studentId ?? row?.StudentId ?? '',
        studentName: row?.studentName ?? row?.StudentName ?? '',
        healthFundId: row?.healthFundId ?? row?.HealthFundId ?? '',
        age: row?.age ?? row?.Age ?? '',
        city: row?.city ?? row?.City ?? '',
        groupName: row?.groupName ?? row?.GroupName ?? '',
        startDate: row?.startDate ?? row?.StartDate ?? null,
        startDateGroup: row?.startDateGroup ?? row?.StartDateGroup ?? null,
        referralFilePath: row?.referralFilePath ?? row?.ReferralFilePath ?? null,
        commitmentFilePath: row?.commitmentFilePath ?? row?.CommitmentFilePath ?? null,
        notes: row?.notes ?? row?.Notes ?? '',
        treatmentsUsed: computedCounts?.treatmentsUsed ?? Number(row?.treatmentsUsed ?? row?.TreatmentsUsed ?? 0),
        reportedTreatments: computedCounts?.reportedTreatments ?? Number(row?.reportedTreatments ?? row?.ReportedTreatments ?? 0),
        commitmentTreatments: Number(row?.commitmentTreatments ?? row?.CommitmentTreatments ?? 0),
        registeredTreatments: Number(row?.registeredTreatments ?? row?.RegisteredTreatments ?? 0),
      };
    })
  ), [rawHealthFunds, attendanceCountsByRecordId]);
  // קופות החולים מהסטייט
  const healthFundList = useSelector(state => (state.healthFunds && state.healthFunds.items) ? state.healthFunds.items : []);
  
  // הערות גביה מהסטייט
  const paymentNotes = useSelector(selectPaymentNotes);
  const paymentNotesLoading = useSelector(selectPaymentNotesLoading);
  const commitments = useSelector(selectHealthFundCommitments);
  const commitmentsLoading = useSelector(selectHealthFundCommitmentsLoading);

  const paymentNotesByStudentId = useMemo(() => {
    const notesMap = new Map();

    if (!Array.isArray(paymentNotes)) {
      return notesMap;
    }

    paymentNotes.forEach(note => {
      const studentKey = String(note?.studentId ?? '').trim();
      const noteContent = String(note?.noteContent ?? '').trim();

      if (!studentKey || !noteContent) {
        return;
      }

      if (!notesMap.has(studentKey)) {
        notesMap.set(studentKey, []);
      }

      const existingNotes = notesMap.get(studentKey);
      if (!existingNotes.includes(noteContent)) {
        existingNotes.push(noteContent);
      }
    });

    return new Map(
      Array.from(notesMap.entries()).map(([studentKey, notes]) => [studentKey, notes.join(' | ')])
    );
  }, [paymentNotes]);

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
        const billingNotesText = paymentNotesByStudentId.get(String(row.studentId)) || '';

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
          row.notes,
          billingNotesText
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
        const combinedNotes = [row.notes, paymentNotesByStudentId.get(String(row.studentId))]
          .filter(Boolean)
          .join(' ')
          .trim();
        const hasNotes = combinedNotes.length > 0;
        return advancedFilters.hasNotes === 'yes' ? hasNotes : !hasNotes;
      });
    }

    // סינון לפי הערות גביה אוטומטיות
    if (advancedFilters.billingNotesFilter && advancedFilters.billingNotesFilter.length > 0) {
      // וודא שהנתונים זמינים לפני שנקרא לפונקציה
      if (!Array.isArray(paymentNotes) || paymentNotesLoading) {
        // אם הנתונים לא זמינים עדיין, לא מחילים זמנית את פילטר הערות הגביה
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
  }, [healthFunds, debouncedSearchTerm, advancedFilters, healthFundMap, sortConfig, paymentNotes, paymentNotesLoading, paymentNotesByStudentId]);

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

  const activeFiltersCount = Object.entries(advancedFilters).reduce((count, [key, value]) => {
    if (key === 'billingNotesFilter') {
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    }

    return value && value !== 'all' ? count + 1 : count;
  }, 0);

  const billingOverview = useMemo(() => {
    const totalStudents = filteredHealthFunds.length;
    const withBillingNotes = filteredHealthFunds.filter((row) => Boolean(paymentNotesByStudentId.get(String(row.studentId)) || row.notes)).length;
    const pendingReports = filteredHealthFunds.reduce((sum, row) => sum + Number(row.treatmentsUsed || 0), 0);
    const totalCommitments = filteredHealthFunds.reduce((sum, row) => sum + Number(row.commitmentTreatments || 0), 0);

    return [
      { label: 'תלמידים להצגה', value: totalStudents, color: '#1d4ed8', bg: '#eff6ff' },
      { label: 'עם הערות גביה', value: withBillingNotes, color: '#b45309', bg: '#fff7ed' },
      { label: 'ממתינים לדיווח', value: pendingReports, color: '#0f766e', bg: '#ecfeff' },
      { label: 'סה״כ התחייבויות', value: totalCommitments, color: '#6d28d9', bg: '#f5f3ff' },
    ];
  }, [filteredHealthFunds, paymentNotesByStudentId]);

  const compactFilterFieldSx = {
    '& .MuiOutlinedInput-root': {
      direction: 'rtl',
      minHeight: '46px',
      borderRadius: '12px',
      bgcolor: '#ffffff',
      boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
      '& fieldset': {
        borderColor: '#d7e3f3'
      },
      '&:hover fieldset': {
        borderColor: '#93c5fd'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB'
      }
    },
    '& .MuiSelect-select': {
      display: 'flex',
      alignItems: 'center',
      minHeight: '46px !important',
      paddingTop: '0 !important',
      paddingBottom: '0 !important'
    },
    '& input': {
      textAlign: 'right',
      fontSize: '0.88rem',
      paddingTop: 0,
      paddingBottom: 0
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.88rem',
      fontWeight: 600
    }
  };

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
    if (state.user?.userDetails) return state.user.userDetails;
    if (state.user?.user) return state.user.user;
    if (state.users?.currentUser) return state.users.currentUser;
    if (state.auth?.user) return state.auth.user;
    if (state.user) return state.user;
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

  const ensurePermission = () => {
    return checkUserPermission(
      currentUser?.id || currentUser?.userId,
      (message, severity) => setNotification({ open: true, message, severity })
    );
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
      label: '✅ סיים התחייבות',
      description: 'הילד סיים את ההתחייבות הנוכחית וצריך טיפול המשך'
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
    // Set current date as default for startDate and reset treatmentsUsed to 0
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      startDate: today,
      treatmentsUsed: '0',
      reportedTreatments: '0',
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
  };
  const handleSave = async () => {
    setSaving(true);

    if (!(ensurePermission())) {
      setSaving(false);
      return;
    }
    
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
    
    // אם יש שדות חובה שלא מולאו
    if (requiredFields.length > 0) {
      const message = `לא מילאת את כל שדות החובה:\n${requiredFields.join(', ')}`;
      console.error('❌ שדות חובה חסרים:', requiredFields);
      alert(message);
      setSaving(false);
      return;
    }
    
    try {
      await dispatch(addStudentHealthFund(formData)).unwrap();

      // נתוני דיווח והתחייבויות יחושבו אוטומטית בשרת מתוך הנוכחות,
      // ולכן לא נוצרת כאן יותר הערה אוטומטית לפי מונים ידניים.
      
      // יצירת הערות אוטומטיות בהתאם לצ'קליסט
      try {
        await createAutomaticHealthFundNotes(formData.studentId);
      } catch (noteError) {
        console.error('שגיאה ביצירת הערות, אבל ממשיכים:', noteError);
      }
      
      handleCloseAddDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('❌ Failed to add student health fund:', err);
      alert('שגיאה בשמירת נתוני קופת החולים: ' + (err.message || err));
    }
    setSaving(false);
  };

  // פונקציה ליצירת הערה אוטומטית כאשר קופה מאוחדת וטיפולים נמוכים
  const createAutomaticInsufficientTreatmentsNote = async (studentId, healthFundName) => {
    if (!(ensurePermission())) return null;
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

    try {
      const result = await dispatch(addStudentNote(noteData)).unwrap();
      return result;
    } catch (error) {
      console.error('❌ שגיאה ביצירת הערה אוטומטית:', error);
      throw error;
    }
  };

  // פונקציה ליצירת הערות אוטומטיות
  const createAutomaticHealthFundNotes = async (studentId) => {
    if (!(ensurePermission())) return null;
    
    const userDetails = getUserDetails(currentUser);
    
    const selectedHealthFund = healthFundList.find(fund => fund.healthFundId == formData.healthFundId);
    const healthFundName = selectedHealthFund?.name || 'קופת חולים';
    
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
      const item = '✅ סיים התחייבות';
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
      
      try {
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
    }

    return null;
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
      if (!(ensurePermission())) {
        setEditSaving(false);
        return;
      }
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
      if (!(ensurePermission())) {
        setDeleteSaving(false);
        return;
      }
      await dispatch(deleteStudentHealthFund(deleteId)).unwrap();
      handleCloseDeleteDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('Failed to delete student health fund:', err);
    }
    setDeleteSaving(false);
  };

  const getCurrentUserId = () => Number(
    currentUser?.id || currentUser?.userId || currentUser?.IdentityCard || currentUser?.identityCard || 0
  );

  const loadAttendanceDatesFallback = async (row, statusValue) => {
    try {
      const attendanceResult = await dispatch(getAttendanceByStudent(row.studentId)).unwrap();
      return (Array.isArray(attendanceResult) ? attendanceResult : [])
        .filter((attendanceRow) => {
          const isPresent = attendanceRow?.wasPresent ?? attendanceRow?.WasPresent;
          const statusReport = Number(attendanceRow?.statusReport ?? attendanceRow?.StatusReport ?? 0);
          const healthFundReport = attendanceRow?.healthFundReport ?? attendanceRow?.HealthFundReport;

          return Boolean(isPresent)
            && statusReport === statusValue
            && (!row?.healthFundId || !healthFundReport || Number(healthFundReport) === Number(row.healthFundId));
        })
        .map((attendanceRow) => ({
          attendanceId: Number(attendanceRow?.attendanceId ?? attendanceRow?.AttendanceId ?? 0),
          studentId: Number(attendanceRow?.studentId ?? attendanceRow?.StudentId ?? row?.studentId ?? 0),
          lessonId: Number(attendanceRow?.lessonId ?? attendanceRow?.LessonId ?? 0),
          healthFundReport: Number(attendanceRow?.healthFundReport ?? attendanceRow?.HealthFundReport ?? row?.healthFundId ?? 0),
          wasPresent: Boolean(attendanceRow?.wasPresent ?? attendanceRow?.WasPresent),
          lessonDate: attendanceRow?.lessonDate ?? attendanceRow?.LessonDate ?? attendanceRow?.date ?? attendanceRow?.Date ?? null,
          reportedAt: attendanceRow?.dateReport ?? attendanceRow?.DateReport ?? attendanceRow?.updateDate ?? attendanceRow?.UpdateDate ?? null,
          dateValue: attendanceRow?.lessonDate ?? attendanceRow?.LessonDate ?? attendanceRow?.date ?? attendanceRow?.Date ?? attendanceRow?.dateReport ?? attendanceRow?.DateReport ?? null,
        }))
        .filter((entry) => Boolean(entry.dateValue));
    } catch (error) {
      console.error('Failed to load attendance date fallback:', error);
      return [];
    }
  };

  const effectiveUnreportedDates = unreportedDates.length > 0 ? unreportedDates : fallbackUnreportedDates;
  const effectiveReportedDates = reportedDates.length > 0 ? reportedDates : fallbackReportedDates;

  // פונקציות לטיפול בדיאלוג תאריכים לא מדווחים
  const handleOpenUnreportedDatesDialog = async (row) => {
    setSelectedStudentForDates(row);
    setFallbackUnreportedDates([]);
    setFallbackUnreportedEntries([]);
    setUnreportedDatesDialogOpen(true);
    try {
      const result = await dispatch(fetchUnreportedDates(row.id)).unwrap();
      if ((!Array.isArray(result) || result.length === 0) && Number(row?.treatmentsUsed || 0) > 0) {
        const fallbackEntries = await loadAttendanceDatesFallback(row, 3);
        setFallbackUnreportedEntries(fallbackEntries);
        setFallbackUnreportedDates(fallbackEntries.map((entry) => entry.dateValue));
      }
    } catch (err) {
      console.error('Failed to fetch unreported dates:', err);
      if (Number(row?.treatmentsUsed || 0) > 0) {
        const fallbackEntries = await loadAttendanceDatesFallback(row, 3);
        setFallbackUnreportedEntries(fallbackEntries);
        setFallbackUnreportedDates(fallbackEntries.map((entry) => entry.dateValue));
      }
    }
  };
  const handleCloseUnreportedDatesDialog = () => {
    setUnreportedDatesDialogOpen(false);
    setSelectedStudentForDates(null);
    setFallbackUnreportedDates([]);
    setFallbackUnreportedEntries([]);
    setSelectedDatesForReporting([]);
  };

  const getDateSelectionKey = (value) => {
    if (!value) return '';

    if (typeof value === 'string') {
      const normalized = value.trim();
      const match = normalized.match(/^(\d{4}-\d{2}-\d{2})/);
      if (match) {
        return match[1];
      }
    }

    const parsed = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // פונקציות לטיפול בבחירת תאריכים לדיווח
  const handleDateSelectionToggle = (date) => {
    const dateKey = getDateSelectionKey(date);
    if (!dateKey) return;

    setSelectedDatesForReporting(prev => {
      if (prev.includes(dateKey)) {
        return prev.filter(d => d !== dateKey);
      }
      return [...prev, dateKey];
    });
  };

  const handleToggleSelectAllDates = () => {
    const allDateKeys = Array.from(
      new Set(effectiveUnreportedDates.map(dateItem => getDateSelectionKey(dateItem)).filter(Boolean))
    );

    setSelectedDatesForReporting(prev => {
      const areAllSelected = allDateKeys.length > 0 && allDateKeys.every(date => prev.includes(date));
      return areAllSelected ? [] : allDateKeys;
    });
  };

  // פונקציה לדיווח תאריכים נבחרים
  const handleReportSelectedDates = async () => {
    if (selectedDatesForReporting.length === 0) {
      setNotification({
        open: true,
        message: 'יש לבחור לפחות תאריך אחד לדיווח',
        severity: 'warning'
      });
      return;
    }

    if (!selectedStudentForDates?.id) {
      setNotification({
        open: true,
        message: 'שגיאה: לא נמצא מזהה תלמיד',
        severity: 'error'
      });
      return;
    }

    if (!(ensurePermission())) return;

    setReportingInProgress(true);
    try {
      let reportedSuccessfully = false;

      try {
        for (const dateKey of selectedDatesForReporting) {
          await dispatch(reportUnreportedDate({
            studentHealthFundId: selectedStudentForDates.id,
            date: dateKey,
          })).unwrap();
        }

        reportedSuccessfully = true;
      } catch (serverReportError) {
        console.warn('הדיווח הישיר לשרת נכשל, מנסה מסלול גיבוי:', serverReportError);

        const sourceEntries = fallbackUnreportedEntries.length > 0
          ? fallbackUnreportedEntries
          : await loadAttendanceDatesFallback(selectedStudentForDates, 3);

        const selectedEntries = sourceEntries.filter((entry) => {
          const entryKey = getDateSelectionKey(entry.dateValue || entry.lessonDate);
          return entryKey && selectedDatesForReporting.includes(entryKey);
        });

        if (!selectedEntries.length) {
          throw new Error('לא נמצאו רשומות נוכחות תואמות לתאריכים שנבחרו.');
        }

        const nowIso = new Date().toISOString();
        const reportDate = nowIso.split('T')[0];
        const updatePayloads = selectedEntries.map((entry) => ({
          attendanceId: Number(entry.attendanceId),
          studentId: Number(entry.studentId || selectedStudentForDates.studentId || 0),
          lessonId: Number(entry.lessonId || 0),
          dateReport: reportDate,
          statusReport: 1,
          updateDate: nowIso,
          updateBy: getCurrentUserId(),
          healthFundReport: Number(entry.healthFundReport || selectedStudentForDates.healthFundId || 0),
          wasPresent: Boolean(entry.wasPresent),
        }));

        await dispatch(batchUpdateAttendances(updatePayloads)).unwrap();
        reportedSuccessfully = true;
      }

      if (!reportedSuccessfully) {
        throw new Error('דיווח התאריכים לא הושלם');
      }

      setAttendanceCountsByRecordId((prev) => {
        const next = { ...prev };
        delete next[selectedStudentForDates.id];
        return next;
      });

      await dispatch(fetchUnreportedDates(selectedStudentForDates.id));
      await dispatch(fetchReportedDates(selectedStudentForDates.id));
      await dispatch(fetchStudentHealthFunds());

      handleCloseUnreportedDatesDialog();
      setNotification({
        open: true,
        message: `${selectedDatesForReporting.length} תאריכים דווחו בהצלחה!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('שגיאה בדיווח תאריכים:', error);
      setNotification({
        open: true,
        message: 'שגיאה בדיווח התאריכים. אנא נסי שנית.',
        severity: 'error'
      });
    } finally {
      setReportingInProgress(false);
    }
  };

  // פונקציות לטיפול בדיאלוג תאריכים שדווחו
  const handleOpenReportedDatesDialog = async (row) => {
    setSelectedStudentForReportedDates(row);
    setFallbackReportedDates([]);
    setFallbackReportedEntries([]);
    setReportedDatesDialogOpen(true);
    try {
      const result = await dispatch(fetchReportedDates(row.id)).unwrap();
      if ((!Array.isArray(result) || result.length === 0) && Number(row?.reportedTreatments || 0) > 0) {
        const fallbackEntries = await loadAttendanceDatesFallback(row, 1);
        setFallbackReportedEntries(fallbackEntries);
        setFallbackReportedDates(fallbackEntries.map((entry) => entry.dateValue));
      }
    } catch (err) {
      console.error('Failed to fetch reported dates:', err);
      if (Number(row?.reportedTreatments || 0) > 0) {
        const fallbackEntries = await loadAttendanceDatesFallback(row, 1);
        setFallbackReportedEntries(fallbackEntries);
        setFallbackReportedDates(fallbackEntries.map((entry) => entry.dateValue));
      }
    }
  };
  const handleCloseReportedDatesDialog = () => {
    setReportedDatesDialogOpen(false);
    setSelectedStudentForReportedDates(null);
    setFallbackReportedDates([]);
    setFallbackReportedEntries([]);
  };

  // פונקציות לטיפול בדיאלוג ייצוא אקסל
  const handleOpenExcelExportDialog = () => {
    setExcelExportDialogOpen(true);
  };
  const handleCloseExcelExportDialog = () => {
    setExcelExportDialogOpen(false);
  };

  const handleOpenCommitmentsDialog = async (row) => {
    setSelectedStudentForCommitments(row);
    setCommitmentsDialogOpen(true);

    try {
      await dispatch(fetchCommitmentsByStudentHealthFund(row.id)).unwrap();
    } catch (error) {
      console.error('שגיאה בטעינת התחייבויות:', error);
    }
  };

  const handleCloseCommitmentsDialog = () => {
    setCommitmentsDialogOpen(false);
    setSelectedStudentForCommitments(null);
    setCommitmentFormOpen(false);
  };

  const handleOpenAddCommitment = () => {
    const today = new Date().toISOString().split('T')[0];
    setCommitmentFormMode('add');
    setCommitmentFormData({
      id: null,
      studentHealthFundId: selectedStudentForCommitments?.id || '',
      commitmentNumber: '',
      commitmentTreatments: '',
      usedTreatments: 0,
      startDate: today,
      endDate: '',
      filePath: '',
      notes: '',
      isActive: true,
    });
    setCommitmentFormOpen(true);
  };

  const handleOpenEditCommitment = (commitment) => {
    const formatDateInput = (value) => {
      if (!value) return '';
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().split('T')[0];
    };

    setCommitmentFormMode('edit');
    setCommitmentFormData({
      id: commitment.id ?? commitment.Id ?? commitment.commitmentId ?? commitment.CommitmentId ?? null,
      studentHealthFundId: (commitment.studentHealthFundId ?? commitment.StudentHealthFundId ?? selectedStudentForCommitments?.id) || '',
      commitmentNumber: commitment.commitmentNumber ?? commitment.CommitmentNumber ?? '',
      commitmentTreatments: commitment.commitmentTreatments ?? commitment.CommitmentTreatments ?? '',
      usedTreatments: commitment.usedTreatments ?? commitment.UsedTreatments ?? 0,
      startDate: formatDateInput(commitment.startDate ?? commitment.StartDate),
      endDate: formatDateInput(commitment.endDate ?? commitment.EndDate),
      filePath: commitment.filePath ?? commitment.FilePath ?? '',
      notes: commitment.notes ?? commitment.Notes ?? '',
      isActive: commitment.isActive ?? commitment.IsActive ?? true,
      createdAt: commitment.createdAt ?? commitment.CreatedAt ?? null,
    });
    setCommitmentFormOpen(true);
  };

  const handleCloseCommitmentForm = () => {
    setCommitmentFormOpen(false);
  };

  const handleCommitmentFormChange = (field, value) => {
    setCommitmentFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCommitment = async () => {
    if (!(ensurePermission())) return;

    if (!commitmentFormData.commitmentNumber || !commitmentFormData.startDate) {
      setNotification({
        open: true,
        message: 'יש למלא מספר התחייבות ותאריך התחלה',
        severity: 'warning'
      });
      return;
    }

    setCommitmentSaving(true);
    try {
      const payload = {
        ...commitmentFormData,
        studentHealthFundId: Number(selectedStudentForCommitments?.id || commitmentFormData.studentHealthFundId || 0),
        commitmentTreatments: commitmentFormData.commitmentTreatments === '' ? null : Number(commitmentFormData.commitmentTreatments),
        usedTreatments: Number(commitmentFormData.usedTreatments || 0),
        endDate: commitmentFormData.endDate || null,
        createdAt: commitmentFormData.createdAt || null,
      };

      if (commitmentFormMode === 'edit') {
        const commitmentId = Number(payload.id ?? payload.commitmentId ?? payload.CommitmentId ?? 0);

        if (!commitmentId) {
          throw new Error('לא נמצא מזהה התחייבות לעדכון');
        }

        payload.id = commitmentId;
        delete payload.commitmentId;
        await dispatch(updateHealthFundCommitment(payload)).unwrap();
      } else {
        delete payload.id;
        delete payload.commitmentId;
        await dispatch(addHealthFundCommitment(payload)).unwrap();
      }

      await dispatch(fetchCommitmentsByStudentHealthFund(selectedStudentForCommitments?.id)).unwrap();

      setNotification({
        open: true,
        message: commitmentFormMode === 'edit' ? 'התחייבות עודכנה בהצלחה' : 'התחייבות נוספה בהצלחה',
        severity: 'success'
      });

      setCommitmentFormOpen(false);
      dispatch(fetchStudentHealthFunds());
    } catch (error) {
      console.error('שגיאה בשמירת התחייבות:', error);
      const validationMessage = error?.errors
        ? Object.values(error.errors).flat().join(' | ')
        : error?.message || 'שגיאה בשמירת התחייבות';

      setNotification({
        open: true,
        message: validationMessage,
        severity: 'error'
      });
    } finally {
      setCommitmentSaving(false);
    }
  };

  const handleDeleteCommitment = async (commitmentId) => {
    if (!(ensurePermission())) return;

    const isConfirmed = window.confirm('האם למחוק את ההתחייבות הזו?');
    if (!isConfirmed) return;

    try {
      await dispatch(deleteHealthFundCommitment(commitmentId)).unwrap();
      await dispatch(fetchCommitmentsByStudentHealthFund(selectedStudentForCommitments?.id)).unwrap();
      setNotification({
        open: true,
        message: 'התחייבות נמחקה בהצלחה',
        severity: 'success'
      });
      dispatch(fetchStudentHealthFunds());
    } catch (error) {
      console.error('שגיאה במחיקת התחייבות:', error);
      setNotification({
        open: true,
        message: 'שגיאה במחיקת התחייבות',
        severity: 'error'
      });
    }
  };

  // פונקציות לטיפול בדיאלוג פרטי תלמיד
  const handleOpenStudentDetails = async (row) => {
    try {
      // בניית אובייקט התלמיד מנתוני השורה
      const studentForDialog = {
        id: row.studentId,
        firstName: row.studentName?.split(' ')[0] || '',
        lastName: row.studentName?.split(' ').slice(1).join(' ') || '',
        email: row.email || '',
        phone: row.phone || '',
        city: row.city || '',
        age: row.age || '',
      };
      
      setSelectedStudentForDetails(studentForDialog);
      
      // פתיחת הדיאלוג מיד - ללא המתנה לטעינת הקורסים
      setStudentDetailsDialogOpen(true);
      
      // איפוס קורסים קודמים ותחילת טעינה חדשה ברקע
      setStudentCourses([]);
      setLoadingStudentCourses(true);
      
      // טעינת קורסי התלמיד ברקע
      try {
        const coursesResult = await dispatch(getgroupStudentByStudentId(row.studentId));
        if (coursesResult.payload) {
          setStudentCourses(Array.isArray(coursesResult.payload) ? coursesResult.payload : []);
        } else {
          setStudentCourses([]);
        }
      } catch (coursesError) {
        console.error('שגיאה בטעינת קורסי התלמיד:', coursesError);
        setStudentCourses([]);
      } finally {
        setLoadingStudentCourses(false);
      }
      
    } catch (error) {
      console.error('שגיאה בפתיחת פרטי התלמיד:', error);
    }
  };

  const handleCloseStudentDetails = () => {
    setStudentDetailsDialogOpen(false);
    setSelectedStudentForDetails(null);
    setStudentCourses([]);
    setLoadingStudentCourses(false);
  };

  return (
  <Box sx={{ bgcolor: 'transparent', p: 0, fontFamily: 'inherit' }}>
    <Paper
      elevation={0}
      sx={{
        mb: 2.5,
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: '1px solid #dbeafe',
        background: 'linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)',
        boxShadow: '0 8px 24px rgba(37,99,235,0.08)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1d4fbaff', textAlign: 'right', ml: 2, fontFamily: 'inherit', fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
            ניהול גביה תלמידים
          </Typography>
          <Typography variant="body2" sx={{ color: '#5b6b84', mt: 0.75, fontFamily: 'inherit' }}>
            מעקב נוח אחר דיווחים, התחייבויות והערות גביה במקום אחד.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            color="primary"
            sx={{
              borderRadius: '999px',
              direction: 'ltr',
              fontWeight: 700,
              px: 3,
              py: 1,
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              boxShadow: '0 8px 18px rgba(37,99,235,0.18)',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)'
              }
            }}
            onClick={handleOpenExcelExportDialog}
          >
            ייצוא לאקסל
          </Button>
        </Box>
      </Box>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        mb: 3,
        px: { xs: 1.5, md: 2 },
        py: 2,
        borderRadius: 3,
        bgcolor: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 20px rgba(15,23,42,0.05)'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', flexWrap: 'wrap' }}>
          <TextField
            placeholder="חיפוש לפי שם תלמיד, קוד, עיר, קופה, הערות ונתוני גביה"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 260,
              '& .MuiOutlinedInput-root': {
                borderRadius: '999px',
                bgcolor: '#f8fbff',
                direction: 'rtl',
                pr: 2,
                '& fieldset': {
                  borderColor: '#dbeafe'
                },
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(37,99,235,0.10)',
                },
                '&.Mui-focused': {
                  boxShadow: '0 4px 16px rgba(37,99,235,0.16)',
                }
              },
              '& input': {
                textAlign: 'right',
                fontSize: '0.92rem',
                fontFamily: 'inherit'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? <CircularProgress size={18} /> : <SearchIcon sx={{ color: '#2563EB', fontSize: 22 }} />}
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
            variant={showAdvancedSearch ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            sx={{
              borderRadius: '999px',
              fontWeight: 700,
              minWidth: '190px',
              px: 2.5,
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              fontSize: '0.9rem'
            }}
          >
            {showAdvancedSearch ? 'סגור חיפוש מתקדם' : 'חיפוש מתקדם'}
          </Button>

          {(hasActiveAdvancedFilters || searchTerm) && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAllFilters}
              sx={{
                borderRadius: '999px',
                fontWeight: 700,
                px: 2.5,
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
              }}
            >
              נקה הכל
            </Button>
          )}
        </Box>

        <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'right', px: 0.5 }}>
          ניתן לסנן לפי קופה, עיר, הערות גביה, קבצים ונתוני טיפולים.
        </Typography>
      </Box>
    </Paper>

    {/* פאנל חיפוש מתקדם */}
    {showAdvancedSearch && (
      <Paper sx={{ 
        bgcolor: '#ffffff',
        borderRadius: '18px',
        p: 3,
        mb: 3,
        boxShadow: '0 10px 24px rgba(37,99,235,0.10)',
        border: '1px solid #dbeafe',
        width: '100%'
      }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body1" sx={{ 
            color: '#2563EB', 
            fontWeight: 'bold', 
            mb: 0.5,
            fontSize: '1rem',
            textAlign: 'right',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1
          }}>
            <SearchIcon sx={{ fontSize: 18 }} />
            חיפוש מתקדם ומסננים
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', textAlign: 'right' }}>
            בחרי רק את המסננים הרלוונטיים כדי למקד את רשימת התלמידים במהירות.
          </Typography>
        </Box>
        
       
        
        <Grid container spacing={2} sx={{ direction: 'rtl' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              size="small"
              label="קופת חולים"
              fullWidth
              value={advancedFilters.healthFundId}
              onChange={(e) => handleAdvancedFilterChange('healthFundId', e.target.value)}
              sx={compactFilterFieldSx}
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
              size="small"
              fullWidth
              value={advancedFilters.city}
              onChange={(e) => handleAdvancedFilterChange('city', e.target.value)}
              placeholder="הקלד שם עיר..."
              sx={compactFilterFieldSx}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              size="small"
              label="הערות"
              fullWidth
              value={advancedFilters.hasNotes}
              onChange={(e) => handleAdvancedFilterChange('hasNotes', e.target.value)}
              sx={compactFilterFieldSx}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש הערות</MenuItem>
              <MenuItem value="no">אין הערות</MenuItem>
            </TextField>
          </Grid>

          {/* פילטר הערות גביה אוטומטיות */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>הערות גביה אוטומטיות</InputLabel>
              <Select
                multiple
                value={advancedFilters.billingNotesFilter}
                onChange={(e) => handleAdvancedFilterChange('billingNotesFilter', e.target.value)}
                label="הערות גביה אוטומטיות"
                renderValue={(selected) => 
                  selected.length === 0 ? 'בחר הערות גביה...' : `${selected.length} הערות נבחרו`
                }
                sx={compactFilterFieldSx}
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
                    primary="✅ סיים התחייבות" 
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
              size="small"
              label="קובץ הפניה"
              fullWidth
              value={advancedFilters.hasReferralFile}
              onChange={(e) => handleAdvancedFilterChange('hasReferralFile', e.target.value)}
              sx={compactFilterFieldSx}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש קובץ</MenuItem>
              <MenuItem value="no">אין קובץ</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              select
              size="small"
              label="קובץ התחייבות"
              fullWidth
              value={advancedFilters.hasCommitmentFile}
              onChange={(e) => handleAdvancedFilterChange('hasCommitmentFile', e.target.value)}
              sx={compactFilterFieldSx}
            >
              <MenuItem value="all">הכל</MenuItem>
              <MenuItem value="yes">יש קובץ</MenuItem>
              <MenuItem value="no">אין קובץ</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              type="number"
              size="small"
              label="מינימום טיפולים"
              fullWidth
              value={advancedFilters.minTreatments}
              onChange={(e) => handleAdvancedFilterChange('minTreatments', e.target.value)}
              placeholder="0"
              sx={compactFilterFieldSx}
            />
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <TextField
              type="number"
              size="small"
              label="מקסימום טיפולים"
              fullWidth
              value={advancedFilters.maxTreatments}
              onChange={(e) => handleAdvancedFilterChange('maxTreatments', e.target.value)}
              placeholder="∞"
              sx={compactFilterFieldSx}
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
                  נקה מסננים
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
                    boxShadow: '0 6px 14px rgba(239,68,68,0.16)',
                    '&:hover': {
                      bgcolor: '#dc2626'
                    }
                  }}
                >
                  נקה הכל
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
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
              sortConfig.key === 'reportedTreatments' ? 'דווחו' :
              sortConfig.key === 'treatmentsUsed' ? 'ממתין לדיווח' :
              sortConfig.key === 'commitmentTreatments' ? 'מספר התחייבויות' :
              sortConfig.key === 'registeredTreatments' ? 'התחייבויות שנוצלו' :
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
      background: 'linear-gradient(90deg, #f8fbff 0%, #ffffff 100%)',
      borderRadius: 3,
      border: '1px solid #dbeafe',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
      flexWrap: 'wrap',
      direction: 'rtl',
      boxShadow: '0 6px 16px rgba(15,23,42,0.04)'
    }}>
      <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        📊 סה"כ תלמידים בטבלה: {allFilteredHealthFunds.length}
      </Typography>

      <Typography variant="body2" sx={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon sx={{ fontSize: 16 }} />
        מציג {paginatedHealthFunds.length} מתוך {allFilteredHealthFunds.length} תלמידים בעמוד הנוכחי
      </Typography>
    </Box>

    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', background: 'white', p: 0 }}>
      <Table sx={{ minWidth: 1800, fontFamily: 'inherit' }}>
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
                {getSortableHeader('reportedTreatments', 'דווחו', <AssignmentTurnedIn sx={{ color: '#10b981' }} />)}
              </TableCell>
              
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('treatmentsUsed', 'ממתין לדיווח', <Healing sx={{ color: '#F59E42' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('commitmentTreatments', 'מספר התחייבויות', <AssignmentTurnedIn sx={{ color: '#667eea' }} />)}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                {getSortableHeader('registeredTreatments', 'התחייבויות שנוצלו', <Event sx={{ color: '#10b981' }} />)}
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
                  <TableCell 
                    align="center" 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(37, 99, 235, 0.08)',
                        '& span': {
                          color: '#2563EB',
                          textDecoration: 'underline'
                        }
                      }
                    }}
                    onClick={() => handleOpenStudentDetails(row)}
                  >
                    <Tooltip title="לחץ לצפייה בפרטי התלמיד 👆" arrow>
                      <span style={{ 
                        transition: 'all 0.2s ease',
                        color: paymentNotesByStudentId.get(String(row.studentId)) ? '#b45309' : 'inherit',
                        fontWeight: paymentNotesByStudentId.get(String(row.studentId)) ? 700 : 400
                      }}>
                        {highlightSearchTerm(row.studentName || '-', searchTerm)}
                      </span>
                    </Tooltip>
                  </TableCell>
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
                  <TableCell align="center">
                    <Tooltip title="לחץ לצפייה בהתחייבויות" arrow>
                      <Typography
                        sx={{
                          cursor: 'pointer',
                          color: '#4f46e5',
                          fontWeight: 'bold',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenCommitmentsDialog(row)}
                      >
                        {highlightSearchTerm(row.commitmentTreatments ?? 0, searchTerm)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="לחץ לצפייה בהתחייבויות" arrow>
                      <Typography
                        sx={{
                          cursor: 'pointer',
                          color: '#0f766e',
                          fontWeight: 'bold',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenCommitmentsDialog(row)}
                      >
                        {highlightSearchTerm(row.registeredTreatments ?? 0, searchTerm)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
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
                  <TableCell align="center">
                    {highlightSearchTerm(
                      [paymentNotesByStudentId.get(String(row.studentId)), row.notes]
                        .filter(Boolean)
                        .join(' | ') || '-',
                      searchTerm
                    )}
                  </TableCell>
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
                    <Tooltip title="צפיה בהתחייבויות" arrow>
                      <IconButton color="success" onClick={() => handleOpenCommitmentsDialog(row)} size="small" sx={{ ml: 1 }}>
                        <AssignmentTurnedIn />
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
            if (!(ensurePermission())) return;
            if (note.noteId) {
              await dispatch(deleteStudentNote(note.noteId)).unwrap();
              if (notesStudent?.id) {
                const result = await dispatch(getNotesByStudentId(notesStudent.studentId)).unwrap();
                setStudentNotes(Array.isArray(result) ? result : []);
              }
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
            borderRadius: '20px',
            boxShadow: '0 18px 55px rgba(15,23,42,0.12)',
            direction: 'rtl',
            bgcolor: '#ffffff',
            border: '1px solid #dbeafe',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          className="drag-handle"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            direction: 'rtl',
            minHeight: 68,
            px: 2.5,
            background: 'linear-gradient(90deg, #2563eb 0%, #0ea5a4 55%, #4ade80 100%)',
            cursor: 'move'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <DragIndicatorIcon sx={{ opacity: 0.9, fontSize: 20 }} />
            <LocalHospital sx={{ fontSize: 30, color: 'white' }} />
            <Typography
              variant="h5"
              component="span"
              sx={{
                color: 'white',
                fontWeight: 700,
                ml: 1,
                letterSpacing: '0.2px',
                fontSize: { xs: '1.45rem', md: '1.6rem' },
                fontFamily: '"Segoe UI", "Assistant", "Rubik", sans-serif'
              }}
            >
              פרטי קופה
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseFundDialog}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.12)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 0,
            direction: 'rtl',
            bgcolor: '#fbfdff'
          }}
        >
          {selectedFund && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Box
                sx={{
                  mb: 2.5,
                  p: 2.5,
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #f8fbff 0%, #eef7ff 100%)',
                  border: '1px solid #dbeafe',
                  textAlign: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: (selectedFund.name && selectedFund.name !== 'לא נמצאו פרטים') ? '#1e40af' : '#64748B',
                    fontWeight: 700,
                    mb: 0.75,
                    letterSpacing: '0.15px',
                    lineHeight: 1.2,
                    fontSize: { xs: '1.55rem', md: '1.85rem' },
                    fontFamily: '"Segoe UI", "Assistant", "Rubik", sans-serif'
                  }}
                >
                  {selectedFund.name || 'פרטי קופת חולים'}
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.98rem' }}>
                  הצגת תנאי הקופה, מחירים והגדרות הדיווח בצורה מסודרת וברורה.
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>סוג מסלול</Typography>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700, mt: 0.5 }}>{selectedFund.fundType || '-'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>מקסימום טיפולים בשנה</Typography>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700, mt: 0.5 }}>{selectedFund.maxTreatmentsPerYear || '-'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>מחיר לשיעור</Typography>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700, mt: 0.5 }}>{selectedFund.pricePerLesson || '-'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>מחיר חודשי</Typography>
                    <Typography sx={{ color: '#0f172a', fontWeight: 700, mt: 0.5 }}>{selectedFund.monthlyPrice || '-'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1 }}>הפניה נדרשת</Typography>
                    <Chip
                      label={selectedFund.requiresReferral !== null ? (selectedFund.requiresReferral ? 'כן' : 'לא') : '-'}
                      size="small"
                      sx={{
                        bgcolor: selectedFund.requiresReferral ? '#fff7ed' : '#eefbf3',
                        color: selectedFund.requiresReferral ? '#b45309' : '#2f855a',
                        border: selectedFund.requiresReferral ? '1px solid #f6d7a7' : '1px solid #cfe9d9',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1 }}>התחייבות נדרשת</Typography>
                    <Chip
                      label={selectedFund.requiresCommitment !== null ? (selectedFund.requiresCommitment ? 'כן' : 'לא') : '-'}
                      size="small"
                      sx={{
                        bgcolor: selectedFund.requiresCommitment ? '#fff7ed' : '#eefbf3',
                        color: selectedFund.requiresCommitment ? '#b45309' : '#2f855a',
                        border: selectedFund.requiresCommitment ? '1px solid #f6d7a7' : '1px solid #cfe9d9',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 1.75, borderRadius: '14px', bgcolor: 'white', border: '1px solid #e2e8f0', minHeight: 82 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block', mb: 1 }}>פעילה</Typography>
                    <Chip
                      label={selectedFund.isActive !== null ? (selectedFund.isActive ? 'כן' : 'לא') : '-'}
                      size="small"
                      sx={{
                        bgcolor: selectedFund.isActive ? '#eefbf3' : '#f3f4f6',
                        color: selectedFund.isActive ? '#2f855a' : '#6b7280',
                        border: selectedFund.isActive ? '1px solid #cfe9d9' : '1px solid #e5e7eb',
                        fontWeight: 700
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            gap: 1,
            direction: 'rtl',
            bgcolor: '#f8fbff',
            borderTop: '1px solid #dbeafe'
          }}
        >
          <Button
            variant="contained"
            onClick={handleCloseFundDialog}
            sx={{
              borderRadius: '10px',
              px: 3.5,
              py: 1,
              fontWeight: 'bold',
              fontSize: '0.98rem',
              boxShadow: '0 6px 16px rgba(37,99,235,0.12)',
              bgcolor: '#2563EB',
              '&:hover': { bgcolor: '#1D4ED8' }
            }}
          >
            סגור
          </Button>
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
              <Grid item xs={12}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <Typography sx={{ color: '#1d4ed8', fontWeight: 600 }}>
                    נתוני דיווח והתחייבויות מחושבים אוטומטית מתוך הנוכחות ואינם ניתנים לעריכה ידנית.
                  </Typography>
                </Box>
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
           הערה: הרשומה משמשת פרופיל גביה לתלמיד. נתוני הדיווח עצמם יחושבו אוטומטית מתוך הנוכחות.
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
                  helperText="בחירת קופה תשייך את התלמיד לקופה. נתוני הדיווח יחושבו אוטומטית."
                >
                  <MenuItem value="" disabled>בחר קופה</MenuItem>
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
            <Grid item xs={12}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                <Typography sx={{ color: '#1d4ed8', fontWeight: 600 }}>
                  נתוני ממתין לדיווח, דווחו, מספר התחייבויות והתחייבויות שנוצלו יחושבו אוטומטית מתוך שאילתות השרת.
                </Typography>
              </Box>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Checkbox
                          checked={healthFundChecklist[item.key]}
                          onChange={async (e) => {
                            handleChecklistChange(item.key, e.target.checked);
                            // צור הערה אוטומטית מיידית כאשר מסומן
                            if (e.target.checked) {
                              await createAutomaticHealthFundNotes(formData.studentId);
                              // רענון הערות לאחר יצירה
                              if (formData.studentId) {
                                try {
                                  await dispatch(getNotesByStudentId(formData.studentId)).unwrap();
                                } catch (err) {
                                  console.error('שגיאה ברענון הערות לאחר יצירת הערה אוטומטית:', err);
                                }
                              }
                            }
                          }}
                          sx={{
                            color: healthFundChecklist[item.key] ? '#22C55E' : '#D1D5DB',
                            '&.Mui-checked': {
                              color: '#22C55E',
                            },
                          }}
                        />
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
                      </Box>
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
            <Box
              sx={{
                mb: 3,
                p: 2.2,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #f8fbff 0%, #eef8ff 100%)',
                border: '1px solid #dbeafe',
                boxShadow: '0 6px 18px rgba(37,99,235,0.06)'
              }}
            >
              <Typography variant="h6" sx={{ 
                color: '#2563EB', 
                fontWeight: 'bold', 
                mb: 1, 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                <Person />
                תלמיד: {selectedStudentForDates.studentName || selectedStudentForDates.studentId}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'center' }}>
                כאן אפשר לבחור את התאריכים הלא מדווחים ולשלוח אותם ישירות לדיווח.
              </Typography>
            </Box>
          )}
          
          <Divider sx={{ mb: 3, bgcolor: '#dbeafe' }} />
          
          {unreportedDatesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Typography>טוען תאריכים...</Typography>
            </Box>
          ) : effectiveUnreportedDates.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3, borderRadius: '18px', bgcolor: '#f8fffc', border: '1px solid #d1fae5' }}>
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
                תאריכים שטרם דווחו ({effectiveUnreportedDates.length}):
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: '#6B7280', 
                mb: 2,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                לחץ על התאריכים כדי לבחור אותם לדיווח
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleToggleSelectAllDates}
                  sx={{
                    borderRadius: '999px',
                    fontWeight: 'bold',
                    px: 3,
                    py: 0.85,
                    bgcolor: '#f8fbff',
                    borderColor: '#bfdbfe',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.08)',
                    '&:hover': { bgcolor: '#eef6ff', borderColor: '#93c5fd' }
                  }}
                >
                  {selectedDatesForReporting.length === effectiveUnreportedDates.length ? 'נקה בחירה' : 'בחר הכל'}
                </Button>
              </Box>
              
              {(() => {
                // קיבוץ התאריכים לפי חודשים
                const datesByMonth = effectiveUnreportedDates.reduce((acc, dateItem) => {
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
                          const dateKey = getDateSelectionKey(date);
                          const isSelected = selectedDatesForReporting.includes(dateKey);
                          
                          return (
                            <Grid item xs={6} sm={4} md={3} key={`${monthKey}-${dateIndex}`}>
                              <Box 
                                sx={{
                                  p: 1.8,
                                  bgcolor: isSelected ? '#ecfdf5' : '#f8fbff',
                                  borderRadius: '14px',
                                  border: isSelected ? '2px solid #10B981' : '1px solid #cfe3f5',
                                  textAlign: 'center',
                                  mx: 'auto',
                                  maxWidth: 132,
                                  minHeight: 86,
                                  cursor: 'pointer',
                                  boxShadow: isSelected ? '0 10px 20px rgba(16,185,129,0.14)' : '0 4px 12px rgba(37,99,235,0.06)',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 10px 20px rgba(37,99,235,0.12)'
                                  }
                                }}
                                onClick={() => handleDateSelectionToggle(date)}
                              >
                                <Typography sx={{ 
                                  color: isSelected ? '#059669' : '#2563EB',
                                  fontWeight: 'bold',
                                  fontSize: '1.15rem'
                                }}>
                                  {date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#64748B', fontWeight: 600 }}>
                                  {date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) !== '00:00'
                                    ? date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
                                    : 'מוכן לדיווח'}
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
          background: 'linear-gradient(90deg, #eff6ff 0%, #ecfdf5 100%)',
          borderTop: '1px solid #dbeafe'
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
              color: '#2563EB',
              borderColor: '#93c5fd',
              bgcolor: 'white',
              '&:hover': { 
                bgcolor: '#eff6ff',
                borderColor: '#60a5fa'
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
          ) : effectiveReportedDates.length === 0 ? (
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
                תאריכים שדווחו ({effectiveReportedDates.length}):
              </Typography>
              
              {(() => {
                // קיבוץ התאריכים לפי חודשים
                const datesByMonth = effectiveReportedDates.reduce((acc, dateItem) => {
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

      <Dialog
        open={commitmentsDialogOpen}
        onClose={handleCloseCommitmentsDialog}
        maxWidth="md"
        fullWidth
        PaperComponent={DraggablePaper}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(79,70,229,0.15)',
            direction: 'rtl'
          }
        }}
      >
        <DialogTitle
          className="drag-handle"
          sx={{
            bgcolor: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
            background: 'linear-gradient(90deg, #4f46e5 0%, #06b6d4 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'move'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragHandle />
            <AssignmentTurnedIn />
            <Typography variant="h6" component="span">התחייבויות תלמיד</Typography>
          </Box>
          <IconButton onClick={handleCloseCommitmentsDialog} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
          <br />
          {selectedStudentForCommitments && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 'bold', color: '#1d4ed8', textAlign: 'center' }}>
                תלמיד: {selectedStudentForCommitments.studentName || selectedStudentForCommitments.studentId}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={`סה"כ התחייבויות: ${Array.isArray(commitments) ? commitments.length : 0}`} color="primary" variant="outlined" />
              <Chip label={`התחייבויות בשימוש: ${Array.isArray(commitments) ? commitments.filter(c => (c.usedTreatments ?? c.UsedTreatments ?? 0) > 0).length : 0}`} color="success" variant="outlined" />
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={handleOpenAddCommitment}
              sx={{ borderRadius: '999px', direction: 'ltr' }}
            >
              הוסף התחייבות
            </Button>
          </Box>

          {commitmentsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(commitments) || commitments.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 'bold' }}>
                אין התחייבויות להצגה
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                ברגע שיוזנו התחייבויות אמיתיות בשרת הן יופיעו כאן.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {commitments.map((commitment, index) => (
                <Grid item xs={12} md={6} key={commitment.id || commitment.Id || commitment.commitmentId || commitment.CommitmentId || index}>
                  <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #c7d2fe', bgcolor: '#f8fafc' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#312e81', mb: 1 }}>
                      מספר התחייבות: {commitment.commitmentNumber || commitment.CommitmentNumber || '-'}
                    </Typography>
                    <Typography sx={{ color: '#334155' }}>
                      טיפולים בהתחייבות: {commitment.commitmentTreatments ?? commitment.CommitmentTreatments ?? '-'}
                    </Typography>
                    <Typography sx={{ color: '#334155' }}>
                      טיפולים שנוצלו: {commitment.usedTreatments ?? commitment.UsedTreatments ?? 0}
                    </Typography>
                    <Typography sx={{ color: '#334155' }}>
                      תאריך התחלה: {commitment.startDate || commitment.StartDate ? new Date(commitment.startDate || commitment.StartDate).toLocaleDateString('he-IL') : '-'}
                    </Typography>
                    <Typography sx={{ color: '#334155' }}>
                      תאריך סיום: {commitment.endDate || commitment.EndDate ? new Date(commitment.endDate || commitment.EndDate).toLocaleDateString('he-IL') : '-'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={(commitment.isActive ?? commitment.IsActive) ? 'פעילה' : 'לא פעילה'}
                        color={(commitment.isActive ?? commitment.IsActive) ? 'success' : 'default'}
                        size="small"
                      />
                      <Box>
                        <Tooltip title="עריכת התחייבות" arrow>
                          <IconButton size="small" color="primary" onClick={() => handleOpenEditCommitment(commitment)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="מחיקת התחייבות" arrow>
                          <IconButton size="small" color="error" onClick={() => handleDeleteCommitment(commitment.id ?? commitment.Id ?? commitment.commitmentId ?? commitment.CommitmentId)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    {(commitment.notes || commitment.Notes) && (
                      <Typography sx={{ color: '#475569', mt: 1 }}>
                        הערות: {commitment.notes || commitment.Notes}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, direction: 'rtl' }}>
          <Button variant="contained" onClick={handleCloseCommitmentsDialog} sx={{ borderRadius: '8px' }}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={commitmentFormOpen}
        onClose={handleCloseCommitmentForm}
        maxWidth="sm"
        fullWidth
        PaperComponent={DraggablePaper}
        PaperProps={{ sx: { borderRadius: '16px', direction: 'rtl' } }}
      >
        <DialogTitle className="drag-handle" sx={{ bgcolor: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'move' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragHandle />
            <AssignmentTurnedIn />
            <Typography component="span" variant="h6">{commitmentFormMode === 'edit' ? 'עריכת התחייבות' : 'הוספת התחייבות'}</Typography>
          </Box>
          <IconButton onClick={handleCloseCommitmentForm} sx={{ color: 'white' }} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="מספר התחייבות"
                fullWidth
                value={commitmentFormData.commitmentNumber}
                onChange={(e) => handleCommitmentFormChange('commitmentNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="מספר טיפולים בהתחייבות"
                type="number"
                fullWidth
                value={commitmentFormData.commitmentTreatments}
                onChange={(e) => handleCommitmentFormChange('commitmentTreatments', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="טיפולים שנוצלו"
                type="number"
                fullWidth
                value={commitmentFormData.usedTreatments}
                onChange={(e) => handleCommitmentFormChange('usedTreatments', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="סטטוס"
                fullWidth
                value={commitmentFormData.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleCommitmentFormChange('isActive', e.target.value === 'active')}
              >
                <MenuItem value="active">פעילה</MenuItem>
                <MenuItem value="inactive">לא פעילה</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="תאריך התחלה"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={commitmentFormData.startDate}
                onChange={(e) => handleCommitmentFormChange('startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="תאריך סיום"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={commitmentFormData.endDate}
                onChange={(e) => handleCommitmentFormChange('endDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="נתיב קובץ"
                fullWidth
                value={commitmentFormData.filePath}
                onChange={(e) => handleCommitmentFormChange('filePath', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="הערות"
                fullWidth
                multiline
                minRows={3}
                value={commitmentFormData.notes}
                onChange={(e) => handleCommitmentFormChange('notes', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseCommitmentForm}>ביטול</Button>
          <Button variant="contained" onClick={handleSaveCommitment} disabled={commitmentSaving} sx={{ direction: 'ltr' }} startIcon={<Save />}>
            {commitmentSaving ? 'שומר...' : 'שמור'}
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

      {/* דיאלוג פרטי תלמיד */}
      <StudentCoursesDialog
        open={studentDetailsDialogOpen}
        onClose={handleCloseStudentDetails}
        student={selectedStudentForDetails}
        studentCourses={studentCourses}
        loadingCourses={loadingStudentCourses}
        showAddButton={false}
        title={selectedStudentForDetails ? `${selectedStudentForDetails.firstName} ${selectedStudentForDetails.lastName}` : ''}
        subtitle={selectedStudentForDetails ? `ת"ז: ${selectedStudentForDetails.id}${selectedStudentForDetails.email ? ` | 📧 ${selectedStudentForDetails.email}` : ''}` : ''}
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
