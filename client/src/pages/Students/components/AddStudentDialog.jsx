import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Description as TermsIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { addStudent } from '../../../store/student/studentAddThunk';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import { getStudentById } from '../../../store/student/studentGetByIdThunk';
import { editStudent } from '../../../store/student/studentEditThunk';
import TermsDialog from '../../Enrollment/components/termDialog';
import AddStudentNoteDialog from './addStudentNoteDialog';

const AddStudentDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  title = "הוסף תלמיד חדש",
  submitButtonText = "הוסף תלמיד",
  showSuccessMessage = true,
  keepOpenAfterSubmit = false // פרמטר חדש לשמירת הדיאלוג פתוח
}) => {
  const dispatch = useDispatch();
  
  // קבלת המשתמש הנוכחי
  const currentUser = useSelector(state => {
    return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
  });
  
  const [newStudent, setNewStudent] = useState({
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    city: '',
    school: '',
    healthFund: '',
    class: '',
    sector: '',
    status: 'ליד'
  });

  const [loading, setLoading] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [studentNote, setStudentNote] = useState('');
  const [savedStudentData, setSavedStudentData] = useState(null);

  const healthFundOptions = [
    { value: 'מכבי', label: '🏥 מכבי', icon: '🏥' },
    { value: 'מאוחדת', label: '🏥 מאוחדת', icon: '🏥' },
    { value: 'לאומית', label: '🏥 לאומית', icon: '🏥' },
    { value: 'כללית', label: '🏥 כללית', icon: '🏥' }
  ];

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

  const classOptions = [
    { value: 'מכינה', label: '👶 מכינה', icon: '👶' },
    { value: 'כיתה א׳', label: '📚 כיתה א׳', icon: '📚' },
    { value: 'כיתה ב׳', label: '📖 כיתה ב׳', icon: '📖' },
    { value: 'כיתה ג׳', label: '📝 כיתה ג׳', icon: '📝' },
    { value: 'כיתה ד׳', label: '📋 כיתה ד׳', icon: '📋' },
    { value: 'כיתה ה׳', label: '📊 כיתה ה׳', icon: '📊' },
    { value: 'כיתה ו׳', label: '📈 כיתה ו׳', icon: '📈' },
    { value: 'כיתה ז׳', label: '🎓 כיתה ז׳', icon: '🎓' }
  ];

  const sectorOptions = [
    { value: 'כללי', label: '🌍 כללי', icon: '🌍' },
    { value: 'חסידי', label: '🌍 חסידי', icon: '🌍' },
    { value: 'גור', label: '🌍 גור', icon: '🌍' },
    { value: 'ליטאי', label: '🌍 ליטאי', icon: '🌍' }
  ];

  const statusOptions = [
    { value: 'פעיל', label: '✅ פעיל', icon: '✅', color: '#10b981' },
    { value: 'ליד', label: '⏳ ליד', icon: '⏳', color: '#f59e0b' },
    { value: 'לא רלוונטי', label: '❌ לא רלוונטי', icon: '❌', color: '#ef4444' }
  ];

  const handleInputChange = (field, value) => {
    setNewStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setNewStudent({
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      age: '',
      city: '',
      school: '',
      healthFund: '',
      class: '',
      sector: '',
      status: 'ליד'
    });
    setStudentNote('');
    setSavedStudentData(null);
    
    // נקה גם מ-localStorage
    localStorage.removeItem('addStudentFormData');
    localStorage.removeItem('addStudentNoteData');
    console.log('🧹 Form reset and localStorage cleared');
  };

  // 💾 שמירת נתוני התלמיד החדש ל-localStorage
  React.useEffect(() => {
    const formData = {
      newStudent,
      studentNote
    };
    
    // שמור רק אם יש נתונים בטופס
    const hasData = newStudent.firstName || newStudent.lastName || newStudent.id ||
                   newStudent.phone || newStudent.city || studentNote;
    
    if (hasData) {
      console.log('💾 שומר נתוני תלמיד חדש ל-localStorage:', formData);
      localStorage.setItem('addStudentFormData', JSON.stringify(formData));
    }
  }, [newStudent, studentNote]);

  // 📥 טעינת נתוני התלמיד מ-localStorage
  React.useEffect(() => {
    const savedData = localStorage.getItem('addStudentFormData');
    if (savedData && open) { // טען רק כשהדיאלוג נפתח
      try {
        const formData = JSON.parse(savedData);
        console.log('📥 טוען נתוני תלמיד חדש מ-localStorage:', formData);
        
        if (formData.newStudent) {
          setNewStudent(prev => ({ ...prev, ...formData.newStudent }));
        }
        if (formData.studentNote) {
          setStudentNote(formData.studentNote);
        }
      } catch (error) {
        console.error('❌ שגיאה בטעינת נתוני תלמיד מ-localStorage:', error);
        localStorage.removeItem('addStudentFormData');
      }
    }
  }, [open]);

  // 🗑️ פונקציה לניקוי נתוני התלמיד מ-localStorage
  const clearStudentFormData = () => {
    console.log('🗑️ מנקה נתוני תלמיד חדש מ-localStorage');
    localStorage.removeItem('addStudentFormData');
  };

  // פונקציה ליצירת הערה אוטומטית לתלמיד חדש
  const createAutomaticRegistrationNote = async (studentId, isUpdate = false) => {
    try {
      // פונקציה לקבלת פרטי המשתמש
      const getUserDetails = (user) => {
        if (!user) return { fullName: 'מערכת', role: 'מערכת אוטומטית' };
        
        const firstName = user.firstName || user.FirstName || 'משתמש';
        const lastName = user.lastName || user.LastName || 'אורח';
        const role = user.role || user.Role || 'מורה';
        
        return {
          fullName: `${firstName} ${lastName}`,
          role
        };
      };

      const userDetails = getUserDetails(currentUser);
      
      const currentDate = new Date().toLocaleDateString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const noteContent = isUpdate 
        ? `פרטי התלמיד עודכנו בתאריך ${currentDate} באמצעות "הוספת תלמיד"`
        : `נרשם בפעם הראשונה למערכת בתאריך ${currentDate} באמצעות "הוספת תלמיד"`;
      
      const noteData = {
        studentId: studentId,
        noteContent: noteContent,
        noteType: 'כללי',
        priority: 'בינוני',
        isPrivate: false,
        authorName: userDetails.fullName,
        authorRole: userDetails.role
      };

      console.log('📝 Creating automatic note:', noteData);
      
      const result = await dispatch(addStudentNote(noteData));
      
      if (addStudentNote.fulfilled.match(result)) {
        console.log('✅ Automatic note created successfully');
      } else {
        console.warn('⚠️ Failed to create automatic note:', result.payload);
      }
    } catch (error) {
      console.error('❌ Error creating automatic note:', error);
      // לא נציג שגיאה למשתמש כי זו פונקציה רקעית
    }
  };

  const validateForm = () => {
    const required = ['id', 'firstName', 'lastName', 'phone', 'age', 'city'];
    return required.every(field => newStudent[field] && newStudent[field].toString().trim() !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      if (onSuccess) {
        onSuccess(null, 'נא למלא את כל השדות הנדרשים', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const studentData = {
        ...newStudent,
        age: parseInt(newStudent.age),
        phone: newStudent.phone.toString()
      };

      // ננסה קודם הוספה פשוטה
      console.log('🔍 Trying to add student directly');
      let result = await dispatch(addStudent(studentData));
      
      console.log('🔍 AddStudent result:', result);
      
      // אם נכשל בגלל כפילות, נציע עדכון
      if (result.type === 'students/addStudent/rejected' && 
          result.payload && 
          (result.payload.includes('duplicate') || result.payload.includes('PRIMARY KEY constraint'))) {
        
        console.log('⚠️ Duplicate student detected, checking if exists for update');
        
        // נבדוק אם התלמיד באמת קיים
        const existingStudentResult = await dispatch(getStudentById(newStudent.id));
        
        if (existingStudentResult.type === 'students/GetStudentById/fulfilled' && 
            existingStudentResult.payload && 
            existingStudentResult.payload.id) {
          
          const existingStudent = existingStudentResult.payload;
          const shouldUpdate = window.confirm(
            `תלמיד עם תעודת זהות ${newStudent.id} כבר קיים במערכת:\n` +
            `שם: ${existingStudent.firstName} ${existingStudent.lastName}\n` +
            `כיתה: ${existingStudent.class}\n\n` +
            `האם תרצה לעדכן את פרטי התלמיד הקיים?`
          );
          
          if (shouldUpdate) {
            console.log('👤 User chose to update existing student');
            result = await dispatch(editStudent(studentData));
            console.log('🔍 EditStudent result:', result);
          } else {
            if (onSuccess) {
              onSuccess(null, 'הפעולה בוטלה - התלמיד כבר קיים במערכת', 'warning');
            }
            setLoading(false);
            return;
          }
        } else {
          // התלמיד לא נמצא אבל יש שגיאת כפילות - משהו לא תקין
          if (onSuccess) {
            onSuccess(null, 'שגיאה: התלמיד כנראה קיים אבל לא ניתן לאתר אותו', 'error');
          }
          setLoading(false);
          return;
        }
      }
      
      // בדיקה האם הפעולה הצליחה
      const isSuccess = result.type === 'students/addStudent/fulfilled' || 
                       result.type === 'students/editStudent/fulfilled';
      
      const isUpdateOperation = result.type === 'students/editStudent/fulfilled';
        
      if (isSuccess) {
        // ולידציה נוספת - וודא שהתלמיד באמת נשמר
        const studentToReturn = result.payload && Object.keys(result.payload).length > 0 
          ? result.payload 
          : studentData;

        // בדיקה אמיתית - נסה לקבל את התלמיד מהשרת
        console.log('🔍 Verifying student was saved by fetching from server...');
        const verificationResult = await dispatch(getStudentById(studentToReturn.id || newStudent.id));
        
        if (verificationResult.type === 'students/GetStudentById/fulfilled' && verificationResult.payload) {
          console.log(`✅ Student ${isUpdateOperation ? 'updated' : 'added'} and verified successfully!`);
          
          // יצירת הערה אוטומטית רק עבור תלמידים שנוספו דרך עמוד התלמידים (לא דרך שיבוץ)
          // אם זה בא מהוספת תלמיד ושיבוץ מיידי, ההערה תתווסף שם
          if (!onSuccess || (title && !title.includes('שיבוץ'))) {
            await createAutomaticRegistrationNote(studentToReturn.id || newStudent.id, isUpdateOperation);
          }
          
          setSavedStudentData(studentToReturn);
          
          // ניקוי נתונים לאחר הצלחה מאומתת
          clearStudentFormData();
          
          // אם יש הערה לכתוב, פתח את דיאלוג ההערות
          if (studentNote.trim()) {
            setNoteDialogOpen(true);
          } else {
            // אם אין הערה, סיים את התהליך
            finishProcess(studentToReturn);
          }
        } else {
          // הפעולה "הצליחה" אבל התלמיד לא נמצא - יש בעיה
          console.error('❌ Student operation reported success but student not found in verification!');
          if (onSuccess) {
            onSuccess(null, `⚠️ שגיאה: הפעולה דווחה כמוצלחת אך התלמיד לא נמצא במערכת. אנא בדוק ונסה שנית.`, 'error');
          }
        }
      } else {
        console.error(`❌ Student operation failed:`, result);
        
        // הודעת שגיאה מפורטת יותר
        let errorMessage = 'שגיאה בעבודה עם התלמיד: ';
        
        if (result.payload) {
          if (typeof result.payload === 'string') {
            errorMessage += result.payload;
          } else if (result.payload.message) {
            errorMessage += result.payload.message;
          } else {
            errorMessage += JSON.stringify(result.payload);
          }
        } else if (result.error) {
          errorMessage += result.error.message || result.error;
        } else {
          errorMessage += 'אנא נסה שנית';
        }
        
        if (onSuccess) {
          onSuccess(null, errorMessage, 'error');
        }
      }
    } catch (error) {
      console.error('Error with student operation:', error);
      if (onSuccess) {
        onSuccess(null, 'שגיאה בעבודה עם התלמיד: ' + (error.message || 'אנא נסה שנית'), 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const finishProcess = (studentData) => {
    if (!keepOpenAfterSubmit) {
      resetForm();
      clearStudentFormData(); // נקה גם מ-localStorage
      onClose();
    }
    
    if (onSuccess) {
      console.log('📤 Sending student data to callback:', studentData);
      onSuccess(studentData, 'התלמיד נוסף בהצלחה!', 'success');
    }
  };

  const handleNoteSubmit = (noteData) => {
    console.log('✅ Note added for student:', noteData);
    setNoteDialogOpen(false);
    setStudentNote(''); // נקה את ההערה אחרי שמירה
    clearStudentFormData(); // נקה גם מ-localStorage
    
    // הצג הודעה על הוספת ההערה
    if (onSuccess) {
      onSuccess(savedStudentData, 'התלמיד נוסף בהצלחה וההערה נשמרה!', 'success');
    }
    
    // אם צריך לסגור את הדיאלוג
    if (!keepOpenAfterSubmit) {
      resetForm();
      onClose();
    }
  };

  const handleClose = () => {
    if (!keepOpenAfterSubmit) {
      resetForm();
    }
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
          bgcolor: '#3B82F6',
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
          <PersonAddIcon />
          <Typography variant="h6" component="span">
            {title}
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
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="🆔 תעודת זהות"
              type="number"
              fullWidth
              variant="outlined"
              value={newStudent.id}
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
              value={newStudent.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="👤 שם פרטי"
              fullWidth
              variant="outlined"
              value={newStudent.firstName}
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
              value={newStudent.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>🎂 גיל</InputLabel>
              <Select
                value={newStudent.age}
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
              value={newStudent.city}
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
              value={newStudent.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>🏥 קופת חולים</InputLabel>
              <Select
                value={newStudent.healthFund}
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
                value={newStudent.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                label="📚 כיתה"
              >
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
                value={newStudent.sector}
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
                value={newStudent.status}
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

          <Grid item xs={12}>
            <TextField
              label="📝 הערות על התלמיד (אופציונלי)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="ניתן להוסיף כאן הערות חשובות על התלמיד..."
              sx={{ textAlign: 'right' }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Tooltip title="צפה בתקנון החוגים">
                <Button
                  variant="outlined"
                  startIcon={<TermsIcon />}
                  onClick={() => setTermsDialogOpen(true)}
                  sx={{
                    borderRadius: '8px',
                    px: 3,
                    py: 1.5,
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.1)',
                    '&:hover': {
                      borderColor: '#4f46e5',
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      boxShadow: '0 4px 8px rgba(99, 102, 241, 0.15)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  צפה בתקנון החוגים
                </Button>
              </Tooltip>
            </Box>
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
          startIcon={<CheckIcon />}
          onClick={handleSubmit}
          disabled={loading || !validateForm()}
          sx={{
            borderRadius: '8px',
            px: 3,
            py: 1,
            bgcolor: '#3B82F6',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              bgcolor: '#2563EB',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
            },
            '&:disabled': {
              bgcolor: '#94A3B8',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'מוסיף...' : submitButtonText}
        </Button>
      </DialogActions>

      {/* דיאלוג התקנון */}
      <TermsDialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        onAccept={() => setTermsDialogOpen(false)}
      />

      {/* דיאלוג הוספת הערה */}
      <AddStudentNoteDialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        student={savedStudentData}
        onSave={handleNoteSubmit}
        editMode={false}
        noteData={{
          noteContent: studentNote,
          noteType: 'כללי',
          priority: 'נמוך',
          isPrivate: false
        }}
      />
    </Dialog>
  );
};

export default AddStudentDialog;
