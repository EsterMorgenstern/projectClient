import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Close as CloseIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  LocationCity as LocationCityIcon,
  HealthAndSafety as HealthIcon,
  Class as ClassIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { getgroupStudentByStudentId } from '../store/groupStudent/groupStudentGetByStudentIdThunk';
import { getGroupStudentByStudentName } from '../store/groupStudent/groupStudentGetByStudentNameThunk';
import { getStudentsByGroupId } from '../store/group/groupGetStudentsByGroupId';
import DraggablePaper from './DraggablePaper';

const StudentSearchDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const groupStudentById = useSelector(state => state.groupStudents.groupStudentById || []);
  const groupStudentByName = useSelector(state => state.groupStudents.groupStudentByName || []);
  const loading = useSelector(state => state.groupStudents.loading);
  const error = useSelector(state => state.groupStudents.error);

  // Local state
  const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [groupStudents, setGroupStudents] = useState({});

  // פונקציה לחיפוש לפי קוד תלמיד
  const handleSearchById = async () => {
    if (!studentId.trim()) {
      return;
    }

    setHasSearched(true);
    try {
      const result = await dispatch(getgroupStudentByStudentId(parseInt(studentId)));
      if (result.payload) {
        setSearchResults(result.payload);
        // טוען תלמידים לכל קבוצה
        result.payload.forEach(groupStudent => {
          fetchGroupStudents(groupStudent.groupId);
        });
      }
    } catch (error) {
      console.error('Error searching by ID:', error);
    }
  };

  // פונקציה לחיפוש לפי שם
  const handleSearchByName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    setHasSearched(true);
    try {
      const result = await dispatch(getGroupStudentByStudentName({ 
        firstName: firstName.trim(), 
        lastName: lastName.trim() 
      }));
      if (result.payload) {
        setSearchResults(result.payload);
        // טוען תלמידים לכל קבוצה
        result.payload.forEach(groupStudent => {
          fetchGroupStudents(groupStudent.groupId);
        });
      }
    } catch (error) {
      console.error('Error searching by name:', error);
    }
  };

  // פונקציה לקבלת תלמידים בקבוצה
  const fetchGroupStudents = async (groupId) => {
    if (groupStudents[groupId]) return; // כבר קיים
    
    try {
      const result = await dispatch(getStudentsByGroupId(groupId));
      if (result.payload) {
        setGroupStudents(prev => ({
          ...prev,
          [groupId]: result.payload
        }));
      }
    } catch (error) {
      console.error('Error fetching group students:', error);
    }
  };

  // פונקציה כללית לחיפוש
  const handleSearch = async () => {
    setSearchResults([]);
    let results = [];
    
    if (searchType === 'id') {
      await handleSearchById();
    } else {
      await handleSearchByName();
    }
  };

  // איפוס הטופס
  const handleReset = () => {
    setStudentId('');
    setFirstName('');
    setLastName('');
    setSearchResults([]);
    setHasSearched(false);
    setGroupStudents({});
  };

  // סגירת הדיאלוג
  const handleClose = () => {
    handleReset();
    onClose();
  };

  // פונקציה להצגת פרטי התלמיד
  const formatStudentInfo = (student) => {
    return {
      name: `${student.firstName} ${student.lastName}`,
      id: student.id,
      phone: student.phone,
      age: student.age,
      city: student.city,
      school: student.school,
      class: student.class,
      sector: student.sector,
      status: student.status
    };
  };

  // פונקציה להצגת פרטי הקבוצה
  const formatGroupInfo = (groupStudent) => {
    // הנתונים מגיעים ישירות מ-groupStudent בפורמט השטוח
    return {
      groupId: groupStudent.groupId,
      groupName: groupStudent.groupName,
      startDate: groupStudent.enrollmentDate,
      isActive: groupStudent.isActive,
      lessonsRemaining: groupStudent.lessonsRemaining,
      // פרטי הקבוצה המורחבים מהנתונים השטוחים
      courseName: groupStudent.courseName,
      branchName: groupStudent.branchName,
      instructorName: groupStudent.instructorName,
      dayOfWeek: groupStudent.dayOfWeek,
      hour: groupStudent.hour,
      // נתונים נוספים אם קיימים
      groupType: groupStudent.groupType,
      ageGroup: groupStudent.ageGroup,
      maxStudents: groupStudent.maxStudents,
      currentStudents: groupStudent.currentStudents,
      weeklyHours: groupStudent.weeklyHours,
      lessonDuration: groupStudent.lessonDuration,
      location: groupStudent.location,
      price: groupStudent.price,
      totalLessons: groupStudent.totalLessons,
      status: groupStudent.status
    };
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperComponent={DraggablePaper}
      aria-labelledby="student-search-dialog-title"
      sx={{ 
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle className="drag-handle" sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        display: 'flex',
        direction: 'rtl',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
          <SearchIcon />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            חיפוש תלמידים וקבוצות
          </Typography>
        </Box>
        <IconButton 
          aria-label="close" 
          onClick={handleClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, direction: 'rtl', borderRadius: '0 0 12px 12px' }}>
        {/* בחירת סוג חיפוש */}
        <Box sx={{ mb: 3, textAlign: 'right', direction: 'rtl' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#333', textAlign: 'right' }}>
            בחר סוג חיפוש:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', direction: 'rtl' }}>
            <Button
              variant={searchType === 'id' ? 'contained' : 'outlined'}
              onClick={() => setSearchType('id')}
              endIcon={<AssignmentIcon />}
              sx={{ 
                borderRadius: 2,
                direction: 'rtl',
                flexDirection: 'row-reverse',
                ...(searchType === 'id' && {
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                })
              }}
            >
              חיפוש לפי קוד תלמיד
            </Button>
            <Button
              variant={searchType === 'name' ? 'contained' : 'outlined'}
              onClick={() => setSearchType('name')}
              endIcon={<PersonIcon />}
              sx={{ 
                borderRadius: 2,
                direction: 'rtl',
                flexDirection: 'row-reverse',
                ...(searchType === 'name' && {
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                })
              }}
            >
              חיפוש לפי שם
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* טופס חיפוש */}
        <Box sx={{ mb: 3 }}>
          {searchType === 'id' ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="קוד תלמיד"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  type="number"
                  placeholder="הזן קוד תלמיד"
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2, 
                      direction: 'rtl',
                      paddingRight: '20px'
                    },
                    '& .MuiInputLabel-root': { 
                      right: 20, 
                      left: 'auto', 
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        right: 24,
                        transform: 'translate(0, -9px) scale(0.75)'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline legend': { 
                      textAlign: 'right',
                      marginRight: '10px'
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'right',
                      paddingRight: '20px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ borderRadius: 2, direction: 'rtl' }}
                  >
                    איפוס
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!studentId.trim() || loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      borderRadius: 2,
                      px: 3,
                      direction: 'rtl',
                      flexDirection: 'row-reverse'
                    }}
                  >
                    {loading ? 'מחפש...' : 'חיפוש'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="שם פרטי"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="הזן שם פרטי"
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2, 
                      direction: 'rtl',
                      paddingRight: '20px'
                    },
                    '& .MuiInputLabel-root': { 
                      right: 20, 
                      left: 'auto', 
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        right: 24,
                        transform: 'translate(0, -9px) scale(0.75)'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline legend': { 
                      textAlign: 'right',
                      marginRight: '10px'
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'right',
                      paddingRight: '20px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="שם משפחה"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="הזן שם משפחה"
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2, 
                      direction: 'rtl',
                      paddingRight: '20px'
                    },
                    '& .MuiInputLabel-root': { 
                      right: 20, 
                      left: 'auto', 
                      transformOrigin: 'top right',
                      '&.MuiInputLabel-shrink': {
                        right: 24,
                        transform: 'translate(0, -9px) scale(0.75)'
                      }
                    },
                    '& .MuiOutlinedInput-notchedOutline legend': { 
                      textAlign: 'right',
                      marginRight: '10px'
                    },
                    '& .MuiOutlinedInput-input': {
                      textAlign: 'right',
                      paddingRight: '20px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ borderRadius: 2, direction: 'rtl' }}
                  >
                    איפוס
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!firstName.trim() || !lastName.trim() || loading}
                    endIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      borderRadius: 2,
                      px: 3,
                      direction: 'rtl',
                      flexDirection: 'row-reverse'
                    }}
                  >
                    {loading ? 'מחפש...' : 'חיפוש'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* הצגת שגיאות */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'right', direction: 'rtl' }}>
            {error}
          </Alert>
        )}

        {/* הצגת תוצאות חיפוש */}
        {hasSearched && !loading && (
          <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2, color: '#333', textAlign: 'right' }}>
              תוצאות חיפוש:
            </Typography>

            {searchResults.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2, textAlign: 'right', direction: 'rtl' }}>
                לא נמצאו תוצאות עבור החיפוש
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {searchResults.map((result, index) => {
                  const studentInfo = formatStudentInfo(result.student);
                  const groupInfo = formatGroupInfo(result);
                  
                  return (
                    <Grid item xs={12} key={index}>
                      <Card sx={{ 
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s ease',
                        direction: 'rtl',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                        }
                      }}>
                        <CardContent sx={{ p: 3, textAlign: 'right' }}>
                          {/* פרטי התלמיד */}
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-start', direction: 'rtl' }}>
                              <Avatar sx={{ 
                                bgcolor: 'primary.main', 
                                ml: 2,
                                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                              }}>
                                <PersonIcon />
                              </Avatar>
                              <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'right' }}>
                                {studentInfo.name}
                              </Typography>
                            </Box>
                            
                            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">שם:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.name}
                                  </Typography>
                                  <PersonIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">ת"ז:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.id}
                                  </Typography>
                                  <AssignmentIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">טלפון:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.phone}
                                  </Typography>
                                  <PhoneIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">גיל:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.age}
                                  </Typography>
                                  <CalendarIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">עיר:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.city}
                                  </Typography>
                                  <LocationCityIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">בית ספר:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.school}
                                  </Typography>
                                  <SchoolIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">קופ"ח:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.healthFund}
                                  </Typography>
                                  <HealthIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                  <Typography variant="body2" color="textSecondary">כיתה:</Typography>
                                  <Typography variant="body2" fontWeight="500">
                                    {studentInfo.class}
                                  </Typography>
                                  <ClassIcon fontSize="small" color="primary" />
                                </Box>
                              </Grid>
                            </Grid>
                            
                            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Chip 
                                label={`מגזר: ${studentInfo.sector}`}
                                color="primary" 
                                variant="outlined"
                                size="small"
                              
                              />
                              <Chip 
                                label={`סטטוס: ${studentInfo.status}`}
                                color={studentInfo.status === 'פעיל' ? 'success' : 'default'}
                                variant="outlined"
                                size="small"
                               
                              />
                            </Box>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          {/* פרטי הקבוצה */}
                          <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textAlign: 'right' }}>
                              פרטי הקבוצה
                            </Typography>
                            
                            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>קוד קבוצה:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.groupId}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>שם קבוצה:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.groupName || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>קורס:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.courseName || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>סניף:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.branchName || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>מדריך:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.instructorName || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>קבוצת גיל:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.ageRange || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>יום בשבוע:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.dayOfWeek || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>שעה:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.hour || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>מקומות פנויים:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.maxStudents && groupInfo.currentStudents ? 
                                    `${groupInfo.maxStudents - groupInfo.currentStudents}` : 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>מספר שיעורים:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.numOfLessons || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>שיעורים שהושלמו:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.lessonsCompleted || 'לא זמין'}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>תאריך התחלה:</Typography>
                                <Typography variant="body2" fontWeight="500" sx={{ textAlign: 'right' }}>
                                  {groupInfo.startDate ? new Date(groupInfo.startDate).toLocaleDateString('he-IL') : 'לא זמין'}
                                </Typography>
                              </Grid>
                            </Grid>
                            
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', direction: 'rtl' }}>
                              <Chip 
                                label={groupInfo.isActive ? 'פעיל' : 'לא פעיל'}
                                color={groupInfo.isActive ? 'success' : 'error'}
                                variant="outlined"
                                size="small"
                                sx={{ direction: 'rtl' }}
                              />
                            </Box>
                          </Box>

                          {/* תלמידים בקבוצה */}
                          {groupStudents[groupInfo.groupId] && (
                            <>
                              <Divider sx={{ my: 3 }} />
                              <Box sx={{ direction: 'rtl', textAlign: 'right' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2', textAlign: 'right' }}>
                                  תלמידים רשומים בקבוצה ({groupStudents[groupInfo.groupId].length})
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ direction: 'rtl' }}>
                                  {groupStudents[groupInfo.groupId].map((groupMember, memberIndex) => (
                                    <Grid item xs={12} sm={6} md={4} key={memberIndex}>
                                      <Card sx={{ 
                                        p: 2, 
                                        backgroundColor: groupMember.student.id === studentInfo.id ? '#e3f2fd' : '#f8f9fa',
                                        border: groupMember.student.id === studentInfo.id ? '2px solid #2196f3' : '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        direction: 'rtl',
                                        textAlign: 'right',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                          transform: 'translateY(-1px)'
                                        }
                                      }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'flex-start', direction: 'rtl' }}>
                                          <Avatar sx={{ 
                                            width: 32, 
                                            height: 32, 
                                            fontSize: '14px',
                                            background: groupMember.student.id === studentInfo.id ? 
                                              'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' :
                                              'linear-gradient(135deg, #757575 0%, #616161 100%)'
                                          }}>
                                            <PersonIcon fontSize="small" />
                                          </Avatar>
                                          <Box sx={{ flex: 1, textAlign: 'right' }}>
                                            <Typography variant="body2" fontWeight="600" sx={{ 
                                              color: groupMember.student.id === studentInfo.id ? '#1565c0' : '#333',
                                              fontSize: '13px',
                                              textAlign: 'right'
                                            }}>
                                              {groupMember.student.firstName} {groupMember.student.lastName}
                                              {groupMember.student.id === studentInfo.id && (
                                                <Chip 
                                                  label="נמצא" 
                                                  size="small" 
                                                  color="primary" 
                                                  sx={{ mr: 1, height: 18, fontSize: '10px' }}
                                                />
                                              )}
                                            </Typography>
                                          </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, justifyContent: 'flex-end', direction: 'rtl' }}>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, direction: 'rtl' }}>
                                            <Typography variant="caption" color="textSecondary">
                                              ת"ז: {groupMember.student.id}
                                            </Typography>
                                            <AssignmentIcon fontSize="small" sx={{ color: '#666', fontSize: '12px' }} />
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, direction: 'rtl' }}>
                                            <Typography variant="caption" color="textSecondary">
                                              גיל: {groupMember.student.age}
                                            </Typography>
                                            <CalendarIcon fontSize="small" sx={{ color: '#666', fontSize: '12px' }} />
                                          </Box>
                                          
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, direction: 'rtl' }}>
                                            <Typography variant="caption" color="textSecondary">
                                              טלפון: {groupMember.student.phone}
                                            </Typography>
                                            <PhoneIcon fontSize="small" sx={{ color: '#666', fontSize: '12px' }} />
                                          </Box>
                                        </Box>
                                        
                                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, justifyContent: 'flex-end', direction: 'rtl' }}>
                                          <Chip 
                                            label={groupMember.student.sector || 'כללי'}
                                            size="small"
                                            variant="outlined"
                                            sx={{ 
                                              height: 20, 
                                              fontSize: '10px',
                                              direction: 'rtl',
                                              '& .MuiChip-label': { px: 1 }
                                            }}
                                          />
                                          <Chip 
                                            label={groupMember.isActive ? 'פעיל' : 'לא פעיל'}
                                            size="small"
                                            color={groupMember.isActive ? 'success' : 'default'}
                                            variant="outlined"
                                            sx={{ 
                                              height: 20, 
                                              fontSize: '10px',
                                              direction: 'rtl',
                                              '& .MuiChip-label': { px: 1 }
                                            }}
                                          />
                                        </Box>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentSearchDialog;