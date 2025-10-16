import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Tooltip, Divider, MenuItem, ListItemIcon, ListItemText, FormControlLabel, Checkbox } from '@mui/material';
import { motion } from 'framer-motion';
import { AddCircle, Person, LocalHospital, CalendarMonth, Healing, AssignmentTurnedIn, Description, Note, Save, Close, Face, LocationCity, Groups, Event, Check as CheckIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';
import StudentNotesDialog from '../Students/components/StudentNotesDialog';
import { fetchStudentHealthFunds } from '../../store/studentHealthFund/fetchStudentHealthFunds';
import { addStudentHealthFund } from '../../store/studentHealthFund/addStudentHealthFund';
import { updateStudentHealthFund } from '../../store/studentHealthFund/updateStudentHealthFund';
import { deleteStudentHealthFund } from '../../store/studentHealthFund/deleteStudentHealthFund';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddStudentNoteDialog from '../Students/components/addStudentNoteDialog';
import { getNotesByStudentId } from '../../store/studentNotes/studentNotesGetById';
import { updateStudentNote } from '../../store/studentNotes/studentNoteUpdateThunk';
import { addStudentNote } from '../../store/studentNotes/studentNoteAddThunk';
import { deleteStudentNote } from '../../store/studentNotes/studentNoteDeleteThunk';
import { checkUserPermission } from '../../utils/permissions';

// Styled table container inspired by instructorsTable and Home


const StudentHealthFundTable = () => {
  // Dialog for health fund details
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const handleOpenFundDialog = (row) => {
    const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
    setSelectedFund(fund || null);
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
    // אם אין משתמש, נחזיר את פרטי המשתמש הנוכחי מהלוגים
    if (!user) {
      return { 
        id: 329235618, // ID של אסתר מורגנשטרן מהלוגים
        firstName: 'אסתר', 
        lastName: 'מורגנשטרן', 
        role: 'מנהל' 
      };
    }
    
    return {
      id: parseInt(user.id || user.userId) || 329235618, // וודא שה-ID הוא מספר
      firstName: user.firstName || user.first_name || 'אסתר',
      lastName: user.lastName || user.last_name || 'מורגנשטרן', 
      role: user.role || user.userRole || 'מנהל'
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
    treatmentsUsed: '',
    commitmentTreatments: '',
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
    dispatch(fetchStudentHealthFunds());
  }, [dispatch]);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      studentId: '',
      healthFundId: '',
      startDate: '',
      treatmentsUsed: '',
      commitmentTreatments: '',
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
      requiredFields.push('טיפולים בשימוש');
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

  return (
  <Box sx={{ bgcolor: 'transparent', p: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', textAlign: 'right', ml: 2 }}>
        ניהול גביה תלמידים
      </Typography>
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
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', background: 'white', p: 0 }}>
      <Table sx={{ minWidth: 1400 }}>
          <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Person sx={{ color: '#2563EB' }} />
                  <span>קוד תלמיד</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Face sx={{ color: '#43E97B' }} />
                  <span>שם תלמיד</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Face sx={{ color: '#764ba2' }} />
                  <span>גיל</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocationCity sx={{ color: '#38F9D7' }} />
                  <span>עיר</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Event sx={{ color: '#F59E42' }} />
                  <span>תאריך התחלה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Groups sx={{ color: '#667eea' }} />
                  <span>שם קבוצה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocalHospital sx={{ color: '#764ba2' }} />
                  <span>קופה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CalendarMonth sx={{ color: '#38F9D7' }} />
                  <span>תאריך יצירה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Healing sx={{ color: '#F59E42' }} />
                  <span>טיפולים בשימוש</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AssignmentTurnedIn sx={{ color: '#667eea' }} />
                  <span>התחייבות טיפולים</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Description sx={{ color: '#2563EB' }} />
                  <span>קובץ הפניה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Description sx={{ color: '#764ba2' }} />
                  <span>קובץ התחייבות</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Note sx={{ color: '#F59E42' }} />
                  <span>הערות</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <EditIcon sx={{ color: 'white' }} />
                  <span>פעולות</span>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(10)].map((__, i) => (
                    <TableCell key={i}><Skeleton variant="rectangular" height={24} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : healthFunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="h6" color="text.secondary">אין נתונים להצגה</Typography>
                </TableCell>
              </TableRow>
            ) : (
              healthFunds.map((row, idx) => (
                <TableRow
                  key={row.id || `row-${idx}`}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  sx={{ background: idx % 2 === 0 ? '#f8fafc' : '#e2e8f0', height: 36 }}
                >
                  <TableCell align="center">{row.studentId}</TableCell>
                  <TableCell align="center">{row.studentName || '-'}</TableCell>
                  <TableCell align="center">{row.age ?? '-'}</TableCell>
                  <TableCell align="center">{row.city || '-'}</TableCell>
                  <TableCell align="center">{row.startDateGroup ? new Date(row.startDateGroup).toLocaleDateString('he-IL') : '-'}</TableCell>
                  <TableCell align="center" sx={{ p: 0.5 }}>
                    {row.groupName ? (
                      <Tooltip title={row.groupName} arrow>
                        <span style={{ cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word', direction: 'rtl', textAlign: 'right', display: 'inline-block', maxWidth: 120 }}>
                          {(() => {
                            const words = row.groupName.split(' ');
                            const shown = words.slice(0, 3).join(' ');
                            const rest = words.slice(3).join(' ');
                            return rest
                              ? <>{shown} <span style={{ color: '#888', fontWeight: 400 }}>...</span></>
                              : <>{shown}</>;
                          })()}
                        </span>
                      </Tooltip>
                    ) : '-' }
                  </TableCell>
                  <TableCell align="center">
                    {(() => {
                      const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
                      return fund ? `${fund.name} ${fund.fundType}` : row.healthFundId;
                    })()}
                  </TableCell>
                  <TableCell align="center">{new Date(row.startDate).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell align="center">{row.treatmentsUsed}</TableCell>
                  <TableCell align="center">{row.commitmentTreatments}</TableCell>
                  <TableCell align="center">{row.referralFilePath ? <Chip label="קיים" color="primary" /> : <Chip label="אין" color="default" />}</TableCell>
                  <TableCell align="center">{row.commitmentFilePath ? <Chip label="קיים" color="primary" /> : <Chip label="אין" color="default" />}</TableCell>
                  <TableCell align="center">{row.notes}</TableCell>
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
        <DialogTitle sx={{
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
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          {selectedFund ? (
            <Box sx={{
              bgcolor: 'white',
              borderRadius: 0,
              p: 3,
              boxShadow: 'none',
              minWidth: 320,
              border: 'none',
            }}>
              <Typography variant="h5" sx={{ color: '#2563EB', fontWeight: 'bold', mb: 2, textAlign: 'center', letterSpacing: 1 }}>{selectedFund.name}</Typography>
              <Divider sx={{ mb: 2, bgcolor: '#e3f0ff' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>סוג:</b> {selectedFund.fundType}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מקסימום טיפולים בשנה:</b> {selectedFund.maxTreatmentsPerYear}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מחיר לשיעור:</b> {selectedFund.pricePerLesson}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מחיר חודשי:</b> {selectedFund.monthlyPrice}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>הפניה נדרשת:</b> <Chip label={selectedFund.requiresReferral ? 'כן' : 'לא'} color={selectedFund.requiresReferral ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.requiresReferral ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>התחייבות נדרשת:</b> <Chip label={selectedFund.requiresCommitment ? 'כן' : 'לא'} color={selectedFund.requiresCommitment ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.requiresCommitment ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>פעילה:</b> <Chip label={selectedFund.isActive ? 'כן' : 'לא'} color={selectedFund.isActive ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.isActive ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
              </Grid>
            </Box>
          ) : (
            <Typography color="error">לא נמצאו פרטי קופה</Typography>
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
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                <TextField label="קופה" fullWidth variant="outlined" value={editFormData.healthFundId} onChange={e => handleEditInputChange('healthFundId', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="תאריך התחלה" type="date" fullWidth variant="outlined" value={editFormData.startDate} onChange={e => handleEditInputChange('startDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים בשימוש" type="number" fullWidth variant="outlined" value={editFormData.treatmentsUsed} onChange={e => handleEditInputChange('treatmentsUsed', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="התחייבות טיפולים" type="number" fullWidth variant="outlined" value={editFormData.commitmentTreatments} onChange={e => handleEditInputChange('commitmentTreatments', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
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
        <DialogTitle sx={{
          bgcolor: 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
          color: '#b71c1c',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
          direction: 'rtl',
          textAlign: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 2px 8px rgba(237,66,69,0.10)'
        }}>
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
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddCircle />
            <Typography variant="h6" component="span">הוספת סטודנט-קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseAddDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
          <br />
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
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><LocalHospital sx={{ color: '#764ba2' }} /> <span>קופה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
                fullWidth
                variant="outlined"
                value={formData.healthFundId}
                onChange={e => handleInputChange('healthFundId', e.target.value)}
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
                SelectProps={{ native: false, renderValue: (selected) => {
                  const fund = Array.isArray(healthFundList) ? healthFundList.find(f => String(f.healthFundId) === String(selected)) : null;
                  return fund ? `${fund.name} (${fund.fundType})` : '';
                }}}
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
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Healing sx={{ color: '#F59E42' }} /> <span>טיפולים בשימוש</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
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
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#667eea' }} /> <span>התחייבות טיפולים</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.commitmentTreatments} 
                onChange={e => handleInputChange('commitmentTreatments', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
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
    </Box>
  );
};

export default StudentHealthFundTable;
