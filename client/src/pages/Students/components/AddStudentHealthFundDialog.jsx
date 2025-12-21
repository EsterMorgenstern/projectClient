import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  Box,
  Typography,
  Grid,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  AddCircle,
  Close,
  Save,
  Person,
  CalendarMonth,
  AssignmentTurnedIn,
  Healing,
  CheckCircle,
  Event,
  Description,
  Info as InfoIcon
} from '@mui/icons-material';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DraggablePaper from '../../../components/DraggablePaper';
import { addStudentHealthFund } from '../../../store/studentHealthFund/studentHealthFundApi';
import { fetchStudentHealthFunds } from '../../../store/studentHealthFund/studentHealthFundApi';
import { fetchHealthFunds } from '../../../store/healthFund/fetchHealthFunds';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';

const AddStudentHealthFundDialog = ({ open, onClose, studentId, onSuccess }) => {
    // הגדרות משתנים ופונקציות חסרות
    // עיצוב ואייקונים כמו ב-StudentHealthFundTable.jsx
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
        label: '🚨 הו\'ק בוטלה',
        description: 'ההרשאה/אישור מקופת החולים בוטל'
      }
    ];

    const [healthFundChecklist, setHealthFundChecklist] = useState({
      noReferralSent: false,
      noEligibility: false,
      insufficientTreatments: false,
      treatmentsFinished: false,
      authorizationCancelled: false
    });
    const [additionalTreatmentsNeeded, setAdditionalTreatmentsNeeded] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState({});

    // פונקציה לטיפול בהערות נוספות לכל פריט בצ'קליסט
    const handleAdditionalNoteChange = (key, value) => {
      setAdditionalNotes(prev => ({ ...prev, [key]: value }));
    };

    const handleInputChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };


    // Refs to prevent duplicate automatic note creation per trigger (save/checklist)
    const autoNoteCreatedOnSaveRef = useRef(false);
    const autoNoteCreatedOnChecklistRef = useRef(false);

    // Checklist note creation: only create a note if the checked set changes and at least one is checked
    const lastChecklistRef = useRef({});
    const handleChecklistChange = async (key, checked) => {
      setHealthFundChecklist(prev => {
        const updated = { ...prev, [key]: checked };
        // Only create a note if the checked set changed and at least one is checked
        const prevChecked = Object.entries(lastChecklistRef.current).filter(([k, v]) => v).map(([k]) => k).sort().join(',');
        const updatedChecked = Object.entries(updated).filter(([k, v]) => v).map(([k]) => k).sort().join(',');
        if (updatedChecked && updatedChecked !== prevChecked) {
          createChecklistHealthFundNote(formData.studentId, updated);
        }
        lastChecklistRef.current = updated;
        return updated;
      });
    };

    // Checklist note logic (no 'commitment treatments' rule)
    const createChecklistHealthFundNote = async (studentId, checklistState) => {
      if (!studentId) return;
      const selectedHealthFund = memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(formData.healthFundId));
      const healthFundName = selectedHealthFund?.name || selectedHealthFund?.healthFundName || 'קופת חולים';
      let noteContent = `קופת החולים : ${healthFundName} \n\n`;
      const checkedItems = [];
      const checklist = checklistState || healthFundChecklist;
      if (checklist.noReferralSent) {
        const item = '🚫 לא שלחו הפניה';
        checkedItems.push(item);
        const additionalNote = additionalNotes.noReferralSent || '';
        noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
      }
      if (checklist.noEligibility) {
        const item = '❌ אין זכאות לטיפולים';
        checkedItems.push(item);
        const additionalNote = additionalNotes.noEligibility || '';
        noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
      }
      if (checklist.insufficientTreatments) {
        const item = '📊 מס\' הטיפולים בהתחייבות לא מספיק';
        checkedItems.push(item);
        const treatmentsNote = additionalTreatmentsNeeded ? ` - יש לשלוח התחייבות חדשה עם ${additionalTreatmentsNeeded} טיפולים נוספים` : '';
        const additionalNote = additionalNotes.insufficientTreatments || '';
        noteContent += `${item}${treatmentsNote}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
      }
      if (checklist.treatmentsFinished) {
        const item = '🔚 נגמרו הטיפולים';
        checkedItems.push(item);
        const additionalNote = additionalNotes.treatmentsFinished || '';
        noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
      }
      if (checklist.authorizationCancelled) {
        const item = '🚨 הו\'ק בוטלה';
        checkedItems.push(item);
        const additionalNote = additionalNotes.authorizationCancelled || '';
        noteContent += `${item}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
      }
      if (checkedItems.length > 0) {
        const currentDate = new Date().toISOString();
        const noteData = {
          studentId: parseInt(studentId),
          authorId: currentUser?.id || currentUser?.userId,
          authorName: currentUser?.name || currentUser?.firstName + ' ' + currentUser?.lastName,
          authorRole: currentUser?.role,
          noteContent: noteContent,
          dateCreated: currentDate,
          createdDate: currentDate,
          created: currentDate,
          date: currentDate,
          noteType: 'הערת גביה',
          priority: 'בינוני',
          isPrivate: false,
          isActive: true
        };
        try {
          await dispatch(addStudentNote(noteData)).unwrap();
        } catch (error) {
          // Optionally show error
        }
      }
    };

    // Create the 'commitment treatments' note (on save), and append only unique checklist notes if any
    const createAutomaticHealthFundNotes = async (studentId) => {
      if (!studentId) return;
      const selectedHealthFund = memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(formData.healthFundId));
      if (
        Number(formData.registeredTreatments) > Number(formData.commitmentTreatments) &&
        selectedHealthFund &&
        (selectedHealthFund.healthFundName === 'מאוחדת' || selectedHealthFund.name === 'מאוחדת')
      ) {
        // Prevent duplicate note: check if such a note already exists for this student
        const state = window.store ? window.store.getState() : null;
        const studentNotes = state?.studentNotes?.items || [];
        const alreadyExists = studentNotes.some(note =>
          note.studentId === parseInt(studentId) &&
          note.noteContent && note.noteContent.includes('הערת גביה אוטומטית: מס׳ הטיפולים בהתחייבות נמוך ממס׳ הטיפולים שנרשמו')
        );
        if (!alreadyExists) {
          const currentDate = new Date().toISOString();
          let noteContent = 'הערת גביה אוטומטית: מס׳ הטיפולים בהתחייבות נמוך ממס׳ הטיפולים שנרשמו';
          // Get checklist items already present in checklist notes for this student
          const checklistNotes = studentNotes.filter(note =>
            note.studentId === parseInt(studentId) &&
            note.noteContent && !note.noteContent.includes('הערת גביה אוטומטית: מס׳ הטיפולים בהתחייבות נמוך ממס׳ הטיפולים שנרשמו')
          ).map(note => note.noteContent).join('\n');
          
          const noteData = {
            studentId: parseInt(studentId),
            authorId: currentUser?.id || currentUser?.userId,
            authorName: currentUser?.name || currentUser?.firstName + ' ' + currentUser?.lastName,
            authorRole: currentUser?.role,
            noteContent,
            dateCreated: currentDate,
            createdDate: currentDate,
            created: currentDate,
            date: currentDate,
            noteType: 'הערת גביה',
            priority: 'בינוני',
            isPrivate: false,
            isActive: true
          };
          try {
            await dispatch(addStudentNote(noteData)).unwrap();
          } catch (error) {
            // Optionally show error
          }
        }
      }
    };

    // Helper to build checklist note for auto note, only add items not already present in checklistNotes
    const buildChecklistNoteForAuto = (checklistNotes = '') => {
      const selectedHealthFund = memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(formData.healthFundId));
      const healthFundName = selectedHealthFund?.name || selectedHealthFund?.healthFundName || 'קופת חולים';
      let noteContent = '';
      let hasAny = false;
      if (healthFundChecklist.noReferralSent) {
        const item = '🚫 לא שלחו הפניה';
        const additionalNote = additionalNotes.noReferralSent || '';
        const fullItem = `${item}${additionalNote ? ` - ${additionalNote}` : ''}`;
        if (!checklistNotes.includes(fullItem)) {
          hasAny = true;
          noteContent += `${fullItem}\n`;
        }
      }
      if (healthFundChecklist.noEligibility) {
        const item = '❌ אין זכאות לטיפולים';
        const additionalNote = additionalNotes.noEligibility || '';
        const fullItem = `${item}${additionalNote ? ` - ${additionalNote}` : ''}`;
        if (!checklistNotes.includes(fullItem)) {
          hasAny = true;
          noteContent += `${fullItem}\n`;
        }
      }
      if (healthFundChecklist.insufficientTreatments) {
        const item = '📊 מס\' הטיפולים בהתחייבות לא מספיק';
        const treatmentsNote = additionalTreatmentsNeeded ? ` - יש לשלוח התחייבות חדשה עם ${additionalTreatmentsNeeded} טיפולים נוספים` : '';
        const additionalNote = additionalNotes.insufficientTreatments || '';
        const fullItem = `${item}${treatmentsNote}${additionalNote ? ` - ${additionalNote}` : ''}`;
        if (!checklistNotes.includes(fullItem)) {
          hasAny = true;
          noteContent += `${fullItem}\n`;
        }
      }
      if (healthFundChecklist.treatmentsFinished) {
        const item = '🔚 נגמרו הטיפולים';
        const additionalNote = additionalNotes.treatmentsFinished || '';
        const fullItem = `${item}${additionalNote ? ` - ${additionalNote}` : ''}`;
        if (!checklistNotes.includes(fullItem)) {
          hasAny = true;
          noteContent += `${fullItem}\n`;
        }
      }
      if (healthFundChecklist.authorizationCancelled) {
        const item = '🚨 הו\'ק בוטלה';
        const additionalNote = additionalNotes.authorizationCancelled || '';
        const fullItem = `${item}${additionalNote ? ` - ${additionalNote}` : ''}`;
        if (!checklistNotes.includes(fullItem)) {
          hasAny = true;
          noteContent += `${fullItem}\n`;
        }
      }
      return hasAny ? noteContent : '';
    };
  const dispatch = useDispatch();
  useEffect(() => {
  if (open) {
    dispatch(fetchHealthFunds());
  }
}, [open, dispatch]);
  
  // קבלת רשימת קופות חולים מהסטייט עם לוג
const healthFundList = useSelector(state => {
  const list = (state.healthFunds && state.healthFunds.items) ? state.healthFunds.items : [];
  console.log('🔍 Redux healthFunds.items:', list);
  return list;
});
const memoizedHealthFundList = useMemo(() => {
  console.log('🔍 memoizedHealthFundList:', healthFundList);
  return Array.isArray(healthFundList) ? healthFundList : [];
}, [healthFundList]);
  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
  });

  // תאריך התחלה אוטומטי
  const getTodayDate = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    studentId: studentId ? String(studentId) : '',
    healthFundId: '',
    startDate: getTodayDate(),
    treatmentsUsed: '0',
    commitmentTreatments: '0',
    reportedTreatments: '0',
    registeredTreatments: '0',
    referralFilePath: '',
    commitmentFilePath: '',
    notes: ''
  });

  // עדכון קוד תלמיד אוטומטי אם משתנה ה-prop
  useEffect(() => {
    if (studentId) {
      setFormData(prev => ({ ...prev, studentId: String(studentId) }));
    }
  }, [studentId]);

  // עדכון תאריך התחלה אוטומטי בכל פתיחה
  useEffect(() => {
    if (open) {
      setFormData(prev => ({ ...prev, startDate: getTodayDate() }));
    }
  }, [open]);

  // כאשר בוחרים קופה, נטען אוטומטית את מספר הטיפולים וההתחייבות
  useEffect(() => {
    if (formData.healthFundId && memoizedHealthFundList.length > 0) {
      const selectedFund = memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(formData.healthFundId));
      if (selectedFund) {
        setFormData(prev => ({
          ...prev,
          commitmentTreatments: selectedFund.maxTreatmentsPerYear ? String(selectedFund.maxTreatmentsPerYear) : '',
          registeredTreatments: selectedFund.maxTreatmentsPerYear ? String(selectedFund.maxTreatmentsPerYear) : '',
        }));
      }
    }
  }, [formData.healthFundId, memoizedHealthFundList]);
  
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  // איפוס טופס אחרי שמירה
  // Reset autoNoteCreated refs on dialog open/close
  useEffect(() => {
    if (open) {
      autoNoteCreatedOnSaveRef.current = false;
      autoNoteCreatedOnChecklistRef.current = false;
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperComponent={DraggablePaper}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle
        className="drag-handle"
        sx={{
          bgcolor: '#43E97B',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl',
          cursor: 'move',
          '&:hover': { bgcolor: '#38F9D7' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddCircle />
          <Typography variant="h6" component="span">רישום תלמיד לקופת חולים</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }} size="small"><Close /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, direction: 'rtl' }}>
        <Box sx={{ background: '#e3f2fd', px: 2, py: 1.5, borderRadius: 2, display: 'flex', alignItems: 'center', mb: 3 }}>
          <InfoIcon sx={{ color: '#1976d2', mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#1976d2' }}>
            הערה: כאשר מכניסים תלמיד חדש, אוטומטית כל השיעורים שהוא היה בהם יסומנו כטיפולים שעדיין לא דווחו.
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ direction: 'rtl' }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="health-fund-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
                  <AddCircle sx={{ color: '#1976d2' }} />
                  <span>קופה</span>
                  <span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span>
                </Box>
              </InputLabel>
              <Select
                labelId="health-fund-label"
                value={formData.healthFundId === undefined || formData.healthFundId === null ? '' : String(formData.healthFundId)}
                label="קופה *"
                onChange={e => handleInputChange('healthFundId', e.target.value)}
                sx={{ background: '#fff' }}
                displayEmpty
                renderValue={selected => selected ? (memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(selected))?.healthFundName || memoizedHealthFundList.find(fund => String(fund.healthFundId || fund.id) === String(selected))?.name || '') : ''}
              >
                {memoizedHealthFundList.length === 0 ? (
                  <MenuItem value="" disabled>
                    אין קופות זמינות
                  </MenuItem>
                ) : (
                  memoizedHealthFundList.map(fund => (
                    <MenuItem key={fund.healthFundId || fund.id} value={String(fund.healthFundId || fund.id)}>
                      {(fund.healthFundName || fund.name) + (fund.fundType ? ` - ${fund.fundType}` : '')}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Person sx={{ color: '#1976d2' }} /> <span>קוד תלמיד</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
              fullWidth
              value={formData.studentId}
              onChange={e => handleInputChange('studentId', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><CalendarMonth sx={{ color: '#1976d2' }} /> <span>תאריך התחלה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
              type="date"
              fullWidth
              value={formData.startDate}
              onChange={e => handleInputChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#ef6c00' }} /> <span>טיפולים שלא דווחו</span></Box>}
              type="number"
              fullWidth
              value={formData.treatmentsUsed}
              onChange={e => handleInputChange('treatmentsUsed', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Healing sx={{ color: '#388e3c' }} /> <span>טיפולים עם התחייבות</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
              type="number"
              fullWidth
              value={formData.commitmentTreatments}
              onChange={e => handleInputChange('commitmentTreatments', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><CheckCircle sx={{ color: '#388e3c' }} /> <span>טיפולים שדווחו</span></Box>}
              type="number"
              fullWidth
              value={formData.reportedTreatments}
              onChange={e => handleInputChange('reportedTreatments', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Event sx={{ color: '#1976d2' }} /> <span>מס' טיפולים רשומים</span></Box>}
              type="number"
              fullWidth
              value={formData.registeredTreatments}
              onChange={e => handleInputChange('registeredTreatments', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#1976d2' }} /> <span>קובץ הפניה (נתיב)</span></Box>}
              fullWidth
              value={formData.referralFilePath}
              onChange={e => handleInputChange('referralFilePath', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Description sx={{ color: '#1976d2' }} /> <span>קובץ התחייבות (נתיב)</span></Box>}
              fullWidth
              value={formData.commitmentFilePath}
              onChange={e => handleInputChange('commitmentFilePath', e.target.value)}
              inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              sx={{ background: '#fff' }}
            />
          </Grid>
          {/* Checklist section */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ color: '#374151', textAlign: 'right', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span role="img" aria-label="money">💲</span>
              הערות גביה אוטומטיות
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', textAlign: 'right', mb: 2, fontSize: '0.92rem' }}>
              סמן את הבעיות הרלוונטיות. הערות שיסומנו יתווספו אוטומטית כהערת גביה לתלמיד
            </Typography>
            <Box sx={{ mb: 2, background: 'transparent', borderRadius: 2, p: 0 }}>
              {checklistItems.map(item => {
                const checked = healthFundChecklist[item.key];
                return (
                  <Box key={item.key} sx={{
                    mb: 2,
                    borderRadius: '16px',
                    border: checked ? '1.5px solid #A7F3D0' : '1.5px solid #FECACA',
                    background: checked ? '#ECFDF5' : '#FEF2F2',
                    boxShadow: checked ? '0 2px 8px rgba(16,185,129,0.08)' : '0 2px 8px rgba(239,68,68,0.08)',
                    transition: 'all 0.2s',
                    p: 0,
                    position: 'relative',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                        <Typography variant="h6" sx={{
                          color: checked ? '#059669' : '#DC2626',
                          fontWeight: 700,
                          mb: 0.5,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.88rem' }}>
                          {item.description}
                        </Typography>
                      </Box>
                      <Checkbox
                        checked={checked}
                        onChange={e => handleChecklistChange(item.key, e.target.checked)}
                        sx={{
                          color: checked ? '#22C55E' : '#D1D5DB',
                          '&.Mui-checked': { color: '#22C55E' },
                          ml: 2,
                          borderRadius: '8px',
                          boxShadow: checked ? '0 0 0 2px #A7F3D0' : 'none',
                          transition: 'all 0.2s',
                        }}
                        icon={
                          <Box sx={{
                            width: 24, height: 24, border: '2px solid #D1D5DB', borderRadius: '6px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }} />
                        }
                        checkedIcon={
                          <Box sx={{
                            width: 24, height: 24, border: '2px solid #22C55E', borderRadius: '6px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 9.5L8 12.5L13 7.5" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Box>
                        }
                      />
                    </Box>
                    {checked && (
                      <Box sx={{
                        bgcolor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
                        border: '1.5px solid #A7F3D0',
                        mx: { xs: 1, sm: 3 },
                        mb: 2,
                        p: 2,
                        mt: 0,
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                      }}>
                        {(item.key === 'insufficientTreatments') ? (
                          <TextField
                            margin="normal"
                            label="כמה טיפולים נוספים צריך?"
                            fullWidth
                            value={additionalTreatmentsNeeded}
                            onChange={e => setAdditionalTreatmentsNeeded(e.target.value)}
                            sx={{ background: '#F8FAFC', borderRadius: '8px' }}
                            InputProps={{
                              style: { direction: 'rtl', textAlign: 'right', fontSize: '1.05rem' }
                            }}
                          />
                        ) : (
                          <TextField
                            margin="normal"
                            label="הערה נוספת"
                            fullWidth
                            value={additionalNotes[item.key] || ''}
                            onChange={e => handleAdditionalNoteChange(item.key, e.target.value)}
                            sx={{ background: '#F8FAFC', borderRadius: '8px',direction:'rtl' }}
                            InputProps={{
                              style: { direction: 'rtl', textAlign: 'right', fontSize: '1.05rem' }
                            }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        </Grid>
      
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
        <Button variant="outlined" color="error" onClick={() => { resetForm(); onClose(); }} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
        <Button variant="contained" startIcon={<Save />} onClick={async () => {
          setSaving(true);
          try {
            const payload = {
              ...formData,
              checklist: { ...healthFundChecklist },
              additionalTreatmentsNeeded,
              additionalNotes
            };
            const result = await dispatch(addStudentHealthFund(payload));
            // Always try to create automatic notes on save as well, but only once per dialog session for save
            if (!autoNoteCreatedOnSaveRef.current) {
              await createAutomaticHealthFundNotes(formData.studentId);
              autoNoteCreatedOnSaveRef.current = true;
            }
            if (addStudentHealthFund.fulfilled.match(result)) {
              setNotification({ open: true, message: 'הרישום לקופת חולים התבצע בהצלחה', severity: 'success' });
              if (onSuccess) onSuccess(result.payload);
              resetForm();
              onClose();
            } else {
              let errorMsg = 'שגיאה ברישום לקופת חולים';
              if (result && result.payload) {
                if (typeof result.payload === 'string') {
                  errorMsg = result.payload;
                } else if (typeof result.payload === 'object') {
                  errorMsg = result.payload.message || result.payload.title || JSON.stringify(result.payload);
                }
              }
              setNotification({ open: true, message: errorMsg, severity: 'error' });
            }
          } catch (err) {
            setNotification({ open: true, message: 'שגיאה ברישום לקופת חולים', severity: 'error' });
          }
          setSaving(false);
        }} disabled={saving} sx={{ borderRadius: '8px', px: 3, py: 1, direction: 'ltr', bgcolor: '#43E97B', boxShadow: '0 4px 14px rgba(67,233,123,0.3)', '&:hover': { bgcolor: '#38F9D7' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>
          שמור
        </Button>
      </DialogActions>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
export default AddStudentHealthFundDialog;
