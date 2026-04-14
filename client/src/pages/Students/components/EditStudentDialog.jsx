import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Edit as EditIcon, 
  Check as CheckIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { editStudent } from '../../../store/student/studentEditThunk';
import { getNotesByStudentId } from '../../../store/studentNotes/studentNotesGetById';
import { fetchHealthFunds } from '../../../store/healthFund/fetchHealthFunds';
import { checkUserPermission } from '../../../utils/permissions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

const EditStudentDialog = ({ open, onClose, student, onStudentUpdated }) => {
  // Notification Snackbar state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success', action: null });
  // קבלת המשתמש הנוכחי מה-redux
  const currentUser = useSelector(state => state.user?.currentUser || state.users?.currentUser || null);
  // קבלת רשימת קופות החולים מה-redux
  const healthFunds = useSelector(state => state.healthFunds?.items || []);
  const healthFundsLoading = useSelector(state => state.healthFunds?.loading || false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
  id: '',
  IdentityCard: '',
    firstName: '',
    lastName: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    age: '',
    city: '',
    school: '',
    healthFundId: null,
    healthFundName: '',
    healthFundPlan: '',
    class: '',
    sector: '',
    status: '',
    createdBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [studentNotes, setStudentNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  // טעינת רשימת קופות החולים כשהדיאלוג נפתח
  useEffect(() => {
    if (open) {
      dispatch(fetchHealthFunds());
    }
  }, [open, dispatch]);

    // אפשרויות גיל עם אייקונים
  const ageOptions = [
    { value: 5, label: '🎂 בן 5', icon: '🎂' },
    { value: 6, label: '🎂 בן 6', icon: '🎂' },
    { value: 7, label: '🎂 בן 7', icon: '🎂' },
    { value: 8, label: '🎂 בן 8', icon: '🎂' },
    { value: 9, label: '🎂 בן 9', icon: '🎂' },
    { value: 10, label: '🎂 בן 10', icon: '🎂' },
    { value: 11, label: '🎂 בן 11', icon: '🎂' },
    { value: 12, label: '🎂 בן 12', icon: '🎂' },
    { value: 13, label: '🎂 בן 13', icon: '🎂' }
  ];

  // אפשרויות כיתה עם אייקונים - ללא כפילויות
  const classOptions = [
    { value: 'מכינה', label: '👶 מכינה', icon: '👶' },
    { value: 'כיתה א׳', label: '📚 כיתה א׳', icon: '📚' },
    { value: 'כיתה ב׳', label: '📖 כיתה ב׳', icon: '📖' },
    { value: 'כיתה ג׳', label: '📝 כיתה ג׳', icon: '📝' },
    { value: 'כיתה ד׳', label: '📋 כיתה ד׳', icon: '📋' },
    { value: 'כיתה ה׳', label: '📊 כיתה ה׳', icon: '📊' },
    { value: 'כיתה ו׳', label: '📈 כיתה ו׳', icon: '📈' },
    { value: 'כיתה ז׳', label: '🎓 כיתה ז׳', icon: '🎓' },

  ];

  // אפשרויות מגזר עם אייקונים
  const sectorOptions = [
    { value: 'כללי', label: '🌍 כללי', icon: '🌍' },
    { value: 'חסידי', label: '🌍 חסידי', icon: '🌍' },
    { value: 'גור', label: '🌍 גור', icon: '🌍' },
    { value: 'ליטאי', label: '🌍 ליטאי', icon: '🌍' }
  ];

  // אפשרויות סטטוס עם אייקונים וצבעים
  const statusOptions = [
    { value: 'פעיל', label: '✅ פעיל', icon: '✅', color: '#10b981' },
    { value: 'ליד', label: '⏳ ליד', icon: '⏳', color: '#f59e0b' },
    { value: 'לא רלוונטי', label: '❌ לא רלוונטי', icon: '❌', color: '#ef4444' }
  ];

  const noteTypes = [
    { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
    { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
    { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
    { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon }
  ];
  const priorities = [
    { value: 'נמוך', label: 'נמוך', color: '#6b7280' },
    { value: 'בינוני', label: 'בינוני', color: '#d97706' },
    { value: 'גבוה', label: 'גבוה', color: '#dc2626' }
  ];

  useEffect(() => {
    if (student && open) {
      console.log('🔍 Student data received in EditDialog:', student);
      console.log('📧 Email field values:', {
        student_email: student.email,
        student_mail: student.mail,
        student_emailAddress: student.emailAddress
      });
      console.log('📚 Class field values:', {
        student_class: student.class,
        student_className: student.className,
        student_grade: student.grade,
        student_classLevel: student.classLevel
      });
      
      // Function to normalize class value
      const normalizeClass = (classValue) => {
        if (!classValue) return '';
        
        const classStr = String(classValue).trim();
        
        // Check if it's already in the correct format
        const exactMatch = classOptions.find(option => option.value === classStr);
        if (exactMatch) return classStr;
        
        // Try to find a partial match and convert to standard format
        const lowerClass = classStr.toLowerCase();
        
        if (lowerClass.includes('מכינה')) return 'מכינה';
        if (lowerClass.includes('א') || lowerClass === '1') return 'כיתה א׳';
        if (lowerClass.includes('ב') || lowerClass === '2') return 'כיתה ב׳';
        if (lowerClass.includes('ג') || lowerClass === '3') return 'כיתה ג׳';
        if (lowerClass.includes('ד') || lowerClass === '4') return 'כיתה ד׳';
        if (lowerClass.includes('ה') || lowerClass === '5') return 'כיתה ה׳';
        if (lowerClass.includes('ו') || lowerClass === '6') return 'כיתה ו׳';
        if (lowerClass.includes('ז') || lowerClass === '7') return 'כיתה ז׳';
        
        return classStr; // Return as-is if no match found
      };
      
      // Enhanced data mapping with better fallbacks and validation
      const studentData = {
        id: student.id || student.studentId || '',
        firstName: student.firstName || student.firstname || student.studentName?.split(' ')[0] || '',
        lastName: student.lastName || student.lastname || student.studentName?.split(' ').slice(1).join(' ') || '',
        phone: student.phone || '',
        secondaryPhone: student.secondaryPhone || student.secondary_phone || student.phoneSecondary || '',
        email: student.email || student.mail || student.emailAddress || '',
        age: student.age || '',
        city: student.city || '',
        school: student.school || '',
        healthFundId: student.healthFundId || null,
        healthFundName: student.healthFundName || '',
        healthFundPlan: student.healthFundPlan || '',
        class: normalizeClass(student.class || student.className || student.grade || student.classLevel),
        sector: student.sector || '',
        status: student.status || (student.isActive !== undefined ? (student.isActive ? 'פעיל' : 'לא פעיל') : ''),
        createdBy: student.createdBy || '',
        IdentityCard: student.IdentityCard || student.identityCard || ''
      };
      
      console.log('🎯 Mapped student data for form:', studentData);
      
      // Check if all required fields are present
      const required = ['id', 'firstName', 'lastName', 'phone', 'age', 'city'];
      const missingRequiredFields = required.filter(field => !studentData[field] || studentData[field].toString().trim() === '');
      
      if (missingRequiredFields.length > 0) {
        console.warn('⚠️ Missing required fields:', missingRequiredFields);
        setError(`שדות חסרים בנתוני התלמיד: ${missingRequiredFields.join(', ')}`);
      } else {
        setError(''); // Clear any previous errors
      }
      
      setFormData(studentData);
    }
  }, [student, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    const required = ['id', 'firstName', 'lastName', 'phone', 'age', 'city'];
    const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!(checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setError(msg)))) return;

    if (!validateForm()) {
      const required = ['id', 'firstName', 'lastName', 'phone', 'age', 'city'];
      const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
      setError(`נא למלא את השדות הנדרשים: ${missingFields.join(', ')}`);
      setNotification({
        open: true,
        message: `נא למלא את השדות הנדרשים: ${missingFields.join(', ')}`,
        severity: 'error',
        action: null
      });
      return;
    }

    setLoading(true);
    setError(''); // Clear any previous errors
    
    try {
      const studentData = {
        id: formData.id,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        phone: (formData.phone || '').toString(),
        secondaryPhone: formData.secondaryPhone || '',
        email: formData.email || '',
        age: parseInt(formData.age) || 0,
        city: formData.city || '',
        school: formData.school || '',
        healthFundId: formData.healthFundId || null,
        class: formData.class || '',
        sector: formData.sector || '',
        status: formData.status || 'ליד',
        createdBy: formData.createdBy || '',
        IdentityCard: formData.IdentityCard || ''
      };

      console.log('Sending student data for update:', studentData);
      console.log('FormData before send:', formData);
      console.log('StudentData keys:', Object.keys(studentData));

      if (!(checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setError(msg)))) return;
      const result = await dispatch(editStudent({
        studentId: formData.id,
        ...studentData
      })).unwrap();

      console.log('Student update successful:', result);

      if (onStudentUpdated) {
        onStudentUpdated(result);
      }
      // setNotification({
      //   open: true,
      //   message: 'התלמיד עודכן בהצלחה',
      //   severity: 'success',
      //   action: null
      // });
      // setTimeout(() => {
      //   onClose();
      // }, 1200);
      
    } catch (error) {
      console.error('Error updating student:', error);
      let errorMsg = '';
      if (error.message) {
        errorMsg = `שגיאה בעדכון פרטי התלמיד: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMsg = `שגיאה בעדכון פרטי התלמיד: ${error}`;
      } else {
        errorMsg = 'שגיאה בעדכון פרטי התלמיד. אנא נסה שוב.';
      }
      setError(errorMsg);
      setNotification({
        open: true,
        message: errorMsg,
        severity: 'error',
        action: null
      });
    } finally {
      setLoading(false);
    }
  };
  // Notification Snackbar close handler
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  // const handleRefreshNotes = async () => {
  //   setNotesLoading(true);
  //   try {
  //     const result = await dispatch(getNotesByStudentId(formData.id)).unwrap();
  //     setStudentNotes(result || []);
  //   } catch (error) {
  //     setStudentNotes([]);
  //   } finally {
  //     setNotesLoading(false);
  //   }
  // };

  const handleClose = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      secondaryPhone: '',
      email: '',
      age: '',
      city: '',
      school: '',
      healthFundId: null,
      healthFundName: '',
      healthFundPlan: '',
      class: '',
      sector: '',
      status: '',
      createdBy: '',
      IdentityCard: ''
    });
    setError('');
    setNotesDialogOpen(false);
    setStudentNotes([]);
    onClose();
  };

  const handleOpenNotesDialog = async () => {
    setNotesDialogOpen(true);
    setNotesLoading(true);
    try {
      const result = await dispatch(getNotesByStudentId(formData.id)).unwrap();
      setStudentNotes(result || []);
    } catch (error) {
      setStudentNotes([]);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setStudentNotes([]);
  };

  const renderStudentNotes = () => {
    if (notesLoading) {
      return <Typography sx={{ textAlign: 'center', py: 2 }}>טוען הערות...</Typography>;
    }
    if (!studentNotes || studentNotes.length === 0) {
      return <Typography sx={{ textAlign: 'center', py: 2 }}>אין הערות עבור תלמיד זה</Typography>;
    }
    return (
      <Box sx={{ mt: 2 }}>
        {studentNotes.map((note, index) => {
          const selectedNoteType = noteTypes.find(type => type.value === note.noteType) || noteTypes[0];
          const selectedPriority = priorities.find(priority => priority.value === note.priority) || priorities[0];
          return (
            <Accordion key={note.noteId} sx={{ mb: 1, borderRadius: '8px !important' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: `${selectedNoteType?.color}10`,
                  borderLeft: `4px solid ${selectedNoteType?.color}`,
                  borderRadius: '8px',
                  mb: 1,
                  '&:hover': { backgroundColor: `${selectedNoteType?.color}20` },
                  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Avatar sx={{ bgcolor: selectedNoteType?.color, width: 32, height: 32 }}>
                    {selectedNoteType?.icon && (
                      <selectedNoteType.icon sx={{ fontSize: 16 }} />
                    )}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {note.noteType}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize='13px'>
                      {new Date(note.createdDate).toLocaleDateString('he-IL')} • {note.authorName} • {note.authorRole}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {note.priority && (
                      <Chip
                        label={note.priority}
                        size="small"
                        sx={{ bgcolor: `${selectedPriority?.color}20`, color: selectedPriority?.color, fontWeight: 'bold' }}
                      />
                    )}
                    {note.isPrivate && (
                      <Chip label="פרטי" size="small" color="warning" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">{note.noteContent}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#2563EB',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon />
          <Typography variant="h6" component="span">
            עריכת פרטי תלמיד
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, direction: 'rtl', position: 'relative', pb: error ? 8 : 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={<span><span role="img" aria-label="person">👤</span> נוצר ע"י</span>}
              fullWidth
              variant="outlined"
              value={formData.createdBy}
              onChange={(e) => handleInputChange('createdBy', e.target.value)}
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
              placeholder="שם יוצר/מלל חופשי"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="🆔 תעודת זהות"
              type="number"
              fullWidth
              disabled={true}
              variant="outlined"
              value={formData.id}
              required
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="🪪 מספר זיהוי (אופציונלי)"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.IdentityCard}
              onChange={(e) => handleInputChange('IdentityCard', e.target.value)}
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
              placeholder="הזן מספר זיהוי נוסף"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="📞 טלפון"
              type="tel"
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="📱 טלפון נוסף"
              type="tel"
              fullWidth
              variant="outlined"
              value={formData.secondaryPhone}
              onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
              placeholder="טלפון נוסף (אופציונלי)"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="📧 מייל"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
              placeholder="example@email.com"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="👤 שם פרטי"
              fullWidth
              variant="outlined"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="👥 שם משפחה"
              fullWidth
              variant="outlined"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
            >
              <InputLabel sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>🎂 גיל</InputLabel>
              <Select
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                label="🎂 גיל"
                required
              >
                {ageOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="🏙️ עיר"
              fullWidth
              variant="outlined"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />
          
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#6B7280', textAlign: 'right', mb: 2 }}>
              פרטים נוספים (אופציונלי)
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="🏫 בית ספר"
              fullWidth
              variant="outlined"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              sx={{ 
                textAlign: 'right',
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
              InputLabelProps={{ sx: { right: 24, left: 'auto', transformOrigin: 'top right' } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined"
              disabled={healthFundsLoading}
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
            >
              <InputLabel sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>
                🏥 קופת חולים והסדר
              </InputLabel>
              <Select
                value={formData.healthFundId || ''}
                onChange={(e) => {
                  const selectedFund = healthFunds.find(hf => hf.healthFundId === e.target.value);
                  handleInputChange('healthFundId', e.target.value);
                  if (selectedFund) {
                    handleInputChange('healthFundName', selectedFund.name);
                    handleInputChange('healthFundPlan', selectedFund.fundType);
                  }
                }}
                label="🏥 קופת חולים והסדר"
                disabled={healthFundsLoading}
                dir="rtl"
              >
                {healthFundsLoading ? (
                  <MenuItem disabled>טוען...</MenuItem>
                ) : (
                  healthFunds.map((fund) => (
                    <MenuItem key={fund.healthFundId} value={fund.healthFundId}>
                      {fund.name} • {fund.fundType}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
                  </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
            >
              <InputLabel sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>📚 כיתה</InputLabel>
              <Select
                value={formData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                label="📚 כיתה"
              >
                {/* Show current class value if it's not in the options */}
                {formData.class && !classOptions.find(option => option.value === formData.class) && (
                  <MenuItem key={`current-${formData.class}`} value={formData.class}>
                    📚 {formData.class}
                  </MenuItem>
                )}
                {classOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
            >
              <InputLabel sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>🌍 מגזר</InputLabel>
              <Select
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                label="🌍 מגזר"
              >
                {sectorOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth 
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-notchedOutline legend': {
                  textAlign: 'right'
                }
              }}
            >
              <InputLabel sx={{ right: 24, left: 'auto', transformOrigin: 'top right' }}>📊 סטטוס תלמיד</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="📊 סטטוס תלמיד"
                required
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
            <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenNotesDialog}
          sx={{ borderRadius: '8px', px: 2, py: 1, fontWeight: 'bold', mb: 2, mr: 1 }}
        >
          הצג הערות תלמיד
        </Button>
        {/* <Button
          variant="outlined"
          color="secondary"
          onClick={handleRefreshNotes}
          sx={{ borderRadius: '8px', px: 2, py: 1, fontWeight: 'bold', mb: 2 }}
        >
          רענן הערות
        </Button> */}
        </Grid>

      
        {notesLoading && <Typography sx={{ textAlign: 'center', py: 2 }}>טוען הערות...</Typography>}
        {!notesLoading && notesDialogOpen && (
          <Box sx={{ mb: 2 }}>{renderStudentNotes()}</Box>
        )}
        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={notification.action ? 10000 : 6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          action={notification.action}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              }
            }}
            action={notification.action}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleClose}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              bgcolor: 'rgba(239, 68, 68, 0.05)'
            }
          }}
        >
          ביטול
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading || !validateForm()}
          sx={{
            direction:'ltr',
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#2563EB',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            '&:hover': {
              bgcolor: '#1D4ED8',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
            },
            '&:disabled': {
              bgcolor: '#94A3B8',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'שומר...' : 'שמור שינויים'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStudentDialog;
