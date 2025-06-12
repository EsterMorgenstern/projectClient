import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, MenuItem,
    FormControlLabel, Switch, Grid, Card, CardContent,
    Avatar, Chip, Alert
} from '@mui/material';
import {
    Notes as NotesIcon, Person as PersonIcon,
    Save as SaveIcon, Close as CloseIcon,
    Warning as WarningIcon, Error as ErrorIcon,
    CheckCircle as CheckCircleIcon, Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AddStudentNoteDialog = ({
    open,
    onClose,
    student,
    onSave,
    currentUser = { id: '11111111', name: 'מנהל המערכת', role: 'Admin' }
}) => {
    const [noteData, setNoteData] = useState({
        studentId: student?.id || '',
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: currentUser.role,
        noteContent: '',
        noteType: 'כללי',
        priority: 'נמוך',
        isPrivate: false,
        isActive: true
    });

    const [errors, setErrors] = useState({});

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
        setNoteData(prev => ({
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

        if (!noteData.noteContent.trim()) {
            newErrors.noteContent = 'תוכן ההערה הוא שדה חובה';
        }

        if (noteData.noteContent.length > 1000) {
            newErrors.noteContent = 'תוכן ההערה לא יכול להיות ארוך מ-1000 תווים';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            const noteToSave = {
                ...noteData,
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString()
            };

            onSave(noteToSave);
            handleClose();
        }
    };

    const handleClose = () => {
        setNoteData({
            studentId: student?.id || '',
            authorId: currentUser.id,
            authorName: currentUser.name,
            authorRole: currentUser.role,
            noteContent: '',
            noteType: 'כללי',
            priority: 'נמוך',
            isPrivate: false,
            isActive: true
        });
        setErrors({});
        onClose();
    };

    const selectedNoteType = noteTypes.find(type => type.value === noteData.noteType);
    const selectedPriority = priorities.find(priority => priority.value === noteData.priority);

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
                    maxHeight: '90vh', // ✅ הגבלת גובה מקסימלי
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Header - קומפקטי יותר */}
                <DialogTitle
                    sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        p: 2, // ✅ פחות padding
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            width: 40, // ✅ קטן יותר
                            height: 40
                        }}>
                            <NotesIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}> {/* ✅ h6 במקום h5 */}
                                הוספת הערה חדשה
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}> {/* ✅ קטן יותר */}
                                {student?.firstName} {student?.lastName} • ת"ז: {student?.id}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <br />

                {/* Content עם גלילה */}
                <DialogContent
                    sx={{
                        p: 2, // ✅ פחות padding
                        bgcolor: '#f8fafc',
                        maxHeight: '60vh', // ✅ הגבלת גובה
                        overflow: 'auto' // ✅ גלילה
                    }}
                >
                    <Grid container spacing={2}> {/* ✅ פחות רווח */}
                        {/* פרטי המחבר - קומפקטי */}
                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <CardContent sx={{ p: 1.5 }}> {/* ✅ פחות padding */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}> {/* ✅ קטן יותר */}
                                            <PersonIcon sx={{ fontSize: 18 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                נכתב על ידי
                                            </Typography>
                                            <Typography variant="body2" fontWeight="bold"> {/* ✅ קטן יותר */}
                                                {noteData.authorName} ({noteData.authorRole})
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* סוג הערה ועדיפות - בשורה אחת */}
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                label="סוג הערה"
                                value={noteData.noteType}
                                onChange={(e) => handleInputChange('noteType', e.target.value)}
                                size="small" // ✅ קטן יותר
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
                                select
                                fullWidth
                                label="עדיפות"
                                value={noteData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                size="small" // ✅ קטן יותר
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
                                fullWidth
                                multiline
                                rows={4} // ✅ פחות שורות
                                label="תוכן ההערה"
                                placeholder="כתוב כאן את ההערה..."
                                value={noteData.noteContent}
                                onChange={(e) => handleInputChange('noteContent', e.target.value)}
                                error={!!errors.noteContent}
                                helperText={errors.noteContent || `${noteData.noteContent.length}/1000 תווים`}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        bgcolor: 'white'
                                    }
                                }}
                            />
                        </Grid>

                        {/* הגדרות נוספות - קומפקטי */}
                        <Grid item xs={12}>
                            <Card sx={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <CardContent sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}> {/* ✅ קטן יותר */}
                                        הגדרות נוספות
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2 }}> {/* ✅ בשורה אחת */}
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={noteData.isPrivate}
                                                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                                                    color="warning"
                                                    size="small" // ✅ קטן יותר
                                                />
                                            }
                                            label={
                                                <Typography variant="body2">הערה פרטית</Typography>
                                            }
                                        />

                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={noteData.isActive}
                                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                                    color="success"
                                                    size="small" // ✅ קטן יותר
                                                />
                                            }
                                            label={<Typography variant="body2">הערה פעילה</Typography>}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* תצוגה מקדימה - קומפקטית */}
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
                                        <Avatar sx={{ bgcolor: selectedNoteType?.color, width: 28, height: 28 }}>
                                            {selectedNoteType && <selectedNoteType.icon sx={{ fontSize: 16 }} />}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {noteData.noteType}
                                                </Typography>
                                                <Chip
                                                    label={noteData.priority}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${selectedPriority?.color}20`,
                                                        color: selectedPriority?.color,
                                                        fontWeight: 'bold',
                                                        fontSize: '0.7rem'
                                                    }}
                                                />
                                                {noteData.isPrivate && (
                                                    <Chip label="פרטי" size="small" color="warning" variant="outlined" />
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date().toLocaleDateString('he-IL')} • {noteData.authorName}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body2" sx={{
                                        p: 1.5,
                                        bgcolor: 'white',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        minHeight: '40px',
                                        fontStyle: noteData.noteContent ? 'normal' : 'italic',
                                        color: noteData.noteContent ? 'text.primary' : 'text.secondary'
                                    }}>
                                        {noteData.noteContent || 'תוכן ההערה יופיע כאן...'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* Actions - קומפקטי */}
                <DialogActions sx={{ p: 2, bgcolor: 'white', gap: 1.5 }}>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        size="small" // ✅ קטן יותר
                        sx={{
                            borderRadius: '8px',
                            px: 2,
                            py: 0.5,
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            '&:hover': {
                                borderColor: '#cbd5e1',
                                bgcolor: '#f8fafc'
                            }
                        }}
                    >
                        ביטול
                    </Button>

                    <Button
                        onClick={handleSave}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={!noteData.noteContent.trim()}
                        size="small" // ✅ קטן יותר
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            borderRadius: '8px',
                            px: 3,
                            py: 0.5,
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            },
                            '&:disabled': {
                                background: '#e2e8f0',
                                color: '#94a3b8'
                            }
                        }}
                    >
                        שמור הערה
                    </Button>
                </DialogActions>
            </motion.div>
        </Dialog>
    );
};

export default AddStudentNoteDialog;
