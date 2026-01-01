import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip,
    Divider,
    Switch,
    FormControlLabel
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
    Warning,
    Save,
    Close,
    Refresh,
    CancelScheduleSend,
    RestoreFromTrash,
    CheckCircle,
    ErrorOutline
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { format, parseISO, isSameDay } from 'date-fns';

// Redux actions
import { checkUserPermission } from '../../../utils/permissions';
import { fetchLessonCancellations } from '../../../store/lessonsCancelation/lessonsCancelationGetAll';
import { addLessonCancellation } from '../../../store/lessonsCancelation/lessonsCancelationAdd';
import { updateLessonCancellation } from '../../../store/lessonsCancelation/lessonsCancelationUpdate';
import { deleteLessonCancellation } from '../../../store/lessonsCancelation/lessonsCancelationDelete';
import { clearCancellationError, clearBulkOperationStatus } from '../../../store/lessonsCancelation/lessonsCancelationSlice';
import { fetchGroups } from '../../../store/group/groupGellAllThunk';

// פונקציות חדשות - נצטרך ליצור את ה-thunks האלה
import { cancelAllGroupsForDay } from '../../../store/lessonsCancelation/cancelAllGroupsForDay';
import { getCancellationDetailsByDate } from '../../../store/lessonsCancelation/getCancellationDetailsByDate';
import { removeAllCancellationsForDay } from '../../../store/lessonsCancelation/removeAllCancellationsForDay';
import { checkCancellationsForDay } from '../../../store/lessonsCancelation/checkCancellationsForDay';

const LessonCancellationManager = ({
    open,
    onClose,
    onCancellationUpdate,
    selectedDate = null,
    selectedGroupId = null
}) => {
    const dispatch = useDispatch();

    // Redux state
    const lessonCancellationsState = useSelector(state => state.lessonCancellations || {});
    const groupsState = useSelector(state => state.groups || {});
    const user = useSelector(state => {
        return state.users?.currentUser || state.user?.currentUser || null;
    });
    const userName = user ? user.firstName + ' ' + user.lastName : 'מערכת ניהול שיעורים';
    const [localDaysCancellationStatus, setDaysCancellationStatus] = useState({});
    const {
        cancellations = [],
        loading = false,
        error: reduxError = null,
        cancellationDetailsByDate = {},
        daysCancellationStatus = {},
        bulkOperationLoading = false,
        lastBulkOperation = null
    } = lessonCancellationsState;

    const {
        // Group search and sorting
        // groupsState.groups is the array, groupsState.loading is loading
        // branchName is assumed to be city
        // Add search state
        // Sort by city, then filter by search
        // Use filteredGroups in the Select
        groups = groupsState.groups || [],
        groupsLoading = groupsState.loading || false
    } = groupsState;

    const [groupSearch, setGroupSearch] = useState('');
    // Sort groups by city (branchName assumed as city)
    const sortedGroups = [...groups].sort((a, b) => (a.branchName || '').localeCompare(b.branchName || ''));
    // Filter by search
    const filteredGroups = groupSearch.trim()
        ? sortedGroups.filter(g => g.groupName && g.groupName.toLowerCase().includes(groupSearch.trim().toLowerCase()))
        : sortedGroups;

    // Local state
    const [selectedGroup, setSelectedGroup] = useState(selectedGroupId || '');
    const [selectedCancellationDate, setSelectedCancellationDate] = useState(selectedDate || new Date());
    const [reason, setReason] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [monthlySummary, setMonthlySummary] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingCancellation, setEditingCancellation] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, cancellationId: null, groupName: '', date: '' });

    // **State חדש לפונקציות החדשות:**
    const [bulkCancelDialog, setBulkCancelDialog] = useState({ open: false, date: null, dayOfWeek: '' });
    const [bulkRemoveDialog, setBulkRemoveDialog] = useState({ open: false, date: null, dayOfWeek: '' });
    const [bulkReason, setBulkReason] = useState('');
    const [selectedDayForBulk, setSelectedDayForBulk] = useState('');
    const [selectedDateForBulk, setSelectedDateForBulk] = useState(new Date());
    const [showBulkOperations, setShowBulkOperations] = useState(false);
    const [dayDetails, setDayDetails] = useState(null);

    // Days of week mapping
    const daysOfWeek = [
        { value: 'ראשון', label: 'ראשון' },
        { value: 'שני', label: 'שני' },
        { value: 'שלישי', label: 'שלישי' },
        { value: 'רביעי', label: 'רביעי' },
        { value: 'חמישי', label: 'חמישי' },
        { value: 'שישי', label: 'שישי' },
        { value: 'שבת', label: 'שבת' }
    ];

    // פונקציה לעיבוד שגיאות מהשרת
    const formatErrorMessage = (error) => {
        if (typeof error === 'string') {
            return error;
        }

        if (error && typeof error === 'object') {
            if (error.errors) {
                const errorMessages = [];
                Object.keys(error.errors).forEach(key => {
                    if (Array.isArray(error.errors[key])) {
                        errorMessages.push(...error.errors[key]);
                    } else {
                        errorMessages.push(error.errors[key]);
                    }
                });
                return errorMessages.join(', ');
            }

            if (error.title) {
                return error.title;
            }

            if (error.message) {
                return error.message;
            }
        }

        return 'שגיאה לא ידועה';
    };

    // טעינת נתונים
    useEffect(() => {
        if (open) {
            try {
                dispatch(fetchGroups());
                if (fetchLessonCancellations) {
                    dispatch(fetchLessonCancellations());
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('שגיאה בטעינת הנתונים');
            }
        }
    }, [open, dispatch]);

    // עדכון שגיאות מ-Redux
    useEffect(() => {
        if (reduxError) {
            setError(formatErrorMessage(reduxError));
            dispatch(clearCancellationError());
        }
    }, [reduxError, dispatch]);

    // טיפול בתוצאות פעולות מרובות
    useEffect(() => {
        if (lastBulkOperation) {
            if (lastBulkOperation.success) {
                setSuccess(lastBulkOperation.message);
                setBulkCancelDialog({ open: false, date: null, dayOfWeek: '' });
                setBulkRemoveDialog({ open: false, date: null, dayOfWeek: '' });
                setBulkReason('');
                handleRefreshData();
                if (onCancellationUpdate) {
                    onCancellationUpdate();
                }
            } else {
                setError(formatErrorMessage(lastBulkOperation.error));
            }
            dispatch(clearBulkOperationStatus());
        }
    }, [lastBulkOperation, dispatch, onCancellationUpdate]);

    // חישוב סיכום חודשי
    useEffect(() => {
        calculateMonthlySummary();
    }, [cancellations, selectedMonth, selectedYear, groups]);

    // **פונקציות חדשות:**

    // ביטול כל הקבוצות ביום מסוים
    const handleBulkCancelDay = async () => {
        if (!selectedDayForBulk || !bulkReason.trim()) {
            setError('יש למלא את כל השדות');
            return;
        }
        // הרשאות
        const userId = user?.id || user?.userId;
        if (!checkUserPermission(userId, (msg, severity) => setError(msg))) {
            setError('אין לך הרשאה לבצע ביטול מרובה');
            return;
        }
        try {
            await dispatch(cancelAllGroupsForDay({
                dayOfWeek: selectedDayForBulk,
                date: format(selectedDateForBulk, 'yyyy-MM-dd'),
                reason: bulkReason.trim(),
                createdBy: userName || 'system'
            })).unwrap();
        } catch (error) {
            console.error('Error in bulk cancel:', error);
            setError(formatErrorMessage(error));
        }
    };

    // הסרת כל הביטולים ליום מסוים
    const handleBulkRemoveDay = async () => {
        if (!bulkRemoveDialog.dayOfWeek || !bulkRemoveDialog.date) {
            setError('נתונים חסרים');
            return;
        }
        // הרשאות
        const userId = user?.id || user?.userId;
        if (!checkUserPermission(userId, (msg, severity) => setError(msg))) {
            setError('אין לך הרשאה להסיר ביטולים מרובים');
            return;
        }
        try {
            await dispatch(removeAllCancellationsForDay({
                dayOfWeek: bulkRemoveDialog.dayOfWeek,
                date: format(new Date(bulkRemoveDialog.date), 'yyyy-MM-dd')
            })).unwrap();
        } catch (error) {
            console.error('Error in bulk remove:', error);
            setError(formatErrorMessage(error));
        }
    };

    // קבלת פרטי ביטולים ליום מסוים
    const handleGetDayDetails = async (date, dayOfWeek) => {
        try {
            const result = await dispatch(getCancellationDetailsByDate(format(date, 'yyyy-MM-dd'))).unwrap();
            setDayDetails({
                date,
                dayOfWeek,
                details: result.cancellationDetails || []
            });
        } catch (error) {
            console.error('Error getting day details:', error);
            setError(formatErrorMessage(error));
        }
    };

    // בדיקת סטטוס ביטולים ליום מסוים
   const checkDayStatus = (date, dayOfWeek) => {
    if (!dayOfWeek || !date) {
        setError('יש לבחור יום ותאריך');
        return;
    }

    try {
        // בדיקה מקומית בנתונים הקיימים
        const dateString = format(date, 'yyyy-MM-dd');
        const dayGroups = groups.filter(group => group.dayOfWeek === dayOfWeek);
        
        const cancellationsForDay = cancellations.filter(cancellation => {
            const cancellationDate = format(new Date(cancellation.date), 'yyyy-MM-dd');
            const group = groups.find(g => g.groupId === cancellation.groupId);
            return cancellationDate === dateString && group?.dayOfWeek === dayOfWeek;
        });

        const key = `${dayOfWeek}-${dateString}`;
        
        // עדכון מקומי של הסטטוס
        setDaysCancellationStatus(prev => ({
            ...prev,
            [key]: {
                hasCancellations: cancellationsForDay.length > 0,
                count: cancellationsForDay.length
            }
        }));

        setSuccess(`נמצאו ${cancellationsForDay.length} ביטולים ליום ${dayOfWeek} בתאריך ${new Date(date).toLocaleDateString('he-IL')}`);
        
    } catch (error) {
        console.error('Error checking day status:', error);
        setError('שגיאה בבדיקת סטטוס היום');
    }
};
    // קבלת סטטוס יום מסוים
   const getDayStatus = (date, dayOfWeek) => {
    const key = `${dayOfWeek}-${format(date, 'yyyy-MM-dd')}`;
    return localDaysCancellationStatus[key] || daysCancellationStatus[key] || { hasCancellations: false, count: 0 };
};

    const getCancellationForDate = (groupId, date) => {
        return Array.isArray(cancellations) ? cancellations.find(cancellation =>
            cancellation.groupId === groupId &&
            isSameDay(new Date(cancellation.date), new Date(date))
        ) : null;
    };

    const getCancellationsForDate = (date) => {
        return Array.isArray(cancellations) ? cancellations.filter(cancellation =>
            isSameDay(new Date(cancellation.date), new Date(date))
        ) : [];
    };

    const getCancellationsForGroup = (groupId) => {
        return Array.isArray(cancellations) ? cancellations.filter(cancellation => cancellation.groupId === groupId) : [];
    };

    const checkExistingCancellation = (groupId, date) => {
        if (!Array.isArray(cancellations)) return false;
        return cancellations.some(cancellation =>
            cancellation.groupId === parseInt(groupId) &&
            isSameDay(new Date(cancellation.date), new Date(date))
        );
    };

    const calculateMonthlySummary = () => {
        if (!groups.length) return;

        const summary = {};

        groups.forEach(group => {
            const groupCancellations = Array.isArray(cancellations) ? cancellations.filter(cancellation =>
                cancellation.groupId === group.groupId &&
                new Date(cancellation.date).getMonth() === selectedMonth &&
                new Date(cancellation.date).getFullYear() === selectedYear
            ) : [];

            const cancelledLessons = groupCancellations.length;
            const numOfLessons = group.numOfLessons || 0;
            const lessonsCompleted = group.lessonsCompleted || 0;
            const remainingLessons = Math.max(0, numOfLessons - lessonsCompleted);

            summary[group.groupId] = {
                groupName: group.groupName,
                courseName: group.courseName,
                branchName: group.branchName,
                numOfLessons: numOfLessons,
                lessonsCompleted: lessonsCompleted,
                remainingLessons: remainingLessons,
                cancelledLessons: cancelledLessons,
                dayOfWeek: group.dayOfWeek,
                hour: group.hour,
                ageRange: group.ageRange,
                maxStudents: group.maxStudents,
                sector: group.sector,
                startDate: group.startDate,
                cancellationDetails: groupCancellations
            };
        });

        setMonthlySummary(summary);
    };

    const handleAddCancellation = async () => {
        if (!selectedGroup || !reason.trim()) {
            setError('יש למלא את כל השדות');
            return;
        }
        if (checkExistingCancellation(selectedGroup, selectedCancellationDate)) {
            const group = groups.find(g => g.groupId === parseInt(selectedGroup));
            setError(`כבר קיים ביטול לקבוצה "${group?.groupName || 'לא ידועה'}" בתאריך ${new Date(selectedCancellationDate).toLocaleDateString('he-IL')}`);
            return;
        }
        // הרשאות
        const userId = user?.id || user?.userId;
        if (!checkUserPermission(userId, (msg, severity) => setError(msg))) {
            setError('אין לך הרשאה להוסיף ביטול שיעור');
            return;
        }
        try {
            const newCancellation = {
                groupId: parseInt(selectedGroup),
                date: format(selectedCancellationDate, 'yyyy-MM-dd'),
                reason: reason.trim(),
                created_by: userName || 'system'
            };
            console.log('Sending cancellation data:', newCancellation);
            await dispatch(addLessonCancellation(newCancellation)).unwrap();
            setOpenAddDialog(false);
            resetForm();
            setSuccess('השיעור בוטל בהצלחה');
            handleRefreshData();
            if (onCancellationUpdate) {
                onCancellationUpdate();
            }
        } catch (error) {
            console.error('Error adding cancellation:', error);
            setError(formatErrorMessage(error));
        }
    };

    const handleEditCancellation = async (cancellationId, updatedData) => {
        // הרשאות
        const userId = user?.id || user?.userId;
        if (!checkUserPermission(userId, (msg, severity) => setError(msg))) {
            setError('אין לך הרשאה לערוך ביטול שיעור');
            return;
        }
        try {
            const updatePayload = {
                id: cancellationId,
                ...updatedData,
                created_by: userName || 'system'
            };
            await dispatch(updateLessonCancellation(updatePayload)).unwrap();
            setEditingCancellation(null);
            setSuccess('הביטול עודכן בהצלחה');
            handleRefreshData();
            if (onCancellationUpdate) {
                onCancellationUpdate();
            }
        } catch (error) {
            console.error('Error updating cancellation:', error);
            setError(formatErrorMessage(error));
        }
    };

    const handleDeleteCancellation = async (cancellationId) => {
        if (!cancellationId) {
            setError('מזהה ביטול לא תקין');
            return;
        }
        // הרשאות
        const userId = user?.id || user?.userId;
        if (!checkUserPermission(userId, (msg, severity) => setError(msg))) {
            setError('אין לך הרשאה למחוק ביטול שיעור');
            return;
        }
        try {
            await dispatch(deleteLessonCancellation(cancellationId)).unwrap();
            setSuccess('הביטול נמחק בהצלחה');
            setDeleteDialog({ open: false, cancellationId: null, groupName: '', date: '' });
            if (onCancellationUpdate) {
                onCancellationUpdate();
            }
            handleRefreshData();
        } catch (error) {
            console.error('Error deleting cancellation:', error);
            setError(formatErrorMessage(error));
        }
    };

    const openDeleteDialog = (cancellation) => {
        if (!cancellation || !cancellation.id) {
            setError('נתוני ביטול לא תקינים');
            return;
        }
        const group = groups.find(g => g.groupId === cancellation.groupId);
        setDeleteDialog({
            open: true,
            cancellationId: cancellation.id,
            groupName: group?.groupName || 'לא ידועה',
            courseName: group?.courseName || 'לא ידועה',
            branchName: group?.branchName || 'לא ידועה',
            date: new Date(cancellation.date).toLocaleDateString('he-IL')
        });
    };

    const handleRefreshData = () => {
        try {
            if (fetchLessonCancellations) {
                dispatch(fetchLessonCancellations());
            }
            dispatch(fetchGroups());
        } catch (err) {
            console.error('Error refreshing data:', err);
            setError('שגיאה ברענון הנתונים');
        }
    };

    const resetForm = () => {
        setSelectedGroup(selectedGroupId || '');
        setReason('');
        setSelectedCancellationDate(selectedDate || new Date());
    };

    const resetBulkForm = () => {
        setSelectedDayForBulk('');
        setSelectedDateForBulk(new Date());
        setBulkReason('');
    };

    const monthNames = [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
        'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];

    const filteredCancellations = Array.isArray(cancellations) ? cancellations.filter(cancellation =>
        new Date(cancellation.date).getMonth() === selectedMonth &&
        new Date(cancellation.date).getFullYear() === selectedYear
    ).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

    if (!open) {
        return null;
    }

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
                        minHeight: '80vh',
                        direction: 'rtl',
                        fontFamily: 'Arial, sans-serif'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: '#DC2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        direction: 'rtl',
                        textAlign: 'right'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, direction: 'rtl' }}>
                        <Warning />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            ניהול ביטולי שיעורים וסיכום חודשי
                        </span>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="פעולות מרובות">
                            <IconButton
                                onClick={() => setShowBulkOperations(!showBulkOperations)}
                                sx={{ 
                                    color: showBulkOperations ? '#FCD34D' : 'white',
                                    bgcolor: showBulkOperations ? 'rgba(255,255,255,0.1)' : 'transparent'
                                }}
                            >
                                <CancelScheduleSend />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="רענן נתונים">
                            <IconButton
                                onClick={handleRefreshData}
                                sx={{ color: 'white' }}
                                disabled={loading || bulkOperationLoading}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </DialogTitle>

                <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                    {(loading || groupsLoading) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {/* **סעיף חדש - פעולות מרובות** */}
                    <AnimatePresence>
                        {showBulkOperations && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                              <br />  
                                <Card sx={{ mb: 4, bgcolor:'ButtonFace', border: '1px solid #F59E0B' }}>
                                  <CardContent>
                                        <Typography variant="h6" sx={{ mb: 3, color: '#92400E', textAlign: 'right', fontWeight: 'bold' }}>
                                            <CancelScheduleSend sx={{ verticalAlign: 'middle', mr: 1 }} />
                                            פעולות מרובות - ביטול/החזרת שיעורים ליום שלם
                                        </Typography>
                                        
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Card sx={{ p: 2, bgcolor: '#FEE2E2', border: '1px solid #F87171' }}>
                                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#991B1B' }}>
                                                        ביטול כל השיעורים ביום מסוים
                                                    </Typography>
                                                    
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} sx={{minWidth:'130px'}}>
                                                            <FormControl fullWidth size="small">
                                                                <InputLabel>יום בשבוע</InputLabel>
                                                                <Select
                                                                    value={selectedDayForBulk}
                                                                    onChange={(e) => setSelectedDayForBulk(e.target.value)}
                                                                    label="יום בשבוע"
                                                                >
                                                                    {daysOfWeek.map(day => (
                                                                        <MenuItem key={day.value} value={day.value}>
                                                                            {day.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} sx={{ direction: 'ltr' }}>
                                                            <DatePicker
                                                                label="תאריך"
                                                                value={selectedDateForBulk}
                                                                onChange={(newValue) => setSelectedDateForBulk(newValue)}
                                                                renderInput={(params) => 
                                                                    <TextField {...params} fullWidth size="small" />
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                fullWidth
                                                                size="small"
                                                                label="סיבת הביטול"
                                                                value={selectedGroup}
                                                                onChange={(e) => setSelectedGroup(e.target.value)}
                                                                sx={{
                                                                    direction: 'rtl',
                                                                    textAlign: 'right',
                                                                    '& .MuiSelect-select': {
                                                                        direction: 'rtl',
                                                                        textAlign: 'right',
                                                                        paddingRight: '14px'
                                                                    }
                                                                }}
                                                            >
                                                                {filteredGroups.map(group => (
                                                                    <MenuItem
                                                                        key={group.groupId}
                                                                        value={group.groupId}
                                                                        sx={{ direction: 'rtl', textAlign: 'right', justifyContent: 'flex-end' }}
                                                                    >
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: 1,
                                                                            direction: 'rtl',
                                                                            textAlign: 'right'
                                                                        }}>
                                                                            <Group sx={{ fontSize: 16 }} />
                                                                            <Typography sx={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
                                                                                {group.courseName} - {group.branchName} - {group.groupName}
                                                                            </Typography>
                                                                        </Box>
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                            <FormControl fullWidth size="small">
                                                                <InputLabel>יום לבדיקה</InputLabel>
                                                                <Select
                                                                    value={selectedDayForBulk}
                                                                    onChange={(e) => setSelectedDayForBulk(e.target.value)}
                                                                    label="יום לבדיקה"
                                                                >
                                                                    {daysOfWeek.map(day => (
                                                                        <MenuItem key={day.value} value={day.value}>
                                                                            {day.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6} sx={{ direction: 'ltr' }}>
                                                            <DatePicker
                                                                label="תאריך לבדיקה"
                                                                value={selectedDateForBulk}
                                                                onChange={(newValue) => setSelectedDateForBulk(newValue)}
                                                                renderInput={(params) => 
                                                                    <TextField {...params} fullWidth size="small" />
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sx={{direction:'ltr'}}>
                                                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                                                <Button
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    onClick={() => checkDayStatus(selectedDateForBulk, selectedDayForBulk)}
                                                                    disabled={!selectedDayForBulk}
                                                                    startIcon={<CheckCircle  />}
                                                                >
                                                                    בדוק סטטוס יום
                                                                </Button>
                                                                
                                                                <Button
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    color="info"
                                                                    onClick={() => handleGetDayDetails(selectedDateForBulk, selectedDayForBulk)}
                                                                    disabled={!selectedDayForBulk}
                                                                    startIcon={<Event />}
                                                                >
                                                                    הצג פרטי ביטולים
                                                                </Button>

                                                                {getDayStatus(selectedDateForBulk, selectedDayForBulk).hasCancellations && (
                                                                    <Button
                                                                        fullWidth
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => setBulkRemoveDialog({
                                                                            open: true,
                                                                            date: selectedDateForBulk,
                                                                            dayOfWeek: selectedDayForBulk
                                                                        })}
                                                                        startIcon={<RestoreFromTrash />}
                                                                    >
                                                                        החזר את כל השיעורים
                                                                    </Button>
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    {/* הצגת סטטוס היום */}
                                                    {selectedDayForBulk && (
                                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                                                            {(() => {
                                                                const status = getDayStatus(selectedDateForBulk, selectedDayForBulk);
                                                                return (
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
                                                                        {status.hasCancellations ? (
                                                                            <>
                                                                                <ErrorOutline sx={{ color: '#DC2626' }} />
                                                                                <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 'bold' }}>
                                                                                    יש {status.count} ביטולים ביום זה
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <CheckCircle sx={{ color: '#059669' }} />
                                                                                <Typography variant="body2" sx={{ color: '#059669', fontWeight: 'bold' }}>
                                                                                    אין ביטולים ביום זה
                                                                                </Typography>
                                                                            </>
                                                                        )}
                                                                    </Box>
                                                                );
                                                            })()}
                                                        </Box>
                                                    )}
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* **הצגת פרטי יום** */}
                    <AnimatePresence>
                        {dayDetails && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card sx={{ mb: 4, bgcolor: '#F0F9FF', border: '1px solid #0EA5E9' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ color: '#0C4A6E', fontWeight: 'bold' }}>
                                                פרטי ביטולים ליום {dayDetails.dayOfWeek} - {new Date(dayDetails.date).toLocaleDateString('he-IL')}
                                            </Typography>
                                            <IconButton onClick={() => setDayDetails(null)} size="small">
                                                <Close />
                                            </IconButton>
                                        </Box>
                                        
                                        {dayDetails.details.length > 0 ? (
                                            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="right">קבוצה</TableCell>
                                                            <TableCell align="right">חוג</TableCell>
                                                            <TableCell align="right">סניף</TableCell>
                                                            <TableCell align="right">שעה</TableCell>
                                                            <TableCell align="right">סיבה</TableCell>
                                                            <TableCell align="right">נוצר על ידי</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dayDetails.details.map((detail, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell align="right">{detail.groupName}</TableCell>
                                                                <TableCell align="right">{detail.courseName}</TableCell>
                                                                <TableCell align="right">{detail.branchName}</TableCell>
                                                                <TableCell align="right">{detail.hour}</TableCell>
                                                                <TableCell align="right">{detail.reason}</TableCell>
                                                                <TableCell align="right">{detail.created_by}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 2 }}>
                                                אין ביטולים ביום זה
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <br />
                    {/* בחירת חודש לסיכום */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth sx={{ direction: 'ltr' }}>
                                <InputLabel sx={{ transformOrigin: 'top right' }}>
                                    חודש
                                </InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    label="חודש"
                                    sx={{
                                        '& .MuiSelect-select': {
                                            paddingRight: '14px'
                                        }
                                    }}
                                >
                                    {monthNames.map((month, index) => (
                                        <MenuItem key={index} value={index} sx={{ direction: 'rtl', justifyContent: 'flex-end' }}>
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
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        transformOrigin: 'top right'
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        textAlign: 'right'
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* סיכום חודשי */}
                    <Typography variant="h6" sx={{ mb: 3, color: '#1E40AF', textAlign: 'right', fontWeight: 'bold' }}>
                        סיכום חודשי - {monthNames[selectedMonth]} {selectedYear}
                    </Typography>

                    <TableContainer
                        component={Paper}
                        sx={{
                            mb: 4,
                            borderRadius: 2,
                            direction: 'rtl',
                            maxHeight: 500,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#c1c1c1',
                                borderRadius: '4px',
                                '&:hover': {
                                    backgroundColor: '#a8a8a8'
                                }
                            }
                        }}
                    >
                        <Table sx={{ direction: 'rtl' }} stickyHeader>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#F1F5F9' }}>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>קבוצה</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>חוג</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>סניף</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>יום</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>שעה</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>שיעורים שהושלמו</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>מתוך שיעורים</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>שיעורים נותרו</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '14px' }}>ביטולים החודש</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {Object.values(monthlySummary).map((summary, index) => (
                                        <TableRow
                                            key={index}
                                            component={motion.tr}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            sx={{
                                                '&:nth-of-type(odd)': { bgcolor: 'rgba(59, 130, 246, 0.02)' },
                                                '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.05)' }
                                            }}
                                        >
                                            <TableCell align="right" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                                {summary.groupName}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '13px' }}>
                                                {summary.courseName}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '13px' }}>
                                                {summary.branchName}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '13px' }}>
                                                {summary.dayOfWeek}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '13px' }}>
                                                {summary.hour ? summary.hour.toString() : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={summary.lessonsCompleted}
                                                    color="success"
                                                    size="small"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                                {summary.numOfLessons}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={summary.remainingLessons}
                                                    color={summary.remainingLessons > 0 ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={summary.cancelledLessons}
                                                    color={summary.cancelledLessons > 0 ? 'error' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* רשימת ביטולים */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        direction: 'rtl'
                    }}>
                        <Typography variant="h6" sx={{ color: '#1E40AF', textAlign: 'right', fontWeight: 'bold' }}>
                            ביטולי שיעורים - {monthNames[selectedMonth]} {selectedYear}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenAddDialog(true)}
                            sx={{
                                bgcolor: '#DC2626',
                                '&:hover': { bgcolor: '#B91C1C' },
                                direction: 'rtl',
                                fontWeight: 'bold'
                            }}
                            disabled={loading}
                        >
                            בטל שיעור
                        </Button>
                    </Box>

                    <List sx={{
                        bgcolor: '#F8FAFC',
                        borderRadius: 2,
                        p: 2,
                        maxHeight: 400,
                        overflow: 'auto',
                        direction: 'rtl'
                    }}>
                        <AnimatePresence>
                            {filteredCancellations.map((cancellation, index) => {
                                const group = groups.find(g => g.groupId === cancellation.groupId);
                                const isEditing = editingCancellation?.id === cancellation.id;

                                return (
                                    <ListItem
                                        key={cancellation.id}
                                        component={motion.div}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        sx={{
                                            bgcolor: 'white',
                                            borderRadius: 1,
                                            mb: 2,
                                            border: '1px solid #E2E8F0',
                                            flexDirection: 'column',
                                            alignItems: 'stretch',
                                            direction: 'rtl',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {isEditing ? (
                                            <Box sx={{ width: '100%', p: 2, direction: 'rtl' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="סיבת הביטול"
                                                            value={editingCancellation.reason}
                                                            onChange={(e) => setEditingCancellation({
                                                                ...editingCancellation,
                                                                reason: e.target.value
                                                            })}
                                                            multiline
                                                            rows={2}
                                                            sx={{
                                                                '& .MuiInputLabel-root': {
                                                                    right: 139,
                                                                    left: 'auto',
                                                                    transformOrigin: 'top right'
                                                                },
                                                                '& .MuiOutlinedInput-input': {
                                                                    textAlign: 'right'
                                                                }
                                                            }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6} sx={{ direction: 'ltr' }}>
                                                        <DatePicker
                                                            label="תאריך השיעור"
                                                            value={new Date(editingCancellation.date)}
                                                            onChange={(newValue) => setEditingCancellation({
                                                                ...editingCancellation,
                                                                date: format(newValue, 'yyyy-MM-dd')
                                                            })}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    {...params}
                                                                    fullWidth
                                                                    sx={{
                                                                        '& .MuiInputLabel-root': {
                                                                            right: 14,
                                                                            left: 'auto',
                                                                            transformOrigin: 'top right'
                                                                        },
                                                                        '& .MuiOutlinedInput-input': {
                                                                            textAlign: 'right'
                                                                        }
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            gap: 1,
                                                            justifyContent: 'flex-start',
                                                            direction: 'rtl'
                                                        }}>
                                                            <Button
                                                                size="small"
                                                                variant="contained"
                                                                onClick={() => handleEditCancellation(
                                                                    cancellation.id,
                                                                    {
                                                                        reason: editingCancellation.reason,
                                                                        date: editingCancellation.date,
                                                                        groupId: cancellation.groupId
                                                                    }
                                                                )}
                                                                startIcon={<Save />}
                                                                disabled={loading}
                                                                sx={{
                                                                    bgcolor: '#059669',
                                                                    '&:hover': { bgcolor: '#047857' }
                                                                }}
                                                            >
                                                                שמור
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                onClick={() => setEditingCancellation(null)}
                                                                startIcon={<Close />}
                                                                variant="outlined"
                                                            >
                                                                ביטול
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ) : (
                                            <>
                                                <ListItemText
                                                    primary={
                                                        <>
                                                            <Event sx={{ color: '#DC2626', verticalAlign: 'middle', mr: 1 }} />
                                                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                                                קבוצה {group?.groupName || 'לא נמצאה'}
                                                            </span>
                                                            {' '}
                                                            <Chip
                                                                label={new Date(cancellation.date).toLocaleDateString('he-IL')}
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"
                                                                sx={{ ml: 1 }}
                                                            />
                                                            {group?.courseName && (
                                                                <Chip
                                                                    label={group.courseName}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                    sx={{ ml: 1 }}
                                                                />
                                                            )}
                                                            {group?.branchName && (
                                                                <Chip
                                                                    label={group.branchName}
                                                                    size="small"
                                                                    color="success"
                                                                    variant="outlined"
                                                                    sx={{ ml: 1 }}
                                                                />
                                                            )}
                                                        </>
                                                    }
                                                    secondary={
                                                        <>
                                                            <strong>סיבה:</strong> {cancellation.reason}
                                                            <br />
                                                            <span style={{ fontSize: '0.75rem' }}>
                                                                נוצר: {cancellation.created_at ? new Date(cancellation.created_at).toLocaleDateString('he-IL') : 'לא זמין'}
                                                                {cancellation.created_at && ' ' + new Date(cancellation.created_at).toLocaleTimeString('he-IL')}
                                                            </span>
                                                            {cancellation.created_by && (
                                                                <>
                                                                    <br />
                                                                    <span style={{ fontSize: '0.75rem' }}>
                                                                        נוצר על ידי: {cancellation.created_by}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </>
                                                    }
                                                    primaryTypographyProps={{
                                                        sx: {
                                                            direction: 'rtl',
                                                            textAlign: 'right'
                                                        }
                                                    }}
                                                    secondaryTypographyProps={{
                                                        sx: {
                                                            direction: 'rtl',
                                                            textAlign: 'right',
                                                            color: 'text.secondary'
                                                        }
                                                    }}
                                                />
                                                <ListItemSecondaryAction sx={{ right: 'auto', left: 16 }}>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Tooltip title="ערוך ביטול">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => setEditingCancellation({
                                                                    id: cancellation.id,
                                                                    reason: cancellation.reason,
                                                                    date: cancellation.date
                                                                })}
                                                                sx={{ color: '#1976d2' }}
                                                                disabled={loading}
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="מחק ביטול">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => openDeleteDialog(cancellation)}
                                                                sx={{ color: '#DC2626' }}
                                                                disabled={loading}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </ListItemSecondaryAction>
                                            </>
                                        )}
                                    </ListItem>
                                );
                            })}
                        </AnimatePresence>
                    </List>

                    {filteredCancellations.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Box sx={{ textAlign: 'center', py: 4, direction: 'rtl' }}>
                                <CalendarToday sx={{ fontSize: 64, color: '#9CA3AF', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    אין ביטולי שיעורים לחודש זה
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    כל השיעורים מתוכננים להתקיים כרגיל
                                </Typography>
                            </Box>
                        </motion.div>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 3, bgcolor: '#F8FAFC', direction: 'rtl' }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        size="large"
                        sx={{ fontWeight: 'bold' }}
                    >
                        סגור
                    </Button>
                </DialogActions>

                {/* דיאלוג הוספת ביטול */}
                <Dialog
                    open={openAddDialog}
                    onClose={() => {
                        setOpenAddDialog(false);
                        resetForm();
                    }}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 12,
                            direction: 'rtl'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#DC2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        direction: 'rtl',
                        textAlign: 'right'
                    }}>
                        <Cancel />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            בטל שיעור
                        </span>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sx={{ minWidth: '120px' }}>
                                <FormControl fullWidth>
                                    <InputLabel sx={{
                                        transformOrigin: 'top right',
                                        direction: 'rtl',
                                        textAlign: 'right',
                                        right: 0,
                                        left: 'auto'
                                    }}>
                                        {/* בחר קבוצה */}
                                    </InputLabel>
                                    <Select
                                        value={selectedGroup}
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                        label="בחר קבוצה"
                                        displayEmpty
                                        sx={{
                                            direction: 'rtl',
                                            textAlign: 'right',
                                            '& .MuiSelect-select': {
                                                direction: 'rtl',
                                                textAlign: 'right',
                                                paddingRight: '14px'
                                            }
                                        }}
                                        renderValue={selected => {
                                            if (!selected) {
                                                return <span style={{ color: '#888', direction: 'rtl', textAlign: 'right' }}>בחר קבוצה</span>;
                                            }
                                            const group = filteredGroups.find(g => g.groupId === selected);
                                            return group ? `${group.groupName} - ${group.branchName} - ${group.courseName}` : '';
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <span style={{ color: '#888', direction: 'rtl', textAlign: 'right', width: '100%' }}>בחר קבוצה</span>
                                        </MenuItem>
                                        {filteredGroups.map(group => (
                                            <MenuItem
                                                key={group.groupId}
                                                value={group.groupId}
                                                sx={{ direction: 'rtl', textAlign: 'right', justifyContent: 'flex-end' }}
                                            >
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    direction: 'rtl',
                                                    textAlign: 'right',
                                                    width: '100%'
                                                }}>
                                                    <Group sx={{ fontSize: 16 }} />
                                                    <Typography sx={{ direction: 'rtl', textAlign: 'right', width: '100%' }}>
                                                        {group.groupName} - {group.branchName} - {group.courseName}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
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
                                    helperText="לדוגמה: חופש, חג, מזג אוויר קשה וכו'"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            right: 220,
                                            transformOrigin: 'top-right'
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            textAlign: 'right'
                                        },
                                        '& .MuiFormHelperText-root': {
                                            textAlign: 'right',
                                            marginRight: 0,
                                            marginLeft: 14
                                        }
                                    }}
                                />
                            </Grid>
                            {selectedGroup && selectedCancellationDate && checkExistingCancellation(selectedGroup, selectedCancellationDate) && (
                                <Grid item xs={12}>
                                    <Alert severity="warning" sx={{ direction: 'rtl' }}>
                                        כבר קיים ביטול לקבוצה זו בתאריך זה. לא ניתן להוסיף ביטול נוסף.
                                    </Alert>
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, direction: 'rtl' }}>
                        <Button
                            onClick={handleAddCancellation}
                            variant="contained"
                            disabled={!selectedGroup || !reason.trim() || loading || checkExistingCancellation(selectedGroup, selectedCancellationDate)}
                            sx={{
                                bgcolor: '#DC2626',
                                '&:hover': { bgcolor: '#B91C1C' },
                                fontWeight: 'bold'
                            }}
                            startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                        >

                            {loading ? 'מבטל...' : 'בטל שיעור'}
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenAddDialog(false);
                                resetForm();
                            }}
                            color="error"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ביטול
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* **דיאלוג ביטול כל השיעורים ביום** */}
                <Dialog
                    open={bulkCancelDialog.open}
                    onClose={() => setBulkCancelDialog({ open: false, date: null, dayOfWeek: '' })}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 12,
                            direction: 'rtl'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#DC2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        direction: 'rtl',
                        textAlign: 'right'
                    }}>
                        <CancelScheduleSend />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            ביטול כל השיעורים ביום {bulkCancelDialog.dayOfWeek}
                        </span>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                        <br />
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'right' }}>
                            האם אתה בטוח שברצונך לבטל את כל השיעורים ביום {bulkCancelDialog.dayOfWeek}?
                        </Typography>
                        <Box sx={{
                            bgcolor: '#FEF2F2',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid #FECACA',
                            direction: 'rtl',
                            mb: 3
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                פרטי הביטול:
                            </Typography>
                            <Typography variant="body2">
                                <strong>יום:</strong> {bulkCancelDialog.dayOfWeek}
                            </Typography>
                            <Typography variant="body2">
                                <strong>תאריך:</strong> {bulkCancelDialog.date ? new Date(bulkCancelDialog.date).toLocaleDateString('he-IL') : ''}
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="סיבת הביטול"
                            value={bulkReason}
                            onChange={(e) => setBulkReason(e.target.value)}
                            placeholder="הזן את הסיבה לביטול כל השיעורים..."
                            helperText="לדוגמה: חג, מזג אוויר קשה, אירוע מיוחד וכו'"
                            sx={{
                                '& .MuiInputLabel-root': {
                                    right: 220,
                                    transformOrigin: 'top-right'
                                },
                                '& .MuiOutlinedInput-input': {
                                    textAlign: 'right'
                                },
                                '& .MuiFormHelperText-root': {
                                    textAlign: 'right',
                                    marginRight: 0,
                                    marginLeft: 14
                                }
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
                            פעולה זו תבטל את כל השיעורים המתוכננים ליום זה
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, direction: 'rtl' }}>
                        <Button
                            onClick={handleBulkCancelDay}
                            variant="contained"
                            color="error"
                            disabled={!bulkReason.trim() || bulkOperationLoading}
                            sx={{ fontWeight: 'bold' }}
                            startIcon={bulkOperationLoading ? <CircularProgress size={16} /> : <CancelScheduleSend />}
                        >
                            {bulkOperationLoading ? 'מבטל...' : 'בטל את כל השיעורים'}
                        </Button>
                        <Button
                            onClick={() => {
                                setBulkCancelDialog({ open: false, date: null, dayOfWeek: '' });
                                setBulkReason('');
                            }}
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ביטול
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* **דיאלוג החזרת כל השיעורים ביום** */}
                <Dialog
                    open={bulkRemoveDialog.open}
                    onClose={() => setBulkRemoveDialog({ open: false, date: null, dayOfWeek: '' })}
                    maxWidth="sm"
                    fullWidth
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 12,
                            direction: 'rtl'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#059669',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        direction: 'rtl',
                        textAlign: 'right'
                    }}>
                        <RestoreFromTrash />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            החזרת כל השיעורים ליום {bulkRemoveDialog.dayOfWeek}
                        </span>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                        <br />
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'right' }}>
                            האם אתה בטוח שברצונך להחזיר את כל השיעורים ליום {bulkRemoveDialog.dayOfWeek}?
                        </Typography>
                        <Box sx={{
                            bgcolor: '#ECFDF5',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid #A7F3D0',
                            direction: 'rtl',
                            mb: 2
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                פרטי ההחזרה:
                            </Typography>
                            <Typography variant="body2">
                                <strong>יום:</strong> {bulkRemoveDialog.dayOfWeek}
                            </Typography>
                            <Typography variant="body2">
                                <strong>תאריך:</strong> {bulkRemoveDialog.date ? new Date(bulkRemoveDialog.date).toLocaleDateString('he-IL') : ''}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                            פעולה זו תמחק את כל הביטולים ליום זה ותחזיר את השיעורים למצב רגיל
                        </Typography>
                        <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'right', fontWeight: 'bold' }}>
                            פעולה זו אינה ניתנת לביטול
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, direction: 'rtl' }}>
                        <Button
                            onClick={handleBulkRemoveDay}
                            variant="contained"
                            color="success"
                            disabled={bulkOperationLoading}
                            sx={{ fontWeight: 'bold' }}
                            startIcon={bulkOperationLoading ? <CircularProgress size={16} /> : <RestoreFromTrash />}
                        >
                            {bulkOperationLoading ? 'מחזיר...' : 'החזר את כל השיעורים'}
                        </Button>
                        <Button
                            onClick={() => setBulkRemoveDialog({ open: false, date: null, dayOfWeek: '' })}
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ביטול
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* דיאלוג אישור מחיקה */}
                <Dialog
                    open={deleteDialog.open}
                    onClose={() => setDeleteDialog({ open: false, cancellationId: null, groupName: '', date: '', courseName: '', branchName: '' })}
                    maxWidth="sm"
                    sx={{
                        '& .MuiDialog-paper': {
                            borderRadius: 12,
                            direction: 'rtl'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        bgcolor: '#DC2626',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        direction: 'rtl',
                        textAlign: 'right'
                    }}>
                        <Warning />
                        <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                            אישור מחיקת ביטול
                        </span>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, direction: 'rtl' }}>
                        <br />
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'right' }}>
                            האם אתה בטוח שברצונך למחוק את הביטול?
                        </Typography>
                        <Box sx={{
                            bgcolor: '#FEF2F2',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid #FECACA',
                            direction: 'rtl'
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                פרטי הביטול:
                            </Typography>
                            <Typography variant="body2">
                                <strong>חוג:</strong> {deleteDialog.courseName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>סניף:</strong> {deleteDialog.branchName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>קבוצה:</strong> {deleteDialog.groupName}
                            </Typography>
                            <Typography variant="body2">
                                <strong>תאריך:</strong> {deleteDialog.date}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
                            פעולה זו אינה ניתנת לביטול
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, direction: 'rtl' }}>
                        <Button
                            onClick={() => handleDeleteCancellation(deleteDialog.cancellationId)}
                            variant="contained"
                            color="error"
                            disabled={loading}
                            sx={{ fontWeight: 'bold' }}
                            startIcon={loading ? <CircularProgress size={16} /> : <Delete />}
                        >
                            {loading ? 'מוחק...' : 'מחק ביטול'}
                        </Button>
                        <Button
                            onClick={() => setDeleteDialog({ open: false, cancellationId: null, groupName: '', date: '' })}
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        >
                            ביטול
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* הודעות */}
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert
                        onClose={() => setError('')}
                        severity="error"
                        sx={{
                            width: '100%',
                            direction: 'rtl',
                            '& .MuiAlert-message': {
                                textAlign: 'right'
                            }
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={!!success}
                    autoHideDuration={4000}
                    onClose={() => setSuccess('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <Alert
                        onClose={() => setSuccess('')}
                        severity="success"
                        sx={{
                            width: '100%',
                            direction: 'rtl',
                            '& .MuiAlert-message': {
                                textAlign: 'right'
                            }
                        }}
                    >
                        {success}
                    </Alert>
                </Snackbar>
            </Dialog>
        </LocalizationProvider>
    );
};

// Hook מותאם אישית לשימוש בביטולי שיעורים
export const useLessonCancellations = () => {
    const dispatch = useDispatch();
    const { 
        cancellations, 
        loading, 
        error, 
        cancellationDetailsByDate,
        daysCancellationStatus,
        bulkOperationLoading 
    } = useSelector(state => state.lessonCancellations || {});

    const fetchCancellations = () => {
        return dispatch(fetchLessonCancellations());
    };

    const getCancellationForDate = (groupId, date) => {
        return Array.isArray(cancellations) ? cancellations.find(cancellation =>
            cancellation.groupId === groupId &&
            isSameDay(new Date(cancellation.date), new Date(date))
        ) : null;
    };

    const getCancellationsForDate = (date) => {
        return Array.isArray(cancellations) ? cancellations.filter(cancellation =>
            isSameDay(new Date(cancellation.date), new Date(date))
        ) : [];
    };

    const getCancellationsForGroup = (groupId) => {
        return Array.isArray(cancellations) ? cancellations.filter(cancellation => cancellation.groupId === groupId) : [];
    };

    const addCancellation = (cancellationData) => {
        return dispatch(addLessonCancellation(cancellationData));
    };

    const updateCancellation = (cancellationData) => {
        return dispatch(updateLessonCancellation(cancellationData));
    };

    const deleteCancellation = (cancellationId) => {
        return dispatch(deleteLessonCancellation(cancellationId));
    };

    // **פונקציות חדשות להוק:**
    const cancelAllGroupsForDayAction = (data) => {
        return dispatch(cancelAllGroupsForDay(data));
    };

    const getCancellationDetailsByDateAction = (date) => {
        return dispatch(getCancellationDetailsByDate(date));
    };

    const removeAllCancellationsForDayAction = (data) => {
        return dispatch(removeAllCancellationsForDay(data));
    };

    const checkCancellationsForDayAction = (data) => {
        return dispatch(checkCancellationsForDay(data));
    };

    const getDayStatus = (date, dayOfWeek) => {
        const key = `${dayOfWeek}-${format(date, 'yyyy-MM-dd')}`;
        return daysCancellationStatus[key] || { hasCancellations: false, count: 0 };
    };

    const getDayDetails = (date) => {
        const key = format(date, 'yyyy-MM-dd');
        return cancellationDetailsByDate[key] || null;
    };

    return {
        cancellations: cancellations || [],
        loading: loading || false,
        bulkOperationLoading: bulkOperationLoading || false,
        error,
        cancellationDetailsByDate: cancellationDetailsByDate || {},
        daysCancellationStatus: daysCancellationStatus || {},
        fetchCancellations,
        getCancellationForDate,
        getCancellationsForDate,
        getCancellationsForGroup,
        addCancellation,
        updateCancellation,
        deleteCancellation,
        // פונקציות חדשות
        cancelAllGroupsForDay: cancelAllGroupsForDayAction,
        getCancellationDetailsByDate: getCancellationDetailsByDateAction,
        removeAllCancellationsForDay: removeAllCancellationsForDayAction,
        checkCancellationsForDay: checkCancellationsForDayAction,
        getDayStatus,
        getDayDetails
    };
};

export default LessonCancellationManager;

