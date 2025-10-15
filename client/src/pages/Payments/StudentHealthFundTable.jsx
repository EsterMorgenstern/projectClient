import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, Tooltip, Divider, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';
import { AddCircle, Person, LocalHospital, CalendarMonth, Healing, AssignmentTurnedIn, Description, Note, Save, Close, Face, LocationCity, Groups, Event } from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';
import StudentNotesDialog from '../Students/components/StudentNotesDialog';
import { fetchStudentHealthFunds } from '../../store/studentHealthFund/fetchStudentHealthFunds';
import { addStudentHealthFund } from '../../store/studentHealthFund/addStudentHealthFund';
import { updateStudentHealthFund } from '../../store/studentHealthFund/updateStudentHealthFund';
import { deleteStudentHealthFund } from '../../store/studentHealthFund/deleteStudentHealthFund';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddStudentNoteDialog from '../Students/components/addStudentNoteDialog';
import { getNotesByStudentId } from '../../store/studentNotes/studentNotesGetById';
import { updateStudentNote } from '../../store/studentNotes/studentNoteUpdateThunk';
import { addStudentNote } from '../../store/studentNotes/studentNoteAddThunk';
import { deleteStudentNote } from '../../store/studentNotes/studentNoteDeleteThunk';

// Styled table container inspired by instructorsTable and Home


const StudentHealthFundTable = () => {
  // Dialog for health fund details
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);

  const handleOpenFundDialog = (row) => {
    const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
    setSelectedFund(fund || null);
    setFundDialogOpen(true);
  };
  const handleCloseFundDialog = () => {
    setFundDialogOpen(false);
    setSelectedFund(null);
  };
  // דיאלוג עדכון
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  // דיאלוג מחיקה
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteSaving, setDeleteSaving] = useState(false);

  // דיאלוג צפייה בהערות
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesStudent, setNotesStudent] = useState(null);
  const [studentNotes, setStudentNotes] = useState([]);
  // דיאלוג הוספת הערה
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [addNoteStudent, setAddNoteStudent] = useState(null);

  // TODO: fetch notes from store/api if needed
  const handleOpenNotesDialog = async (studentRow) => {
    // העברת ת.ז. ושם התלמיד מהעמודות
    const notesStudentObj = {
      id: studentRow.studentId || studentRow.id,
      studentId: studentRow.studentId || studentRow.id,
      studentName: studentRow.studentName || '',
      ...studentRow
    };
    setNotesStudent(notesStudentObj);
    // Fetch all notes from store/api
    let notes = [];
    if (notesStudentObj.id) {
      try {
       
        const result = await dispatch(getNotesByStudentId(notesStudentObj.studentId)).unwrap();
        notes = Array.isArray(result) ? result : [];
      } catch (err) {
        notes = Array.isArray(studentRow.notesList) ? studentRow.notesList : [];
      }
    }
    setStudentNotes(notes);
    setNotesDialogOpen(true);
  };
  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setNotesStudent(null);
    setStudentNotes([]);
  };
  // פתיחת דיאלוג הוספת הערה גביה
  const handleAddPaymentNote = (studentObj) => {
    setAddNoteStudent({
      ...studentObj,
      noteType: 'הערת גביה',
    });
    setAddNoteDialogOpen(true);
  };
  const handleCloseAddNoteDialog = () => {
    setAddNoteDialogOpen(false);
    setAddNoteStudent(null);
  };
  const handleAddNote = () => {
    setNotesEditMode(false);
    setNotesEditData(null);
  };
  const handleEditNote = (note) => {
    setNotesEditMode(true);
    setNotesEditData(note);
  };
  const handleSaveNote = async (note) => {
    try {
      if (note.noteId) {
        await dispatch(updateStudentNote(note)).unwrap();
      } else {
        await dispatch(addStudentNote(note)).unwrap();
      }
      // רענון הערות לאחר שמירה
      if (notesStudent?.id) {
        const result = await dispatch(getNotesByStudentId(notesStudent.studentId)).unwrap();
        setStudentNotes(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      // אפשר להציג שגיאה למשתמש
    }
    setAddNoteDialogOpen(false);
  };
  const dispatch = useDispatch();
  const studentHealthFundState = useSelector(state => state.studentHealthFunds || {});
  const healthFunds = Array.isArray(studentHealthFundState.items) ? studentHealthFundState.items : [];
  const loading = studentHealthFundState.loading;
  const error = studentHealthFundState.error;
  // קופות החולים מהסטייט
  const healthFundList = useSelector(state => (state.healthFunds && state.healthFunds.items) ? state.healthFunds.items : []);

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    healthFundId: '',
    startDate: '',
    treatmentsUsed: '',
    commitmentTreatments: '',
    referralFilePath: '',
    commitmentFilePath: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentHealthFunds());
  }, [dispatch]);

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      studentId: '',
      healthFundId: '',
      startDate: '',
      treatmentsUsed: '',
      commitmentTreatments: '',
      referralFilePath: '',
      commitmentFilePath: '',
      notes: ''
    });
    setSaving(false);
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(addStudentHealthFund(formData)).unwrap();
      handleCloseAddDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      // Optionally show error to user
      console.error('Failed to add student health fund:', err);
    }
    setSaving(false);
  };

  // עדכון
  const handleOpenEditDialog = (row) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
    setEditSaving(false);
  };
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
    setEditSaving(false);
  };
  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleEditSave = async () => {
    setEditSaving(true);
    try {
      await dispatch(updateStudentHealthFund(editFormData)).unwrap();
      handleCloseEditDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('Failed to update student health fund:', err);
    }
    setEditSaving(false);
  };

  // מחיקה
  const handleOpenDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
    setDeleteSaving(false);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteSaving(false);
  };
  const handleDeleteConfirm = async () => {
    setDeleteSaving(true);
    try {
      await dispatch(deleteStudentHealthFund(deleteId)).unwrap();
      handleCloseDeleteDialog();
      dispatch(fetchStudentHealthFunds());
    } catch (err) {
      console.error('Failed to delete student health fund:', err);
    }
    setDeleteSaving(false);
  };

  return (
  <Box sx={{ bgcolor: 'transparent', p: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea', textAlign: 'right', ml: 2 }}>
        ניהול גביה תלמידים
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddCircle />}
        color="primary"
        sx={{ borderRadius: '24px', direction: 'ltr', fontWeight: 'bold', px: 4, py: 1.5, boxShadow: '0 4px 14px rgba(37,99,235,0.18)', fontSize: '1rem', transition: 'all 0.2s', bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
        onClick={handleOpenAddDialog}
      >
        הוספה
      </Button>
    </Box>
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto', background: 'white', p: 0 }}>
      <Table sx={{ minWidth: 1400 }}>
          <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Person sx={{ color: '#2563EB' }} />
                  <span>קוד תלמיד</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Face sx={{ color: '#43E97B' }} />
                  <span>שם תלמיד</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Face sx={{ color: '#764ba2' }} />
                  <span>גיל</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocationCity sx={{ color: '#38F9D7' }} />
                  <span>עיר</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Event sx={{ color: '#F59E42' }} />
                  <span>תאריך התחלה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Groups sx={{ color: '#667eea' }} />
                  <span>שם קבוצה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocalHospital sx={{ color: '#764ba2' }} />
                  <span>קופה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CalendarMonth sx={{ color: '#38F9D7' }} />
                  <span>תאריך יצירה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Healing sx={{ color: '#F59E42' }} />
                  <span>טיפולים בשימוש</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', width: 60, minWidth: 40, maxWidth: 80 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AssignmentTurnedIn sx={{ color: '#667eea' }} />
                  <span>התחייבות טיפולים</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Description sx={{ color: '#2563EB' }} />
                  <span>קובץ הפניה</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Description sx={{ color: '#764ba2' }} />
                  <span>קובץ התחייבות</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Note sx={{ color: '#F59E42' }} />
                  <span>הערות</span>
                </Box>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <EditIcon sx={{ color: 'white' }} />
                  <span>פעולות</span>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(10)].map((__, i) => (
                    <TableCell key={i}><Skeleton variant="rectangular" height={24} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : healthFunds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="h6" color="text.secondary">אין נתונים להצגה</Typography>
                </TableCell>
              </TableRow>
            ) : (
              healthFunds.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ background: idx % 2 === 0 ? '#f8fafc' : '#e2e8f0', height: 36 }}
                >
                  <TableCell align="center">{row.studentId}</TableCell>
                  <TableCell align="center">{row.studentName || '-'}</TableCell>
                  <TableCell align="center">{row.age ?? '-'}</TableCell>
                  <TableCell align="center">{row.city || '-'}</TableCell>
                  <TableCell align="center">{row.startDateGroup ? new Date(row.startDateGroup).toLocaleDateString('he-IL') : '-'}</TableCell>
                  <TableCell align="center" sx={{ p: 0.5 }}>
                    {row.groupName ? (
                      <Tooltip title={row.groupName} arrow>
                        <span style={{ cursor: 'pointer', whiteSpace: 'normal', wordBreak: 'break-word', direction: 'rtl', textAlign: 'right', display: 'inline-block', maxWidth: 120 }}>
                          {(() => {
                            const words = row.groupName.split(' ');
                            const shown = words.slice(0, 3).join(' ');
                            const rest = words.slice(3).join(' ');
                            return rest
                              ? <>{shown} <span style={{ color: '#888', fontWeight: 400 }}>...</span></>
                              : <>{shown}</>;
                          })()}
                        </span>
                      </Tooltip>
                    ) : '-' }
                  </TableCell>
                  <TableCell align="center">
                    {(() => {
                      const fund = healthFundList.find(f => Number(f.healthFundId) === Number(row.healthFundId));
                      return fund ? `${fund.name} ${fund.fundType}` : row.healthFundId;
                    })()}
                  </TableCell>
                  <TableCell align="center">{new Date(row.startDate).toLocaleDateString('he-IL')}</TableCell>
                  <TableCell align="center">{row.treatmentsUsed}</TableCell>
                  <TableCell align="center">{row.commitmentTreatments}</TableCell>
                  <TableCell align="center">{row.referralFilePath ? <Chip label="קיים" color="primary" /> : <Chip label="אין" color="default" />}</TableCell>
                  <TableCell align="center">{row.commitmentFilePath ? <Chip label="קיים" color="primary" /> : <Chip label="אין" color="default" />}</TableCell>
                  <TableCell align="center">{row.notes}</TableCell>
                  <TableCell align="center" sx={{  py: 0 }}>
                    <Tooltip title="עריכה" arrow>
                      <IconButton color="info" onClick={() => handleOpenEditDialog(row)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחיקה" arrow>
                      <IconButton color="error" onClick={() => handleOpenDeleteDialog(row.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'צפיה בפרטי קופ"ח'} arrow>
                      <IconButton color="primary" onClick={() => handleOpenFundDialog(row)} size="small" sx={{ ml: 1 }}>
                        <LocalHospital />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="הערות גביה" arrow>
                      <IconButton color="secondary" onClick={() => handleOpenNotesDialog(row)} size="small" sx={{ ml: 1 }}>
                        <NotesIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
      {/* דיאלוג הערות גביה */}
      <StudentNotesDialog
        open={notesDialogOpen}
        onClose={handleCloseNotesDialog}
        notes={studentNotes}
        student={notesStudent}
        onAddNote={handleAddPaymentNote}
        onEditNote={(note) => {
          setAddNoteStudent({ ...notesStudent, ...note });
          setAddNoteDialogOpen(true);
        }}
        onDeleteNote={async (note) => {
          try {
            if (note.noteId) {
              console.log('מחיקת הערה: שולח לשרת noteId', note.noteId);
              const deleteResult = await dispatch(deleteStudentNote(note.noteId)).unwrap();
              console.log('תוצאת מחיקה מהשרת:', deleteResult);
              if (notesStudent?.id) {
                const result = await dispatch(getNotesByStudentId(notesStudent.studentId)).unwrap();
                console.log('רענון הערות לאחר מחיקה:', result);
                setStudentNotes(Array.isArray(result) ? result : []);
              }
            } else {
              console.log('אין noteId למחיקה');
            }
          } catch (err) {
            console.error('שגיאת מחיקה:', err);
          }
        }}
      />
      <AddStudentNoteDialog
        open={addNoteDialogOpen}
        onClose={handleCloseAddNoteDialog}
        student={addNoteStudent}
        onSave={handleSaveNote}
        editMode={!!addNoteStudent?.noteId}
        noteData={addNoteStudent}
        studentNotes={studentNotes}
      />
      {/* דיאלוג פרטי קופה */}
      <Dialog
        open={fundDialogOpen}
        onClose={handleCloseFundDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.10)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          direction: 'rtl',
          minHeight: 60,
          boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
          background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospital sx={{ fontSize: 32, color: 'white' }} />
            <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold', ml: 1 }}>פרטי קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseFundDialog} sx={{ color: '#2563EB' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 4,
          direction: 'rtl',
          bgcolor: 'white',
          background: 'white',
          borderRadius: 0,
        }}>
          <br />
          {selectedFund ? (
            <Box sx={{
              bgcolor: 'white',
              borderRadius: 0,
              p: 3,
              boxShadow: 'none',
              minWidth: 320,
              border: 'none',
            }}>
              <Typography variant="h5" sx={{ color: '#2563EB', fontWeight: 'bold', mb: 2, textAlign: 'center', letterSpacing: 1 }}>{selectedFund.name}</Typography>
              <Divider sx={{ mb: 2, bgcolor: '#e3f0ff' }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>סוג:</b> {selectedFund.fundType}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מקסימום טיפולים בשנה:</b> {selectedFund.maxTreatmentsPerYear}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מחיר לשיעור:</b> {selectedFund.pricePerLesson}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>מחיר חודשי:</b> {selectedFund.monthlyPrice}</Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>הפניה נדרשת:</b> <Chip label={selectedFund.requiresReferral ? 'כן' : 'לא'} color={selectedFund.requiresReferral ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.requiresReferral ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>התחייבות נדרשת:</b> <Chip label={selectedFund.requiresCommitment ? 'כן' : 'לא'} color={selectedFund.requiresCommitment ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.requiresCommitment ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
                <Grid item xs={12} sm={6}><Typography sx={{ color: '#2563EB' }}><b>פעילה:</b> <Chip label={selectedFund.isActive ? 'כן' : 'לא'} color={selectedFund.isActive ? 'primary' : 'default'} size="small" sx={{ bgcolor: selectedFund.isActive ? '#e3f0ff' : '#e0e7ef', color: '#2563EB' }} /></Typography></Grid>
              </Grid>
            </Box>
          ) : (
            <Typography color="error">לא נמצאו פרטי קופה</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'transparent',
          borderRadius: '0 0 20px 20px',
          background: 'linear-gradient(90deg, #2563EB 0%, #43E97B 100%)',
        }}>
          <Button variant="contained" color="primary" onClick={handleCloseFundDialog} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 8px rgba(37,99,235,0.18)', bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}>סגור</Button>
        </DialogActions>
      </Dialog>
                </motion.tr>
              ))
            )}
          </TableBody>
    </Table>
  </TableContainer>
      {/* דיאלוג עדכון */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon />
            <Typography variant="h6" component="span">עדכון סטודנט-קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseEditDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
       
               <br />
   {editFormData && (
            <Grid container spacing={2} sx={{ direction: 'rtl' }}>
              <Grid item xs={12} sm={6}>
                <TextField label="תלמיד" fullWidth variant="outlined" value={editFormData.studentId} onChange={e => handleEditInputChange('studentId', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="קופה" fullWidth variant="outlined" value={editFormData.healthFundId} onChange={e => handleEditInputChange('healthFundId', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="תאריך התחלה" type="date" fullWidth variant="outlined" value={editFormData.startDate} onChange={e => handleEditInputChange('startDate', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="טיפולים בשימוש" type="number" fullWidth variant="outlined" value={editFormData.treatmentsUsed} onChange={e => handleEditInputChange('treatmentsUsed', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="התחייבות טיפולים" type="number" fullWidth variant="outlined" value={editFormData.commitmentTreatments} onChange={e => handleEditInputChange('commitmentTreatments', e.target.value)} inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="קובץ הפניה" fullWidth variant="outlined" value={editFormData.referralFilePath} onChange={e => handleEditInputChange('referralFilePath', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="קובץ התחייבות" fullWidth variant="outlined" value={editFormData.commitmentFilePath} onChange={e => handleEditInputChange('commitmentFilePath', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="הערות" fullWidth variant="outlined" value={editFormData.notes} onChange={e => handleEditInputChange('notes', e.target.value)} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseEditDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleEditSave} disabled={editSaving} sx={{ borderRadius: '8px', px: 3, py: 1,direction:'ltr' ,bgcolor: '#2563EB', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', '&:hover': { bgcolor: '#1D4ED8' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{editSaving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>
      {/* דיאלוג מחיקה */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
            direction: 'rtl',
            bgcolor: 'white',
            background: 'white',
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
          color: '#b71c1c',
          fontWeight: 'bold',
          borderRadius: '16px 16px 0 0',
          direction: 'rtl',
          textAlign: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 2px 8px rgba(237,66,69,0.10)'
        }}>
          האם אתה בטוח שברצונך למחוק?
        </DialogTitle>
        <DialogContent sx={{
          bgcolor: 'white',
          p: 3,
          textAlign: 'center',
          fontSize: '1.1rem',
        }}>
          <Typography sx={{ color: '#2563EB', fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
            {(() => {
              const student = healthFunds.find(s => String(s.id) === String(deleteId));
              return student ? `תלמיד: ${student.studentName || student.studentId}` : '';
            })()}
          </Typography>
        </DialogContent>
        <DialogActions sx={{
          p: 2,
          gap: 1,
          direction: 'rtl',
          bgcolor: 'white',
          borderRadius: '0 0 16px 16px',
        }}>
          <Button variant="outlined" color="primary" onClick={handleCloseDeleteDialog} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', color: '#2563EB', borderColor: '#2563EB' }}>ביטול</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteSaving} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>{deleteSaving ? 'מוחק...' : 'מחק'}</Button>
        </DialogActions>
      </Dialog>
      {/* דיאלוג הוספה */}
      <Dialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', direction: 'rtl' } }}
      >
        <DialogTitle sx={{ bgcolor: '#2563EB', color: 'white', fontWeight: 'bold', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddCircle />
            <Typography variant="h6" component="span">הוספת סטודנט-קופה</Typography>
          </Box>
          <IconButton onClick={handleCloseAddDialog} sx={{ color: 'white' }} size="small"><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, direction: 'rtl' }}>
          <br />
          <Grid container spacing={2} sx={{ direction: 'rtl' }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Person sx={{ color: '#2563EB'}} /> <span>קוד תלמיד </span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                fullWidth 
                variant="outlined" 
                value={formData.studentId} 
                onChange={e => handleInputChange('studentId', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><LocalHospital sx={{ color: '#764ba2' }} /> <span>קופה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>}
                fullWidth
                variant="outlined"
                value={formData.healthFundId}
                onChange={e => handleInputChange('healthFundId', e.target.value)}
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
                SelectProps={{ native: false, renderValue: (selected) => {
                  const fund = Array.isArray(healthFundList) ? healthFundList.find(f => String(f.healthFundId) === String(selected)) : null;
                  return fund ? `${fund.name} (${fund.fundType})` : '';
                }}}
              >
                {Array.isArray(healthFundList) && healthFundList.map(fund => (
                  <MenuItem key={fund.healthFundId} value={fund.healthFundId}>
                    {fund.name} ({fund.fundType})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><CalendarMonth sx={{ color: '#38F9D7' }} /> <span>תאריך התחלה</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="date" 
                fullWidth 
                variant="outlined" 
                value={formData.startDate} 
                onChange={e => handleInputChange('startDate', e.target.value)} 
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><Healing sx={{ color: '#F59E42' }} /> <span>טיפולים בשימוש</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.treatmentsUsed} 
                onChange={e => handleInputChange('treatmentsUsed', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}><AssignmentTurnedIn sx={{ color: '#667eea' }} /> <span>התחייבות טיפולים</span><span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span></Box>} 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.commitmentTreatments} 
                onChange={e => handleInputChange('commitmentTreatments', e.target.value)} 
                inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Description sx={{ color: '#2563EB' }} /> <span>קובץ הפניה</span></Box>} fullWidth variant="outlined" value={formData.referralFilePath} onChange={e => handleInputChange('referralFilePath', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Description sx={{ color: '#764ba2' }} /> <span>קובץ התחייבות</span></Box>} fullWidth variant="outlined" value={formData.commitmentFilePath} onChange={e => handleInputChange('commitmentFilePath', e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Note sx={{ color: '#F59E42' }} /> <span>הערות</span></Box>} fullWidth variant="outlined" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, direction: 'rtl' }}>
          <Button variant="outlined" color="error" onClick={handleCloseAddDialog} sx={{ borderRadius: '8px', px: 3, py: 1 }}>ביטול</Button>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ borderRadius: '8px', px: 3, py: 1, bgcolor: '#2563EB',direction:'ltr', boxShadow: '0 4px 14px rgba(37,99,235,0.3)', '&:hover': { bgcolor: '#1D4ED8' }, '&:disabled': { bgcolor: '#94A3B8', boxShadow: 'none' }, transition: 'all 0.3s ease' }}>{saving ? '...שומר' : 'שמור'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentHealthFundTable;
