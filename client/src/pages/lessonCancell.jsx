import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    TextField,
    MenuItem,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    Fab,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import {
    Add,
    Cancel,
    Event,
    Group,
    MonetizationOn,
    Delete,
    Edit,
    CalendarToday,
    Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';

const LessonCancellationManager = ({ open, onClose }) => {
    const [cancellations, setCancellations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [monthlySummary, setMonthlySummary] = useState({});

    // טעינת נתונים
    useEffect(() => {
        if (open) {
            fetchGroups();
            fetchCancellations();
        }
    }, [open]);

    // חישוב סיכום חודשי
    useEffect(() => {
        calculateMonthlySummary();
    }, [cancellations, selectedMonth, selectedYear]);

    const fetchGroups = async () => {
        try {
            // כאן תוסיף קריאה לשרת לקבלת רשימת הקבוצות
            const response = await fetch('/api/groups');
            const data = await response.json();
            setGroups(data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const fetchCancellations = async () => {
        try {
            // כאן תוסיף קריאה לשרת לקבלת רשימת הביטולים
            const response = await fetch('/api/lesson-cancellations');
            const data = await response.json();
            setCancellations(data);
        } catch (error) {
            console.error('Error fetching cancellations:', error);
        }
    };

    const calculateMonthlySummary = () => {
        const summary = {};

        groups.forEach(group => {
            const groupCancellations = cancellations.filter(cancellation =>
                cancellation.groupId === group.id &&
                new Date(cancellation.date).getMonth() === selectedMonth &&
                new Date(cancellation.date).getFullYear() === selectedYear
            );

            // חישוב מספר השיעורים הרגילים בחודש (לדוגמה: 4 שבועות)
            const regularLessonsPerMonth = 4; // ניתן לחשב לפי ימי השבוע בחודש
            const cancelledLessons = groupCancellations.length;
            const actualLessons = regularLessonsPerMonth - cancelledLessons;

            summary[group.id] = {
                groupName: group.name,
                courseName: group.courseName,
                regularLessons: regularLessonsPerMonth,
                cancelledLessons,
                actualLessons,
                pricePerLesson: group.pricePerLesson || 0,
                totalPrice: actualLessons * (group.pricePerLesson || 0),
                studentsCount: group.studentsCount || 0
            };
        });

        setMonthlySummary(summary);
    };

    const handleAddCancellation = async () => {
        try {
            const newCancellation = {
                groupId: selectedGroup,
                date: selectedDate.toISOString().split('T')[0],
                reason,
                createdAt: new Date().toISOString()
            };

            // שליחה לשרת
            const response = await fetch('/api/lesson-cancellations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCancellation)
            });

            if (response.ok) {
                fetchCancellations();
                setOpenAddDialog(false);
                setSelectedGroup('');
                setReason('');
                setSelectedDate(new Date());
            }
        } catch (error) {
            console.error('Error adding cancellation:', error);
        }
    };

    const handleDeleteCancellation = async (cancellationId) => {
        try {
            const response = await fetch(`/api/lesson-cancellations/${cancellationId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchCancellations();
            }
        } catch (error) {
            console.error('Error deleting cancellation:', error);
        }
    };

    const monthNames = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xl"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 12,
                        minHeight: '80vh'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: '#DC2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Warning />
                    <Typography variant="h6">
                        ניהול ביטולי שיעורים וסיכום חודשי
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    {/* בחירת חודש לסיכום */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>חודש</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    label="חודש"
                                >
                                    {monthNames.map((month, index) => (
                                        <MenuItem key={index} value={index}>
                                            {month}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="שנה"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            />
                        </Grid>
                    </Grid>

                    {/* סיכום חודשי */}
                    <Typography variant="h6" sx={{ mb: 2, color: '#1E40AF' }}>
                        סיכום חודשי - {monthNames[selectedMonth]} {selectedYear}
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F1F5F9' }}>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>קבוצה</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>קורס</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>שיעורים רגילים</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>שיעורים שבוטלו</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>שיעורים בפועל</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>מחיר לשיעור</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>סה״כ לגבייה</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>מס׳ תלמידים</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.values(monthlySummary).map((summary, index) => (
                                    <TableRow
                                        key={index}
                                        component={motion.tr}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        sx={{
                                            '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.02)' },
                                            '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.05)' }
                                        }}
                                    >
                                        <TableCell align="right">{summary.groupName}</TableCell>
                                        <TableCell align="right">{summary.courseName}</TableCell>
                                        <TableCell align="right">{summary.regularLessons}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={summary.cancelledLessons}
                                                color={summary.cancelledLessons > 0 ? 'error' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={summary.actualLessons}
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">₪{summary.pricePerLesson}</TableCell>
                                        <TableCell align="right">
                                            <Typography sx={{ fontWeight: 'bold', color: '#059669' }}>
                                                ₪{summary.totalPrice}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">{summary.studentsCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* רשימת ביטולים */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#1E40AF' }}>
                            ביטולי שיעורים
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenAddDialog(true)}
                            sx={{ bgcolor: '#DC2626', '&:hover': { bgcolor: '#B91C1C' } }}
                        >
                            בטל שיעור
                        </Button>
                    </Box>

                    <List sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 2 }}>
                        {cancellations
                            .filter(cancellation =>
                                new Date(cancellation.date).getMonth() === selectedMonth &&
                                new Date(cancellation.date).getFullYear() === selectedYear
                            )
                            .map((cancellation, index) => (
                                <ListItem
                                    key={cancellation.id}
                                    component={motion.div}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    sx={{
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        mb: 1,
                                        border: '1px solid #E2E8F0'
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Event sx={{ color: '#DC2626' }} />
                                                <Typography sx={{ fontWeight: 'bold' }}>
                                                    {groups.find(g => g.id === cancellation.groupId)?.name}
                                                </Typography>
                                                <Chip
                                                    label={new Date(cancellation.date).toLocaleDateString('he-IL')}
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={cancellation.reason}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDeleteCancellation(cancellation.id)}
                                            sx={{ color: '#DC2626' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                    </List>

                    {cancellations.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6" color="text.secondary">
                                אין ביטולי שיעורים לחודש זה
                            </Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} variant="outlined">
                        סגור
                    </Button>
                </DialogActions>

                {/* דיאלוג הוספת ביטול */}
                <Dialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: '#DC2626', color: 'white' }}>
                        בטל שיעור
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>בחר קבוצה</InputLabel>
                                    <Select
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        label="בחר קבוצה"
                                    >
                                        {groups.map(group => (
                                            <MenuItem key={group.id} value={group.id}>
                                                {group.name} - {group.courseName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="תאריך השיעור"
                                    value={selectedDate}
                                    onChange={(newValue) => setSelectedDate(newValue)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="סיבת הביטול"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="הזן את הסיבה לביטול השיעור..."
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenAddDialog(false)} color="error">
                            ביטול
                        </Button>
                        <Button
                            onClick={handleAddCancellation}
                            variant="contained"
                            disabled={!selectedGroup || !reason.trim()}
                            sx={{ bgcolor: '#DC2626', '&:hover': { bgcolor: '#B91C1C' } }}
                        >
                            בטל שיעור
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </LocalizationProvider>
    );
};

export default LessonCancellationManager;
