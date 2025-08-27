import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Box, Typography, InputAdornment, Pagination, FormControl, InputLabel,
  Select, MenuItem, CircularProgress, Skeleton, Table, TableContainer,
  Paper, TableHead, TableRow, TableCell, TableBody, List, ListItem,
  ListItemText, Chip
} from '@mui/material';
import {
  Add, Edit, Delete, Search as SearchIcon, PersonAdd, Email,
  Phone, LocationCity, Badge, Person, Groups, Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructors } from '../../store/instructor/instructorGetAllThunk';
import { deleteInstructor } from '../../store/instructor/instuctorDeleteThunk';
import { addInstructor } from '../../store/instructor/instructorAddThunk';
import { editInstructor } from '../../store/instructor/instructorEditThunk';
import '../styles/tableStyles.css';
import { getGroupsByInstructorId } from '../../store/group/groupByInstructorId';

// קומפוננטת Loading Skeleton למדריכים
const InstructorLoadingSkeleton = () => (
  <TableContainer component={Paper} className="advanced-table loading-skeleton">
    <Table>
      <TableHead className="table-head">
        <TableRow>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎯</span>
              <span style={{ fontSize: '0.9em' }}>פעולות</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🆔</span>
              <span style={{ fontSize: '0.9em' }}>קוד מדריך</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👤</span>
              <span style={{ fontSize: '0.9em' }}>שם פרטי</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👥</span>
              <span style={{ fontSize: '0.9em' }}>שם משפחה</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📞</span>
              <span style={{ fontSize: '0.9em' }}>טלפון</span>
            </div>
          </TableCell>
          <TableCell className="table-head-cell" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📧</span>
              <span style={{ fontSize: '0.9em' }}>אימייל</span>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className="skeleton-row">
            <TableCell><Skeleton variant="rectangular" width={250} height={10} sx={{ borderRadius: '8px' }} /></TableCell>
            <TableCell><Skeleton variant="text" width={80} /></TableCell>
            <TableCell><Skeleton variant="text" width={100} /></TableCell>
            <TableCell><Skeleton variant="text" width={120} /></TableCell>
            <TableCell><Skeleton variant="text" width={90} /></TableCell>
            <TableCell><Skeleton variant="text" width={150} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// קומפוננטת Empty State למדריכים
const InstructorEmptyState = ({ searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="empty-state"
  >
    <Person className="empty-state-icon" />
    <Typography className="empty-state-title">
      {searchTerm ? `לא נמצאו מדריכים עבור "${searchTerm}"` : 'אין מדריכים להצגה'}
    </Typography>
    <Typography className="empty-state-subtitle">
      {searchTerm ? 'נסה לחפש עם מילות מפתח אחרות' : 'הוסף מדריכים חדשים כדי להתחיל'}
    </Typography>
  </motion.div>
);

// קומפוננטת הצגת חוגים של מדריך - עיצוב משודרג
const InstructorGroupsDialog = ({ open, onClose, instructor, groups, loading }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="xl"
    fullWidth
    className="advanced-dialog"
    PaperProps={{
      sx: {
        borderRadius: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 0,
        overflow: 'hidden',
        maxHeight: '91vh',
        direction: 'rtl'
      }
    }}
  >
    {/* כותרת מעוצבת */}
    <Box sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      p: 8,
      marginTop: -7,
      position: 'relative',
      overflow: 'hidden',

    }}>
      {/* רקע דקורטיבי */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        zIndex: 0
      }} />

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1,
            backdropFilter: 'blur(10px)'
          }}>
            <Groups sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.6rem' }}>
              חוגים בהדרכת {instructor?.firstName} {instructor?.lastName}
            </Typography>

          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {groups && groups.length > 0 && (
            <Chip
              label={`${groups.length} חוגים פעילים`}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }}
            />
          )}
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              p: 1,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            <Close />
          </Button>
        </Box>
      </Box>
    </Box>

    <DialogContent sx={{
      p: 0,
      background: '#f8fafc',
      minHeight: 400
    }}>
      {loading ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            טוען חוגים...
          </Typography>
        </Box>
      ) : groups && groups.length > 0 ? (
        <Box sx={{ p: 3 }}>
          {/* סטטיסטיקות מהירות */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
            gap: 2,
            mb: 4
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {groups.length}
                </Typography>
                <Typography variant="body2">סה"כ חוגים</Typography>
              </Paper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {new Set(groups.map(g => g.branchName)).size}
                </Typography>
                <Typography variant="body2">סניפים</Typography>
              </Paper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f1fece 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {new Set(groups.map(g => g.courseName)).size}
                </Typography>
                <Typography variant="body2">קורסים</Typography>
              </Paper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                borderRadius: 3
              }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {groups.reduce((sum, g) => sum + (g.lessonsCompleted || 0), 0)}
                </Typography>
                <Typography variant="body2">שיעורים הושלמו</Typography>
              </Paper>
            </motion.div>
          </Box>

          {/* רשימת החוגים */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3
          }}>
            {groups.map((group, index) => (
              <motion.div
                key={group.groupId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: '#667eea'
                    }
                  }}
                >
                  {/* כותרת הכרטיס */}
                  <Box sx={{
                    background: `linear-gradient(135deg, ${getGroupColor(index)} 0%, ${getGroupColor(index, true)} 100%)`,
                    color: 'white',
                    p: 2.5,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                          {group.groupName}
                        </Typography>
                        <Chip
                          label={`#${group.groupId}`}
                          size="small"
                          sx={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontFamily: 'monospace',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        📚 {group.courseName}
                      </Typography>
                    </Box>
                  </Box>

                  {/* תוכן הכרטיס */}
                  <Box sx={{ p: 2.5 }}>
                    {/* מידע בסיסי */}
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2,
                      mb: 2.5,
                      p: 2,
                      background: '#f8fafc',
                      borderRadius: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          background: '#667eea',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>📅</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">יום</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {group.dayOfWeek}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          background: '#f093fb',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>⏰</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">שעה</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {group.hour || 'לא צוין'}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          background: '#4facfe',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>🏢</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">סניף</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {group.branchName}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          background: '#fa709a',
                          borderRadius: '50%',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Typography sx={{ color: 'white', fontSize: '0.8rem' }}>👥</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">גיל</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {group.ageRange || 'כל הגילאים'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* פרטים נוספים */}
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#374151' }}>
                        📊 פרטי הקבוצה
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          label={`מקומות פנויים: ${group.maxStudents || '∞'}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          label={`מגזר: ${group.sector || 'כללי'}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                        {group.startDate && (
                          <Chip
                            label={`התחלה: ${new Date(group.startDate).toLocaleDateString('he-IL')}`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        )}
                      </Box>
                    </Box>

                    {/* בר התקדמות מתקדם */}
                    {group.numOfLessons && group.lessonsCompleted !== null && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#374151' }}>
                            📈 התקדמות הקורס
                          </Typography>
                          <Typography variant="body2" sx={{
                            fontWeight: 'bold',
                            color: group.lessonsCompleted === group.numOfLessons ? '#10b981' : '#3b82f6'
                          }}>
                            {group.lessonsCompleted}/{group.numOfLessons} שיעורים
                          </Typography>
                        </Box>

                        <Box sx={{ position: 'relative', mb: 1 }}>
                          <Box sx={{
                            width: '100%',
                            height: 12,
                            backgroundColor: '#e5e7eb',
                            borderRadius: 6,
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(group.lessonsCompleted / group.numOfLessons) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              style={{
                                height: '100%',
                                background: group.lessonsCompleted === group.numOfLessons
                                  ? 'linear-gradient(90deg, #10b981, #059669)'
                                  : 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                                borderRadius: 6,
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                animation: 'shimmer 2s infinite'
                              }} />
                            </motion.div>
                          </Box>

                          <Typography variant="caption" sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                          }}>
                            {Math.round((group.lessonsCompleted / group.numOfLessons) * 100)}%
                          </Typography>
                        </Box>

                        {/* סטטוס השלמה */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                          {group.lessonsCompleted === group.numOfLessons ? (
                            <Chip
                              label="✅ הקורס הושלם!"
                              color="success"
                              variant="filled"
                              sx={{ fontWeight: 'bold' }}
                            />
                          ) : (
                            <Chip
                              label={`🔄 נותרו ${group.numOfLessons - group.lessonsCompleted} שיעורים`}
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* פוטר הכרטיס */}
                  <Box sx={{
                    background: '#f8fafc',
                    px: 2.5,
                    py: 1.5,
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={`קורס #${group.courseId}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip
                        label={`סניף #${group.branchId}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              p: 4,
              mb: 3,
              display: 'inline-flex'
            }}>
              <Groups sx={{ fontSize: 80, color: 'white' }} />
            </Box>
          </motion.div>

          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#374151' }}>
            אין חוגים רשומים
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            המדריך {instructor?.firstName} {instructor?.lastName} עדיין לא שויך לאף חוג במערכת
          </Typography>

          <Box sx={{
            background: 'white',
            borderRadius: 3,
            p: 3,
            border: '2px dashed #d1d5db',
            maxWidth: 400
          }}>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              💡 כדי לשייך חוגים למדריך זה, עבור לעמוד ניהול החוגים והוסף חוגים חדשים
            </Typography>
          </Box>
        </Box>
      )}
    </DialogContent>

    {/* פוטר מעוצב */}
    <Box sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 2,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Button
        onClick={onClose}
        variant="contained"
        size="large"
        sx={{
          minWidth: 150,
          background: 'rgba(255,255,255,0.2)',
          color: 'white',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: 'rgba(255,255,255,0.3)'
          }
        }}
      >
        סגור
      </Button>
    </Box>
  </Dialog>
);

// פונקציה לקבלת צבעים שונים לכל חוג
const getGroupColor = (index, darker = false) => {
  const colors = [
    darker ? '#5a67d8' : '#667eea',
    darker ? '#d53f8c' : '#f093fb',
    darker ? '#3182ce' : '#4facfe',
    darker ? '#e53e3e' : '#fa709a',
    darker ? '#38a169' : '#4ade80',
    darker ? '#d69e2e' : '#fbbf24'
  ];
  return colors[index % colors.length];
};




export default function InstructorsTable() {
  const instructors = useSelector((state) => state.instructors.instructors);
  const loading = useSelector((state) => state.instructors.loading);
  const error = useSelector((state) => state.instructors.error);

  // הוסף selectors לחוגים
  const instructorGroups = useSelector((state) => state.groups.instructorGroups || []);
  const groupsLoading = useSelector((state) => state.groups.loading);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false); // הוסף state לדיאלוג החוגים
  const [currentInstructor, setCurrentInstructor] = useState({
    id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: ''
  });
  const [newInstructor, setNewInstructor] = useState({
    id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: ''
  });

  // חיפוש ו-pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedInstructors, setPaginatedInstructors] = useState([]);

  const dispatch = useDispatch();

  // פונקציה לחיפוש חכם למדריכים
  const smartSearchInstructors = (instructors, searchTerm) => {
    if (!searchTerm.trim()) return instructors;
    const term = searchTerm.toLowerCase().trim();
    return instructors.filter(instructor => {
      const firstNameMatch = instructor.firstName?.toLowerCase().includes(term);
      const lastNameMatch = instructor.lastName?.toLowerCase().includes(term);
      const fullNameMatch = `${instructor.firstName} ${instructor.lastName}`.toLowerCase().includes(term);
      const idMatch = instructor.id?.toString().includes(term);
      const phoneMatch = instructor.phone?.toString().includes(term);
      const cityMatch = instructor.city?.toLowerCase().includes(term);
      const emailMatch = instructor.email?.toLowerCase().includes(term);
      const sectorMatch = instructor.sector?.toLowerCase().includes(term);
      return firstNameMatch || lastNameMatch || fullNameMatch || idMatch || phoneMatch || cityMatch || emailMatch || sectorMatch;
    });
  };

  // פונקציה לטיפול בהצגת חוגים של מדריך
  const handleShowInstructorGroups = async (instructor) => {
    setCurrentInstructor(instructor);
    setGroupsOpen(true);
    await dispatch(getGroupsByInstructorId(instructor.id));
  };

  // טעינת נתונים ראשונית
  useEffect(() => {
    dispatch(fetchInstructors());
  }, [dispatch]);

  // עדכון הרשימה המסוננת
  useEffect(() => {
    const filtered = smartSearchInstructors(instructors, searchTerm);
    setFilteredInstructors(filtered);
    setCurrentPage(1);
  }, [instructors, searchTerm]);

  // עדכון pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredInstructors.slice(startIndex, endIndex);
    setPaginatedInstructors(paginated);
    setTotalPages(Math.ceil(filteredInstructors.length / pageSize));
  }, [filteredInstructors, currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const refreshTable = async () => {
    await dispatch(fetchInstructors());
  };

  const handleAdd = async () => {
    await dispatch(addInstructor(newInstructor));
    refreshTable();
    setOpen(false);
    setNewInstructor({
      id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: ''
    });
  };

  const handleEdit = async () => {
    await dispatch(editInstructor(currentInstructor));
    setOpenEdit(false);
    refreshTable();
  };

  const handleDelete = async (id) => {
    if (await dispatch(deleteInstructor(id))) {
      refreshTable();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="table-container"
    >
      <div style={{ direction: 'rtl' }}>
        {/* כותרת הטבלה */}
        <motion.div
          className="table-header fade-in-up"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography className="table-title">
            ניהול מדריכים
          </Typography>
          <Typography className="table-subtitle">
            נהל את כל המדריכים במערכת בקלות ויעילות
          </Typography>
        </motion.div>

        {/* שדה חיפוש */}
        <motion.div
          className="search-container slide-in-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 חפש מדריך לפי שם, ת״ז, טלפון, אימייל או עיר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        {/* בקרות עמוד */}
        <motion.div
          className="pagination-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography className="results-info">
              📊 מציג {paginatedInstructors.length} מתוך {filteredInstructors.length} מדריכים
              {searchTerm && ` (מסונן מתוך ${instructors.length} סה"כ)`}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" className="page-size-selector">
                <InputLabel>תוצאות בעמוד</InputLabel>
                <Select
                  value={pageSize}

                  onChange={handlePageSizeChange}
                  label="תוצאות בעמוד"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </motion.div>
 {/* כפתור הוספת מדריך חדש */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            onClick={() => {
              setNewInstructor({
                id: null, firstName: '', lastName: '', phone: null, email: '', city: '', sector: ''
              });
              setOpen(true);
            }}
            variant="contained"
            startIcon={<PersonAdd />}
            size="large"
            className="main-add-button glow-effect"
            fullWidth
          >
            ➕ הוסף מדריך חדש
          </Button>
        </motion.div>
        {/* טבלה */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InstructorLoadingSkeleton />
            </motion.div>
          ) : paginatedInstructors.length > 0 ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <TableContainer component={Paper} className="advanced-table custom-scrollbar">
                <Table>
                  <TableHead className="table-head">
                    <TableRow>
                      <TableCell className="table-head-cell" style={{ width: 200, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🎯</span>
                          <span style={{ fontSize: '0.9em' }}>פעולות</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🆔</span>
                          <span style={{ fontSize: '0.9em' }}>קוד מדריך</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👤</span>
                          <span style={{ fontSize: '0.9em' }}>שם פרטי</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 140, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>👥</span>
                          <span style={{ fontSize: '0.9em' }}>שם משפחה</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 110, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📞</span>
                          <span style={{ fontSize: '0.9em' }}>טלפון</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 180, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>📧</span>
                          <span style={{ fontSize: '0.9em' }}>מייל</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 100, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🏙️</span>
                          <span style={{ fontSize: '0.9em' }}>עיר</span>
                        </div>
                      </TableCell>
                      <TableCell className="table-head-cell" style={{ width: 120, textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>🌍</span>
                          <span style={{ fontSize: '0.9em' }}>מגזר</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedInstructors
                        .filter(row => row?.id != null && row?.id !== '')
                        .map((instructor, index) => (
                          <motion.tr
                            key={instructor.id}
                            component={TableRow}
                            className="table-row"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{ scale: 1.001 }}

                          >
                            {/* עמודת פעולות */}
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                              <Box className="action-buttons" sx={{
                                display: 'flex',
                                gap: 0.3,
                                flexWrap: 'wrap',
                                minHeight: '30px'
                              }}>
                                <Button
                                  variant="contained"
                                  startIcon={<Groups />}
                                  size="small"
                                  className="action-button info"
                                  onClick={() => handleShowInstructorGroups(instructor)}
                                  sx={{
                                    backgroundColor: '#10B981',
                                    '&:hover': { backgroundColor: '#059669' },
                                    minWidth: '55px',
                                    height: '22px',
                                    fontSize: '0.65rem',
                                    px: 0.5,
                                    py: 0.2,
                                    '& .MuiButton-startIcon': {
                                      marginLeft: 0.3,
                                      marginRight: 0,
                                    }
                                  }}
                                >
                                  חוגים
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<Edit />}
                                  size="small"
                                  className="action-button edit"
                                  onClick={() => {
                                    setCurrentInstructor({
                                      id: instructor.id,
                                      firstName: instructor.firstName,
                                      lastName: instructor.lastName,
                                      phone: instructor.phone,
                                      email: instructor.email,
                                      city: instructor.city,
                                      sector: instructor.sector
                                    });
                                    setOpenEdit(true);
                                  }}
                                  sx={{
                                    minWidth: '55px',
                                    height: '22px',
                                    fontSize: '0.65rem',
                                    px: 0.5,
                                    py: 0.2,
                                    '& .MuiButton-startIcon': {
                                      marginLeft: 0.3,
                                      marginRight: 0,
                                    }
                                  }}
                                >
                                  ערוך
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<Delete />}
                                  size="small"
                                  className="action-button delete"
                                  onClick={() => {
                                    setCurrentInstructor({
                                      id: instructor.id,
                                      firstName: instructor.firstName,
                                      lastName: instructor.lastName,
                                      phone: instructor.phone,
                                      email: instructor.email,
                                      city: instructor.city,
                                      sector: instructor.sector
                                    });
                                    setDeleteOpen(true);
                                  }}
                                  sx={{
                                    minWidth: '55px',
                                    height: '22px',
                                    fontSize: '0.65rem',
                                    px: 0.5,
                                    py: 0.2,
                                    '& .MuiButton-startIcon': {
                                      marginLeft: 0.3,
                                      marginRight: 0,
                                    }
                                  }}
                                >
                                  מחק
                                </Button>
                              </Box>
                            </TableCell>

                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.id}</TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.firstName}</TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.lastName}</TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.phone}</TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <Email sx={{ color: '#3B82F6', fontSize: 12 }} />
                                <span style={{ fontSize: '0.85rem' }}>{instructor.email}</span>
                              </Box>
                            </TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.city}</TableCell>
                            <TableCell className="table-cell" sx={{ py: 0.3, px: 0.5 }}>{instructor.sector}</TableCell>


                          </motion.tr>
                        ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <InstructorEmptyState searchTerm={searchTerm} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="advanced-pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                  }
                }}
              />
            </Box>
          </motion.div>
        )}

       

        {/* דיאלוג הוספת מדריך */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ➕ הוסף מדריך חדש
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={newInstructor.id || ''}
              onChange={(e) => setNewInstructor({ ...newInstructor, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={newInstructor.firstName}
              onChange={(e) => setNewInstructor({ ...newInstructor, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={newInstructor.lastName}
              onChange={(e) => setNewInstructor({ ...newInstructor, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={newInstructor.phone || ''}
              onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={newInstructor.city}
              onChange={(e) => setNewInstructor({ ...newInstructor, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              type="email"
              label="📧 אימייל"
              value={newInstructor.email}
              onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={newInstructor.sector}
              onChange={(e) => setNewInstructor({ ...newInstructor, sector: e.target.value })}
              className="dialog-field"
            />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setOpen(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleAdd} className="dialog-button primary">
              ✅ הוסף מדריך
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג עריכה */}
        <Dialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          maxWidth="sm"
          fullWidth
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title">
            ✏️ ערוך מדריך
          </DialogTitle>
          <DialogContent className="dialog-content">
            <TextField
              fullWidth
              label="🆔 תעודת זהות"
              value={currentInstructor.id || ''}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, id: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👤 שם פרטי"
              value={currentInstructor.firstName}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, firstName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="👥 שם משפחה"
              value={currentInstructor.lastName}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, lastName: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📞 טלפון"
              value={currentInstructor.phone || ''}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, phone: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="📧 אימייל"
              value={currentInstructor.email}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, email: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🏙️ עיר"
              value={currentInstructor.city}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, city: e.target.value })}
              className="dialog-field"
            />
            <TextField
              fullWidth
              label="🌍 מגזר"
              value={currentInstructor.sector}
              onChange={(e) => setCurrentInstructor({ ...currentInstructor, sector: e.target.value })}
              className="dialog-field"
            />
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setOpenEdit(false)} className="dialog-button secondary">
              ❌ ביטול
            </Button>
            <Button onClick={handleEdit} className="dialog-button primary">
              💾 שמור שינויים
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג מחיקה */}
        <Dialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          maxWidth="sm"
          className="advanced-dialog"
        >
          <DialogTitle className="dialog-title" sx={{ background: 'linear-gradient(45deg, #EF4444, #DC2626) !important' }}>
            🗑️ מחיקת מדריך
          </DialogTitle>
          <DialogContent className="dialog-content">
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ color: '#374151', mb: 2 }}>
                ? האם אתה בטוח שברצונך למחוק את המדריך
              </Typography>
              <Typography variant="h5" sx={{
                color: '#1E3A8A',
                fontWeight: 'bold'
              }}>
                {currentInstructor.firstName} {currentInstructor.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 1 }}>
                פעולה זו לא ניתנת לביטול
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={() => setDeleteOpen(false)} className="dialog-button primary">
              ❌ ביטול
            </Button>
            <Button
              onClick={() => {
                handleDelete(currentInstructor.id);
                setDeleteOpen(false);
              }}
              className="dialog-button secondary"
            >
              🗑️ כן, מחק
            </Button>
          </DialogActions>
        </Dialog>

        {/* דיאלוג חוגים של מדריך */}
        <InstructorGroupsDialog
          open={groupsOpen}
          onClose={() => setGroupsOpen(false)}
          instructor={currentInstructor}
          groups={instructorGroups}
          loading={groupsLoading}
        />
      </div>
    </motion.div>
  );
}
