import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, MenuItem,
    FormControlLabel, Switch, Grid, Card, CardContent,
    Avatar, Chip, Alert, CircularProgress
} from '@mui/material';
import {
    Notes as NotesIcon, Person as PersonIcon,
    Save as SaveIcon, Close as CloseIcon,
    Warning as WarningIcon, Error as ErrorIcon,
    CheckCircle as CheckCircleIcon, Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';

const AddStudentNoteDialog = ({
    open,
    onClose,
    student,
    onSave,
    editMode = false,
    noteData = null
}) => {
    console.log('AddStudentNoteDialog props:', { student, editMode, noteData, open });

    const dispatch = useDispatch();

    // קבל את המשתמש הנוכחי מה-Redux עם fallback
    const currentUser = useSelector(state => {
        console.log('Redux state:', state); // 🔍 Debug
        return state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null;
    });

    console.log('Current user from Redux:', currentUser); // 🔍 Debug

    // ערכי ברירת מחדל למקרה שאין משתמש מחובר
    const defaultUser = {
        id: 'guest',
        firstName: 'משתמש',
        lastName: 'אורח',
        role: 'מורה'
    };

    const [formData, setFormData] = useState({
        studentId: student?.id || '',
        authorId: '',
        authorName: '',
        authorRole: '',
        noteContent: '',
        noteType: 'כללי',
        priority: 'נמוך',
        isPrivate: false,
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // פונקציה לקבלת פרטי המשתמש
    const getUserDetails = (user) => {
        if (!user) return defaultUser;
        
        // נסה מספר אפשרויות לשמות השדות
        const firstName = user.firstName || user.FirstName  || 'משתמש';
        const lastName = user.lastName || user.LastName  || 'אורח';
        const role = user.role || user.Role  || 'מורה';
        const id = user.id || user.Id ;

        return {
            id,
            firstName,
            lastName,
            role,
            fullName: `${firstName} ${lastName}`
        };
    };

    // עדכון הנתונים כאשר נפתח במצב עריכה או כשהמשתמש משתנה
    const initialFormData = useMemo(() => {
        const userDetails = getUserDetails(currentUser);
        
        if (noteData) {
            return {
                studentId: noteData.studentId || student?.id || '',
                authorId: noteData.authorId || userDetails.id,
                authorName: noteData.authorName || userDetails.fullName,
                authorRole: noteData.authorRole || userDetails.role,
                noteContent: noteData.noteContent || '',
                noteType: noteData.noteType || 'כללי',
                priority: noteData.priority || 'נמוך',
                isPrivate: noteData.isPrivate || false,
                isActive: noteData.isActive !== undefined ? noteData.isActive : true
            };
        }
        
        return {
            studentId: student?.id || '',
            authorId: userDetails.id,
            authorName: userDetails.fullName,
            authorRole: userDetails.role,
            noteContent: '',
            noteType: 'כללי',
            priority: 'נמוך',
            isPrivate: false,
            isActive: true
        };
    }, [editMode, noteData, student?.id, currentUser]);


    
    useEffect(() => {
        if (open) {
            console.log('Setting initial form data:', initialFormData); // 🔍 Debug
            setFormData(initialFormData);
            setErrors({});
        }
    }, [open, initialFormData]);

    // עדכון אוטומטי כשהמשתמש משתנה
    useEffect(() => {
        if (currentUser && !editMode) {
            const userDetails = getUserDetails(currentUser);
            console.log('Updating user details:', userDetails); // 🔍 Debug
            
            setFormData(prev => ({
                ...prev,
                authorId: userDetails.id,
                authorName: userDetails.fullName,
                authorRole: userDetails.role
            }));
        }
    }, [currentUser, editMode]);

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

    const handleInputChange = (field, value) => {
        console.log(`Changing ${field} to:`, value); // 🔍 Debug
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.noteContent.trim()) {
            newErrors.noteContent = 'תוכן ההערה הוא שדה חובה';
        }

        if (formData.noteContent.length > 1000) {
            newErrors.noteContent = 'תוכן ההערה לא יכול להיות ארוך מ-1000 תווים';
        }

        if (!formData.authorName.trim()) {
            newErrors.authorName = 'שם כותב ההערה הוא שדה חובה';
        }

        if (!formData.authorRole.trim()) {
            newErrors.authorRole = 'תפקיד כותב ההערה הוא שדה חובה';
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log('🔍 Validation result:', isValid, newErrors);
        return isValid;
    };

   const handleSave = async () => {
    console.log('🔍 Form data before validation:', formData);
    console.log('🔍 Student data:', student);
    console.log('🔍 Student ID:', student?.id);
    
    if (validateForm()) {
        setIsSaving(true);
        
        const noteToSave = {
            studentId: formData.studentId || student?.id,
            authorId: formData.authorId || 'guest',
            authorName: formData.authorName.trim() || 'משתמש אורח',
            authorRole: formData.authorRole.trim() || 'מורה',
            noteContent: formData.noteContent.trim(),
            noteType: formData.noteType,
            priority: formData.priority,
            isPrivate: Boolean(formData.isPrivate),
            isActive: Boolean(formData.isActive),
            createdDate: editMode ? noteData?.createdDate : new Date().toISOString().split('T')[0],
            updatedDate: new Date().toISOString().split('T')[0]
        };

        console.log('📤 Note to save (final):', noteToSave);
        console.log('📤 Note stringified:', JSON.stringify(noteToSave, null, 2));
        
        // בדיקה נוספת לפני שליחה
        const requiredFields = ['studentId', 'authorName', 'authorRole', 'noteContent'];
        const missingFields = requiredFields.filter(field => !noteToSave[field] || !noteToSave[field].toString().trim());
        
        if (missingFields.length > 0) {
            console.error('❌ Missing required fields:', missingFields);
            console.error('❌ Note data:', noteToSave);
            alert(`שדות חסרים: ${missingFields.join(', ')}`);
            setIsSaving(false);
            return;
        }

        try {
            // שמירה לשרת
            console.log('🔄 Sending note to server:', noteToSave);
            const result = await dispatch(addStudentNote(noteToSave));
            
            console.log('📥 Server response:', result);
            console.log('📋 Result type:', result.type);
            console.log('📄 Result payload:', result.payload);
            
            if (result.type === 'studentNotes/add/fulfilled') {
                console.log('✅ Note saved successfully');
                
                // קריאה לפונקציה שהועברה מהחוץ
                if (onSave) {
                    onSave(result.payload || noteToSave);
                }
                
                handleClose();
            } else {
                console.error('❌ Failed to save note:', result);
                console.error('❌ Error details:', result.error);
                const errorMessage = result.payload || result.error?.message || 'אנא נסה שנית';
                alert('שגיאה בשמירת ההערה: ' + errorMessage);
            }
        } catch (error) {
            console.error('❌ Error saving note:', error);
            alert('שגיאה בשמירת ההערה: ' + (error.message || 'אנא נסה שנית'));
        } finally {
            setIsSaving(false);
        }
    } else {
        console.log('❌ Validation failed:', errors);
    }
};

    const handleClose = () => {
        const userDetails = getUserDetails(currentUser);
        setFormData({
            studentId: student?.id || '',
            authorId: userDetails.id,
            authorName: userDetails.fullName,
            authorRole: userDetails.role,
            noteContent: '',
            noteType: 'כללי',
            priority: 'נמוך',
            isPrivate: false,
            isActive: true
        });
        setErrors({});
        onClose();
    };

    const selectedNoteType = noteTypes.find(type => type.value === formData.noteType);
    const selectedPriority = priorities.find(priority => priority.value === formData.priority);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            sx={{
                direction: 'rtl',
                '& .MuiDialog-paper': {
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    maxHeight: '90vh',
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header */}
                <DialogTitle
                    sx={{
                        background: editMode 
                            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        p: 2,
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 40,
                            height: 40
                        }}>
                            <NotesIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {editMode ? 'עריכת הערה' : 'הוספת הערה חדשה'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {student ? (
                                    `${student.firstName} ${student.lastName} • ת"ז: ${student.id}`
                                ) : (
                                    'תלמיד לא נבחר'
                                )}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <br />
                
                {/* Content עם גלילה */}
                <DialogContent sx={{ 
                    p: 2,
                    bgcolor: '#f8fafc',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '4px',
                        '&:hover': {
                            background: '#a8a8a8'
                        }
                    }
                }}>
                    <Grid container spacing={2}>
                        {/* בדיקה אם אין תלמיד */}
                        {!student && (
                            <Grid item xs={12}>
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        לא נבחר תלמיד. לא ניתן להוסיף הערה ללא בחירת תלמיד.
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}

                        {/* Debug Info - הסר בייצור */}
                        {process.env.NODE_ENV === 'development' && (
                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography variant="caption">
                                        Debug: authorName="{formData.authorName}", authorRole="{formData.authorRole}"
                                        <br />
                                        CurrentUser: {JSON.stringify(currentUser)}
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}

                        {/* פרטי המחבר */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                background: currentUser 
                                    ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' 
                                    : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        variant:'body2',
                                        gap: 1,
                                        mb: 1
                                    }}>
                                        <PersonIcon sx={{ fontSize: 18 }} />
                                        פרטי כותב ההערה
                                        {currentUser ? (
                                            <Chip 
                                                label="מחובר" 
                                                size="small" 
                                                sx={{ 
                                                    background: '#10b981', 
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }} 
                                            />
                                        ) : (
                                            <Chip 
                                                label="אורח" 
                                                size="small" 
                                                sx={{ 
                                                    background: '#f59e0b', 
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }} 
                                            />
                                        )}
                                    </Box>

                                    {!currentUser && (
                                        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                                            ⚠️ לא זוהה משתמש מחובר - אנא מלא את הפרטים ידנית
                                        </Alert>
                                    )}

                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <TextField
                                                id="name-input"
                                                fullWidth
                                                label="שם כותב ההערה"
                                                value={formData.authorName}
                                                onChange={(e) => handleInputChange('authorName', e.target.value)}
                                                error={!!errors.authorName}
                                                helperText={errors.authorName}
                                                size="small"
                                                required
                                                disabled
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        bgcolor: 'white'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                id="role-input"
                                                fullWidth
                                                label="תפקיד"
                                                value={formData.authorRole}
                                                onChange={(e) => handleInputChange('authorRole', e.target.value)}
                                                error={!!errors.authorRole}
                                                helperText={errors.authorRole}
                                                size="small"
                                                required
                                                disabled
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        bgcolor: 'white'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* סוג הערה ועדיפות */}
                        <Grid item xs={6}>
                            <TextField
                                id="type-input"
                                select
                                fullWidth
                                label="סוג הערה"
                                value={formData.noteType}
                                onChange={(e) => handleInputChange('noteType', e.target.value)}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            >
                                {noteTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <MenuItem key={type.value} value={type.value}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <IconComponent sx={{ color: type.color, fontSize: 18 }} />
                                                {type.label}
                                            </Box>
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                id="priority-input"
                                select
                                fullWidth
                                label="עדיפות"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            >
                                {priorities.map((priority) => (
                                    <MenuItem key={priority.value} value={priority.value}>
                                        <Chip
                                            label={priority.label}
                                            size="small"
                                            sx={{
                                                bgcolor: `${priority.color}20`,
                                                color: priority.color,
                                                fontWeight: 'bold'
                                            }}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* תוכן ההערה */}
                        <Grid item xs={12}>
                            <TextField
                                id="content-input"
                                fullWidth
                                multiline
                                rows={4}
                                label="תוכן ההערה"
                                value={formData.noteContent}
                                onChange={(e) => handleInputChange('noteContent', e.target.value)}
                                error={!!errors.noteContent}
                                helperText={errors.noteContent || `${formData.noteContent.length}/1000 תווים`}
                                placeholder="כתוב כאן את ההערה..."
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            />
                        </Grid>

                        {/* הגדרות נוספות */}
                        <Grid item xs={12}>
                            <Card sx={{ 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white'
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#475569' }}>
                                        הגדרות נוספות
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 3, width:'330px' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.isPrivate}
                                                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="הערה פרטית"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={formData.isActive}
                                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="הערה פעילה"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* תצוגה מקדימה */}
                        <Grid item xs={12}>
                            <Card sx={{
                                borderRadius: '8px',
                                border: `2px solid ${selectedNoteType?.color}20`,
                                bgcolor: `${selectedNoteType?.color}05`
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        תצוגה מקדימה
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Avatar sx={{
                                            bgcolor: selectedNoteType?.color,
                                            width: 32,
                                            height: 32
                                        }}>
                                            {selectedNoteType?.icon && (
                                                <selectedNoteType.icon sx={{ fontSize: 16 }} />
                                            )}
                                        </Avatar>

                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {formData.noteType || 'סוג הערה'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date().toLocaleDateString('he-IL')} • {formData.authorName || 'כותב ההערה'} ({formData.authorRole || 'תפקיד'})
                                            </Typography>
                                        </Box>

                                        {formData.priority && (
                                            <Chip
                                                label={formData.priority}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${selectedPriority?.color}20`,
                                                    color: selectedPriority?.color,
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="body2" sx={{
                                        p: 1,
                                        bgcolor: 'white',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0',
                                        minHeight: '40px',
                                        fontStyle: formData.noteContent ? 'normal' : 'italic',
                                        color: formData.noteContent ? 'text.primary' : 'text.secondary'
                                    }}>
                                        {formData.noteContent || 'תוכן ההערה יופיע כאן...'}
                                    </Typography>

                                    {(formData.isPrivate || !formData.isActive) && (
                                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                            {formData.isPrivate && (
                                                <Chip
                                                    label="הערה פרטית"
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            )}
                                            {!formData.isActive && (
                                                <Chip
                                                    label="לא פעילה"
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* הודעת אזהרה לעריכה */}
                        {editMode && (
                            <Grid item xs={12}>
                                <Alert severity="info" sx={{ borderRadius: '8px' }}>
                                    <Typography variant="body2">
                                        אתה עורך הערה קיימת. השינויים יישמרו עם תאריך העדכון הנוכחי.
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ p: 3, gap: 2, flexDirection: 'column' }}>
                    {!currentUser && (
                        <Typography variant="caption" sx={{ 
                            color: '#64748b',
                            textAlign: 'center',
                            fontStyle: 'italic'
                        }}>
                            💡 טיפ: התחבר למערכת כדי שהפרטים שלך יוזנו אוטומטית בהערות עתידיות
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            startIcon={<CloseIcon />}
                            sx={{
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                '&:hover': {
                                    borderColor: '#9ca3af',
                                    bgcolor: '#f9fafb'
                                }
                            }}
                        >
                            ביטול
                        </Button>

                        <Button
                            onClick={handleSave}
                            variant="contained"
                            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                            disabled={
                                isSaving ||
                                !student ||
                                !formData.noteContent.trim() || 
                                !formData.authorName.trim() || 
                                !formData.authorRole.trim()
                            }
                            sx={{
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                background: editMode 
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                '&:hover': {
                                    background: editMode 
                                        ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                                        : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
                                },
                                '&:disabled': {
                                    background: '#d1d5db',
                                    color: '#9ca3af'
                                }
                            }}
                        >
                            {isSaving ? 'שומר...' : (editMode ? 'עדכן הערה' : 'שמור הערה')}
                        </Button>
                    </Box>
                </DialogActions>
            </motion.div>
        </Dialog>
    );
};

export default AddStudentNoteDialog;
