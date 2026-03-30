
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, IconButton, Grid, Divider,
  List, ListItem, ListItemText, ListItemIcon, Avatar,
  Checkbox, TextField, Chip, Paper, useMediaQuery, useTheme,
  Alert, CircularProgress
} from '@mui/material';
import {
  Close, Group, CheckCircle, Cancel, Save, Comment,
  Person, Check, AccessTime, LocationOn, School
} from '@mui/icons-material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { styles } from '../styles/dialogStyles';
import React, { useEffect, useState } from 'react';
import { getAttendanceByStudent } from '../../../store/attendance/attendanceGetByStudent';
import AddStudentNoteDialog from '../../Students/components/addStudentNoteDialog';
import { addStudentNote } from '../../../store/studentNotes/studentNoteAddThunk';
import { checkUserPermission } from '../../../utils/permissions';

const getRecordPresence = (record) => record?.wasPresent ?? record?.WasPresent ?? false;

const AttendanceDialog = ({
  open,
  onClose,
  selectedDate,
  selectedCourse,
  selectedBranch,
  selectedGroup,
  students = [],
  attendanceData = {},
  onAttendanceChange,
  onSave,
  // הוסף props חדשים
  courseName,
  branchName,
  groupName
}) => {
  // כל ה-hooks כמו קודם...
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [note, setNote] = useState('');
  const dispatch = useDispatch();
  const attendanceRecords = useSelector(state => state.attendance?.records || {});
  const currentUser = useSelector(state => (
    state.users?.currentUser || state.auth?.currentUser || state.user?.currentUser || null
  ));

  // סטייטים לדיאלוג הערה
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteStudent, setNoteStudent] = useState(null);
  const [noteLoading, setNoteLoading] = useState(false);

  // חישוב ערכים
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const hasExistingAttendance = attendanceRecords[dateString]?.length > 0;
  const presentCount = students && Object.keys(attendanceData).length > 0 ?
    Object.values(attendanceData).filter(present => present).length : 0;
  const totalStudents = students ? students.length : 0;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // השתמש בנתונים שהועברו כ-props במקום לחפש אותם
  const displayCourseName = courseName || selectedCourse?.courseName || selectedCourse?.couresName || selectedCourse?.name || 'חוג לא זמין';
  const displayBranchName = branchName || selectedBranch?.branchName || selectedBranch?.name || 'סניף לא זמין';
  const displayGroupName = groupName || selectedGroup?.groupName || selectedGroup?.name || 'קבוצה לא זמינה';
  const displayGroupNotes = selectedGroup?.notes || selectedGroup?.Notes || '';

  const currentUserId =
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.Id ||
    currentUser?.UserId ||
    currentUser?.identityCard ||
    currentUser?.IdentityCard;

  const ensurePermission = () => {
    return checkUserPermission(currentUserId, (msg) => alert(msg));
  };

  // פונקציה חדשה לסימון נוכחות עם בדיקת העדרויות
  const handleAttendanceChangeWithNote = async (studentId, wasPresent) => {
    // בדיקת הרשאה לפני שינוי נוכחות
    if (!ensurePermission()) {
      return;
    }
    if (onAttendanceChange && studentId) {
      onAttendanceChange(studentId, wasPresent);

      // אם מסמנים כנעדר
      if (!wasPresent) {
        setNoteLoading(true);
        try {
          const res = await dispatch(getAttendanceByStudent(studentId)).unwrap();
          const absences = Array.isArray(res)
            ? res.filter(r => getRecordPresence(r) === false).length
            : 0;
          if (absences == 2) {
            const studentObj = (students || []).find(s => (s.studentId || s.id) === studentId);
            const noteStudentObj = studentObj
              ? { ...studentObj, id: studentObj.id || studentObj.studentId }
              : { id: studentId };
            setNoteStudent(noteStudentObj);
            setNoteDialogOpen(true);
          }
        } catch (err) {
          const status = err?.response?.status;
          const errorText = String(err?.response?.data || err?.message || '').toLowerCase();
          const endpointUnavailable =
            status === 404 ||
            status === 400 ||
            !err?.response ||
            errorText.includes('not implemented') ||
            errorText.includes('network error') ||
            errorText.includes('err_failed') ||
            errorText.includes('cors');

          if (!endpointUnavailable) {
            alert('אירעה שגיאה בשליפת נתוני נוכחות מהשרת');
          } else {
            console.warn('⚠️ GetAttendanceByStudent is unavailable. Skipping absence-history check.');
          }
        }
        setNoteLoading(false);
      }
    }
  };

  const handleSaveStudentNote = async (noteData) => {
    // בדיקת הרשאה לפני הוספת הערה
    if (!ensurePermission()) {
      return;
    }
    try {
      await dispatch(addStudentNote(noteData)).unwrap();
      // אפשר להציג הודעת הצלחה
    } catch (err) {
      // אפשר להציג הודעת שגיאה
    }
    setNoteDialogOpen(false);
    setNoteStudent(null);
  };

  const markAllPresent = () => {
    if (!ensurePermission()) {
      return;
    }

    if (students && students.length > 0) {
      students.forEach(student => {
        const studentId = student.studentId || student.id;
        if (studentId && onAttendanceChange) {
          onAttendanceChange(studentId, true);
        }
      });
    }
  };

  const markAllAbsent = () => {
    if (!ensurePermission()) {
      return;
    }

    if (students && students.length > 0) {
      students.forEach(student => {
        const studentId = student.studentId || student.id;
        if (studentId && onAttendanceChange) {
          onAttendanceChange(studentId, false);
        }
      });
    }
  };

  const handleSave = () => {
    // בדיקת הרשאה לפני שמירה
    if (!ensurePermission()) {
      return;
    }
    if (onSave) {
      onSave(note);
      setNote('');
    }
  };

  if (!open) {
    return null;
  }

  // בדיקה פשוטה יותר
  if (!selectedDate) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '20px',
            direction: 'rtl'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            טוען נתוני הקבוצה...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          maxHeight: '90vh',
          direction: 'rtl'
        }
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.dialogTitleContent}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              backgroundColor: theme.palette.primary.main,
              width: 48,
              height: 48
            }}>
              <Group />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={styles.dialogTitleText}>
                רישום נוכחות
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {displayCourseName} - קבוצה {displayGroupName}
              </Typography>
              {displayGroupNotes && (
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5, whiteSpace: 'pre-wrap' }}>
                  {displayGroupNotes}
                </Typography>
              )}
            </Box>
          </Box>

          {hasExistingAttendance && (
            <Chip
              label="נוכחות קיימת"
              color="info"
              size="small"
              sx={{ ml: 2 }}
            />
          )}

          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={styles.closeButton}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ mt: 1, px: 1 }}>
          <Typography variant="body2" sx={styles.dialogSubtitle}>
            {selectedDate && format(selectedDate, 'EEEE, d MMMM yyyy', { locale: he })} |
            שעה: {selectedGroup?.hour || 'לא צוין'} |
            סניף: {displayBranchName}
          </Typography>
        </Box>
      </DialogTitle>

      {/* שאר התוכן נשאר כמו קודם... */}
      <DialogContent sx={{ ...styles.dialogContent, p: 3 }}>
        {/* כל התוכן כמו קודם */}
        {hasExistingAttendance && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              נוכחות כבר נרשמה לתאריך זה. שמירה חוזרת תחליף את הנתונים הקיימים.
            </Typography>
          </Alert>
        )}

        {/* סטטיסטיקות מהירות */}
        <Paper sx={{
          p: 2,
          mb: 3,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                  {totalStudents}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  סה"כ תלמידים
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {presentCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  נוכחים
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                  {totalStudents - presentCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  נעדרים
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{
                  fontWeight: 'bold',
                  color: attendancePercentage >= 80 ? '#4caf50' :
                    attendancePercentage >= 60 ? '#ff9800' : '#f44336'
                }}>
                  {attendancePercentage}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  אחוז נוכחות
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* כפתורי פעולה מהירה */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          justifyContent: 'center'
        }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={markAllPresent}
            sx={{
              borderRadius: 2,
              px: 3,
              '& .MuiButton-startIcon': {
                marginInlineStart: 0,
                marginInlineEnd: '10px'
              }
            }}
          >
            סמן הכל כנוכחים
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Cancel />}
            onClick={markAllAbsent}
            sx={{
              borderRadius: 2,
              px: 3,
              '& .MuiButton-startIcon': {
                marginInlineStart: 0,
                marginInlineEnd: '10px'
              }
            }}
          >
            סמן הכל כנעדרים
          </Button>
        </Box>

        {/* רשימת תלמידים */}
        <Paper sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{
            backgroundColor: '#f5f5f5',
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Typography variant="h6" sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 'bold'
            }}>
              <Person />
              רשימת תלמידים ({students.length})
            </Typography>
          </Box>

          <List sx={styles.studentsList}>
            {students.map((student, index) => {
              const studentId = student.studentId || student.id;
              const uniqueKey = `${selectedGroup?.groupId || 'no-group'}-${studentId || index}-${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'no-date'}`;

              return (
                <React.Fragment key={uniqueKey}>
                  <ListItem
                    sx={{
                      ...styles.studentListItem,
                      ...(index % 2 === 0 ? styles.evenRow : {})
                    }}
                  >
                    <ListItemIcon sx={styles.studentAvatar}>
                      <Avatar

                        src={student.imageUrl}
                        sx={{
                          ...styles.avatar,
                          ...(attendanceData[studentId] ? styles.presentAvatar : styles.absentAvatar)
                        }}
                      >
                        {student.studentName ? student.studentName.charAt(0) : 'ת'}
                      </Avatar>
                    </ListItemIcon>

                    <Box sx={{ flex: 1, ml: 2, textAlign: 'right' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', direction: 'rtl' }}>
                        {student.studentName || 'תלמיד ללא שם'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: 'flex-end' }}>
                        {student.attendanceRate && (
                          <>
                            <Typography variant="body2" color="textSecondary">•</Typography>
                            <Chip
                              label={`נוכחות כללית: ${student.attendanceRate}%`}
                              size="small"
                              color={
                                student.attendanceRate > 90 ? 'success' :
                                  student.attendanceRate > 75 ? 'primary' :
                                    student.attendanceRate > 60 ? 'warning' : 'error'
                              }
                              variant="outlined"
                            />
                          </>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={attendanceData[studentId] ? 'נוכח' : 'נעדר'}
                        color={attendanceData[studentId] ? 'success' : 'error'}
                        variant="filled"
                        sx={{
                          fontWeight: 'bold',
                          minWidth: 70,
                          fontSize: '0.8rem'
                        }}
                      />

                      <Checkbox
                        edge="end"
                        checked={attendanceData[studentId] || false}
                        onChange={() => {
                          handleAttendanceChangeWithNote(studentId, !attendanceData[studentId]);
                        }}
                        disabled={noteLoading}
                        color="primary"
                        size="large"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: '1.5rem'
                          }
                        }}
                      />
                    </Box>
                  </ListItem>

                  {index < students.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        </Paper>

        {/* הערות */}
        {/* <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Comment />
            הערות (אופציונלי)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="הוסף הערות על השיעור או נוכחות התלמידים..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box> */}
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderColor: '#e0e0e0',
            color: '#666'
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={<Save />}
          disabled={!students || students.length === 0}
          sx={{
            borderRadius: 2,
            px: 4,
            fontWeight: 'bold',
            '& .MuiButton-startIcon': {
              marginInlineStart: 0,
              marginInlineEnd: '10px'
            }
          }}
        >
          שמור נוכחות
        </Button>
      </DialogActions>
      <AddStudentNoteDialog
  open={noteDialogOpen}
  onClose={() => {
    setNoteDialogOpen(false);
    setNoteStudent(null);
  }}
  student={noteStudent}
  onSave={handleSaveStudentNote}
  noteData={{
    studentId: noteStudent?.id || noteStudent?.studentId || '',
    noteContent: 'לתשומת ליבך: התלמיד נעדר כבר 3 פעמים',
    noteType: 'אזהרה',
    priority: 'גבוה'
  }}
/>
    </Dialog>
  );
};

export default AttendanceDialog;

