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
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Edit as EditIcon, 
  Check as CheckIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { editStudent } from '../../../store/student/studentEditThunk';

const EditStudentDialog = ({ open, onClose, student, onStudentUpdated }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    age: '',
    city: '',
    school: '',
    healthFund: '',
    class: '',
    sector: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // אפשרויות קופת חולים עם אייקונים
  const healthFundOptions = [
    { value: 'מכבי', label: '🏥 מכבי', icon: '🏥' },
    { value: 'מאוחדת', label: '🏥 מאוחדת', icon: '🏥' },
    { value: 'לאומית', label: '🏥 לאומית', icon: '🏥' },
    { value: 'כללית', label: '🏥 כללית', icon: '🏥' }
  ];

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
        email: student.email || student.mail || student.emailAddress || '',
        age: student.age || '',
        city: student.city || '',
        school: student.school || '',
        healthFund: student.healthFund || student.healthfund || '',
        class: normalizeClass(student.class || student.className || student.grade || student.classLevel),
        sector: student.sector || '',
        status: student.status || (student.isActive !== undefined ? (student.isActive ? 'פעיל' : 'לא פעיל') : '')
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
      console.log('Missing fields:', missingFields);
      console.log('Current form data:', formData);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const required = ['id', 'firstName', 'lastName', 'phone', 'age', 'city'];
      const missingFields = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
      setError(`נא למלא את השדות הנדרשים: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(''); // Clear any previous errors
    
    try {
      const studentData = {
        ...formData,
        age: parseInt(formData.age),
        phone: formData.phone.toString()
      };

      console.log('Sending student data for update:', studentData);

      const result = await dispatch(editStudent({
        studentId: formData.id,
        ...studentData
      })).unwrap();

      console.log('Student update successful:', result);

      if (onStudentUpdated) {
        onStudentUpdated(result);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
      
      // More detailed error handling
      if (error.message) {
        setError(`שגיאה בעדכון פרטי התלמיד: ${error.message}`);
      } else if (typeof error === 'string') {
        setError(`שגיאה בעדכון פרטי התלמיד: ${error}`);
      } else {
        setError('שגיאה בעדכון פרטי התלמיד. אנא נסה שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      age: '',
      city: '',
      school: '',
      healthFund: '',
      class: '',
      sector: '',
      status: ''
    });
    setError('');
    onClose();
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

      <DialogContent sx={{ p: 3, direction: 'rtl' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: 'right' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="🆔 תעודת זהות"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              required
              sx={{ textAlign: 'right' }}
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
              sx={{ textAlign: 'right' }}
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
              sx={{ textAlign: 'right' }}
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
              sx={{ textAlign: 'right' }}
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
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>🎂 גיל</InputLabel>
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
              sx={{ textAlign: 'right' }}
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
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>🏥 קופת חולים</InputLabel>
              <Select
                value={formData.healthFund}
                onChange={(e) => handleInputChange('healthFund', e.target.value)}
                label="🏥 קופת חולים"
              >
                {healthFundOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>📚 כיתה</InputLabel>
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>🌍 מגזר</InputLabel>
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>📊 סטטוס תלמיד</InputLabel>
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
        </Grid>
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
