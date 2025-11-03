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
    CheckCircle as CheckCircleIcon, Info as InfoIcon,
    Assignment as AssignmentIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { checkUserPermission } from '../../../utils/permissions';

const AddStudentNoteDialog = ({
    open,
    onClose,
    student,
    onSave,
    editMode = false,
    noteData = null,
    studentNotes = [] // הוסף prop שמכיל את כל ההערות של התלמיד
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
        studentName: student?.studentName || student?.name || student?.firstName + ' ' + student?.lastName || '',
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
                studentName: noteData.studentName || student?.studentName || student?.name || student?.firstName + ' ' + student?.lastName || '',
                authorId: noteData.authorId || userDetails.id,
                authorName: noteData.authorName || userDetails.fullName,
                authorRole: noteData.authorRole || userDetails.role,
                noteContent: noteData.noteContent || '',
                noteType: noteData.noteType || (student?.noteType ? student.noteType : 'כללי'),
                priority: noteData.priority || 'נמוך',
                isPrivate: noteData.isPrivate || false,
                isActive: noteData.isActive !== undefined ? noteData.isActive : true
            };
        }
        return {
            studentId: student?.id || '',
            studentName: student?.studentName || student?.name || student?.firstName + ' ' + student?.lastName || '',
            authorId: userDetails.id,
            authorName: userDetails.fullName,
            authorRole: userDetails.role,
            noteContent: '',
            noteType: student?.noteType ? student.noteType : 'כללי',
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

    // משימות רישום קבועות
    const registrationTasks = [
      '💳 אמצעי תשלום מולא',
      '👨‍🏫 מדריך עודכן',
      '📱 הוכנס ל-GIS',
      '📋 הוסבר על התחייבות/הפניה'
    ];

    // הערות גביה אוטומטיות
    const billingNoteOptions = [
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

    // בדוק אם יש כבר הערת "מעקב רישום" לתלמיד
    const hasRegistrationTrackingNote = useMemo(() => {
      if (!studentNotes || !Array.isArray(studentNotes)) return false;
      return studentNotes.some(note => note.noteType === 'מעקב רישום');
    }, [studentNotes]);

    // ערכי ברירת מחדל למשימות רישום
    const [registrationTaskStatus, setRegistrationTaskStatus] = useState(
      registrationTasks.reduce((acc, task) => {
        acc[task] = false;
        return acc;
      }, {})
    );

    // ערכי ברירת מחדל לבחירת הערות גביה
    const [billingNoteSelection, setBillingNoteSelection] = useState(
      billingNoteOptions.reduce((acc, option) => {
        acc[option.key] = false;
        return acc;
      }, {})
    );

    // הערות נוספות להערות גביה
    const [billingAdditionalNotes, setBillingAdditionalNotes] = useState({});

    // עדכן סטטוס משימה
    const handleTaskToggle = (task) => {
      setRegistrationTaskStatus(prev => ({
        ...prev,
        [task]: !prev[task]
      }));
    };

    // עדכן בחירת הערת גביה
    const handleBillingNoteToggle = (key) => {
      setBillingNoteSelection(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    };

    // עדכן הערה נוספת להערת גביה
    const handleBillingAdditionalNoteChange = (key, value) => {
      setBillingAdditionalNotes(prev => ({
        ...prev,
        [key]: value
      }));
    };

    // עדכן noteContent אוטומטית אם "מעקב רישום" נבחר
    useEffect(() => {
            // עדכון תוכן ההערה אוטומטית רק בסטייט, ללא שמירה אוטומטית לשרת
            if (formData.noteType === 'מעקב רישום') {
                const currentDate = new Date().toLocaleDateString('he-IL');
                let noteContent = `🔴 משימות שטרם הושלמו (עודכן ב-${currentDate}):\n`;
                const incompleteTasks = registrationTasks.filter(task => !registrationTaskStatus[task]);
                incompleteTasks.forEach(task => {
                    noteContent += `❌ ${task}\n`;
                });
                if (incompleteTasks.length === 0) {
                    noteContent = `✅ כל משימות הרישום הושלמו בהצלחה! (עודכן ב-${currentDate})`;
                }
                setFormData(prev => ({ ...prev, noteContent }));
            }
    }, [formData.noteType, registrationTaskStatus]);

    // עדכן noteContent אוטומטית אם "הערת גביה" נבחרה
    useEffect(() => {
        if (formData.noteType === 'הערת גביה') {
            let noteContent = '';
            const selectedOptions = [];
            
            // עבור על כל האופציות שנבחרו
            billingNoteOptions.forEach(option => {
                if (billingNoteSelection[option.key]) {
                    selectedOptions.push(option);
                    const additionalNote = billingAdditionalNotes[option.key] || '';
                    noteContent += `${option.label}${additionalNote ? ` - ${additionalNote}` : ''}\n`;
                }
            });

            // אם לא נבחרו אופציות, הראה הודעה או השאר ריק
            if (selectedOptions.length === 0) {
                noteContent = ''; // השאר ריק כדי שהמשתמש יוכל להזין ידנית
            }

            setFormData(prev => ({ ...prev, noteContent }));
        }
    }, [formData.noteType, billingNoteSelection, billingAdditionalNotes]);

    const noteTypes = [
        { value: 'כללי', label: 'כללי', color: '#3b82f6', icon: InfoIcon },
        { value: 'חיובי', label: 'חיובי', color: '#059669', icon: CheckCircleIcon },
        { value: 'שלילי', label: 'שלילי', color: '#dc2626', icon: ErrorIcon },
        { value: 'אזהרה', label: 'אזהרה', color: '#d97706', icon: WarningIcon },
        { value: 'הערת גביה', label: 'הערת גביה', color: '#22c55e', icon: AttachMoneyIcon },
        { value: 'מעקב רישום', label: 'מעקב רישום', color: '#0ea5e9', icon: AssignmentIcon }
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
        if (!checkUserPermission(currentUser?.id || currentUser?.userId, (msg, severity) => setErrors({ permission: msg }))) return;
        // מניעת שמירה כפולה של "מעקב רישום" או הערה עם אותו תוכן
        if (
            (
                formData.noteType === 'מעקב רישום' && hasRegistrationTrackingNote && !editMode
            ) ||
            (
                studentNotes && studentNotes.some(n => n.noteContent.trim() === formData.noteContent.trim() && n.noteType === formData.noteType)
            )
        ) {
            alert('לא ניתן להוסיף הערה כפולה (אותו תוכן ואותו סוג) לתלמיד.');
            return;
        }
        if (!open) return;
        if (validateForm()) {
            const noteToSave = {
                ...(editMode && noteData?.noteId ? { noteId: noteData.noteId } : {}),
                studentId: formData.studentId || student?.id,
                authorId: formData.authorId || 'guest',
                authorName: formData.authorName.trim() || 'משתמש אורח',
                authorRole: formData.authorRole.trim() || 'מורה',
                noteContent: formData.noteContent.trim(),
                noteType: formData.noteType,
                priority: formData.priority,
                isPrivate: Boolean(formData.isPrivate),
                isActive: Boolean(formData.isActive),
                createdDate: editMode ? noteData?.createdDate : new Date().toISOString(),
                updatedDate: new Date().toISOString()
            };
            if (onSave) {
                onSave(noteToSave);
            }
            setTimeout(() => {
                handleClose();
            }, 200);
        }
};

    const handleClose = () => {
    // נקה את ה-flag וה-localStorage כאן
    if (formData && formData.studentId) {
        if (window.__studentNoteSaving) window.__studentNoteSaving[formData.studentId] = false;
        const noteKey = `studentNote_${formData.studentId}_tracking`;
        localStorage.removeItem(noteKey);
    }
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
                                {formData.studentName ? (
                                    `${formData.studentName} • ת"ז: ${formData.studentId}`
                                ) : (
                                    student ? (
                                        `${student.firstName} ${student.lastName} • ת"ז: ${student.id}`
                                    ) : (
                                        'תלמיד לא נבחר'
                                    )
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
                    maxHeight: '50vh',
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
                                maxWidth: '500px',
                                margin: '0 auto',
                                overflow: 'auto'
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 2,
                                        flexWrap: 'wrap',
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
                                disabled={hasRegistrationTrackingNote && formData.noteType === 'מעקב רישום'}
                            >
                                {noteTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    // אם יש כבר הערת מעקב רישום, אל תציג את האופציה שוב
                                    if (type.value === 'מעקב רישום' && hasRegistrationTrackingNote) return null;
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
                                bgcolor: `${selectedNoteType?.color}05`,
                                maxWidth: '500px',
                                margin: '0 auto',
                                overflow: 'auto'
                            }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        תצוגה מקדימה
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
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

                        {/* אם נבחר "מעקב רישום" הצג משימות עם v/x */}
                        {formData.noteType === 'מעקב רישום' && (
                          <Grid item xs={12}>
                            <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0', bgcolor: '#e0f2fe', mb: 2, maxWidth: '400px', margin: '0 auto', overflow: 'auto' }}>
                              <CardContent>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#0ea5e9' }}>
                                  משימות רישום לתלמיד
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexWrap: 'wrap' }}>
                                  {registrationTasks.map((task, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Button
                                        variant={registrationTaskStatus[task] ? 'contained' : 'outlined'}
                                        color={registrationTaskStatus[task] ? 'success' : 'error'}
                                        size="small"
                                        onClick={() => handleTaskToggle(task)}
                                        sx={{ minWidth: 36, borderRadius: 2, px: 1 }}
                                      >
                                        {registrationTaskStatus[task] ? '✔️' : '❌'}
                                      </Button>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {task}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}

                        {/* אם נבחר "הערת גביה" הצג אופציות הערות גביה */}
                        {formData.noteType === 'הערת גביה' && (
                          <Grid item xs={12}>
                            <Card sx={{ 
                              borderRadius: '8px', 
                              border: '1px solid #e2e8f0', 
                              bgcolor: '#f0fdf4', 
                              mb: 2, 
                              maxWidth: '600px', 
                              margin: '0 auto', 
                              overflow: 'auto' 
                            }}>
                              <CardContent>
                                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', color: '#059669' }}>
                                  💰 בחר הערות גביה רלוונטיות
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  {billingNoteOptions.map((option) => (
                                    <Box key={option.key} sx={{ 
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      p: 1.5,
                                      bgcolor: billingNoteSelection[option.key] ? '#dcfce7' : 'white'
                                    }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <Button
                                          variant={billingNoteSelection[option.key] ? 'contained' : 'outlined'}
                                          color={billingNoteSelection[option.key] ? 'success' : 'primary'}
                                          size="small"
                                          onClick={() => handleBillingNoteToggle(option.key)}
                                          sx={{ minWidth: 36, borderRadius: 2, px: 1 }}
                                        >
                                          {billingNoteSelection[option.key] ? '✔️' : '➕'}
                                        </Button>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {option.label}
                                        </Typography>
                                      </Box>
                                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                                        {option.description}
                                      </Typography>
                                      {billingNoteSelection[option.key] && (
                                        <TextField
                                          fullWidth
                                          size="small"
                                          placeholder="הערה נוספת (אופציונלי)"
                                          value={billingAdditionalNotes[option.key] || ''}
                                          onChange={(e) => handleBillingAdditionalNoteChange(option.key, e.target.value)}
                                          sx={{
                                            '& .MuiOutlinedInput-root': {
                                              borderRadius: '6px',
                                              bgcolor: 'white'
                                            }
                                          }}
                                        />
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        )}
                    </Grid>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2, 
                    flexDirection: 'column',
                    bgcolor: 'white',
                    borderTop: '1px solid #e2e8f0',
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 1
                }}>
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
                                !formData.authorRole.trim() ||
                                (formData.noteType === 'מעקב רישום' && hasRegistrationTrackingNote && !editMode)
                            }
                            sx={{
                                direction:'ltr',
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
