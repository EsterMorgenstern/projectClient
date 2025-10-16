import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Chip, IconButton, Dialog as MuiDialog
} from '@mui/material';
import { Info as InfoIcon, CheckCircle as CheckCircleIcon, Error as ErrorIcon, Warning as WarningIcon, Assignment as AssignmentIcon, AttachMoney as AttachMoneyIcon, Notes as NotesIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const noteTypeIcons = {
  'כללי': <InfoIcon sx={{ color: '#3b82f6' }} />,
  'חיובי': <CheckCircleIcon sx={{ color: '#059669' }} />,
  'שלילי': <ErrorIcon sx={{ color: '#dc2626' }} />,
  'אזהרה': <WarningIcon sx={{ color: '#d97706' }} />,
  'הערת גביה': <AttachMoneyIcon sx={{ color: '#22c55e' }} />,
  'מעקב רישום': <AssignmentIcon sx={{ color: '#0ea5e9' }} />,
};

const StudentNotesDialog = ({ open, onClose, notes = [], student, onAddNote, onEditNote, onDeleteNote }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showAllNotes, setShowAllNotes] = useState(false);

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDeleteNote && noteToDelete) {
      onDeleteNote(noteToDelete);
    }
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  // פילטור ההערות בהתאם למצב התצוגה
  const filteredNotes = showAllNotes 
    ? [...notes] 
    : notes.filter(note => note.noteType === 'הערת גביה');

  // ספירת הערות לפי סוג
  const billingNotesCount = notes.filter(note => note.noteType === 'הערת גביה').length;
  const otherNotesCount = notes.length - billingNotesCount;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        direction: 'rtl',
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '90vh',
          bgcolor: '#f8fafc',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
          color: 'white',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
          direction: 'rtl',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', width: 40, height: 40 }}>
            <NotesIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {`הערות לתלמיד`}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {student?.studentName || student?.name || ''} • ת"ז: {student?.studentId || student?.id || ''}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          bgcolor: '#f8fafc',
          maxHeight: '60vh',
          overflowY: 'auto',
          direction: 'rtl',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      >
        {notes.length === 0 ? (
          <Typography color="textSecondary">אין הערות להצגה</Typography>
        ) : (
          <><br />
            {/* כפתור להצגת הערות נוסxxx */}
            {!showAllNotes && otherNotesCount > 0 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2,
                
                direction: 'rtl'
              }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAllNotes(true)}
                  sx={{
                    borderRadius: '25px',
                    px: 3,
                    py: 1.5,
                    border: '2px solid #22c55e',
                    color: '#22c55e',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(45deg, rgba(34,197,94,0.05) 0%, rgba(5,150,105,0.05) 100%)',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, rgba(34,197,94,0.1) 0%, rgba(5,150,105,0.1) 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(34,197,94,0.25)',
                      borderColor: '#059669'
                    },
                    '&:active': {
                      transform: 'translateY(0px)'
                    }
                  }}
                >
                  📋 צפה בהערות מקטגוריות נוספות ({otherNotesCount})
                </Button>
              </Box>
            )}

            {/* כפתור להסתרת הערות נוספות */}
            {showAllNotes && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2,
                direction: 'rtl'
              }}>
                <Button
                  variant="contained"
                  onClick={() => setShowAllNotes(false)}
                  sx={{
                    borderRadius: '25px',
                    px: 3,
                    py: 1.5,
                    bgcolor: '#22c55e',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.25)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#059669',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(34,197,94,0.35)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)'
                    }
                  }}
                >
                  💰 הצג רק הערות גביה ({billingNotesCount})
                </Button>
              </Box>
            )}

            <List sx={{ direction: 'rtl' }}>
              {filteredNotes
              .sort((a, b) => {
                // הערות גביה יופיעו קודם
                if (a.noteType === 'הערת גביה' && b.noteType !== 'הערת גביה') return -1;
                if (a.noteType !== 'הערת גביה' && b.noteType === 'הערת גביה') return 1;
                // אם שתיהן הערות גביה או שתיהן לא, ממיין לפי תאריך (החדש קודם)
                return new Date(b.createdDate) - new Date(a.createdDate);
              })
              .map((note, idx) => (
              <ListItem 
                key={idx} 
                alignItems="flex-start" 
                sx={{ 
                  bgcolor: '#fff', 
                  borderRadius: 2, 
                  mb: 2, 
                  boxShadow: '0 2px 8px rgba(34,197,94,0.08)', 
                  position: 'relative',
                  paddingLeft: '80px', // השארת מקום לאייקונים בצד שמאל
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ListItemAvatar sx={{ minWidth: 56 }}>
                  <Avatar>
                    {noteTypeIcons[note.noteType] || <NotesIcon />}
                  </Avatar>
                </ListItemAvatar>
                
                {/* תוכן ההערה - יתפוס את כל המקום הפנוי עד לאייקונים */}
                <Box sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  paddingRight: 2,
                  overflow: 'hidden'
                }}>
                  {/* שורה עליונה - סוג הערה ופרטי יוצר */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={note.noteType} size="small" sx={{ bgcolor: '#e0f2fe', color: '#059669', fontWeight: 'bold' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#059669' }}>{note.authorName}</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>({note.authorRole})</Typography>
                  </Box>
                  
                  {/* תוכן ההערה */}
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      textAlign: 'right', 
                      wordBreak: 'break-word',
                      lineHeight: 1.4,
                      marginBottom: 1
                    }}
                  >
                    {note.noteContent}
                  </Typography>
                  
                  {/* תאריך */}
                  <Typography 
                    variant="caption" 
                    color="textSecondary" 
                    sx={{ 
                      textAlign: 'right',
                      alignSelf: 'flex-end'
                    }}
                  >
                    {(() => {
                      // בדיקה של כל השדות האפשריים לתאריך
                      const dateField = note.createdDate || note.dateCreated || note.created || note.date;
                      console.log('🔍 תאריך הערה:', { 
                        raw: note, 
                        createdDate: note.createdDate,
                        dateCreated: note.dateCreated,
                        created: note.created,
                        date: note.date,
                        finalDate: dateField
                      });
                      
                      if (!dateField || dateField === '0001-01-01T00:00:00' || new Date(dateField).getFullYear() === 1) {
                        return new Date().toLocaleDateString('he-IL'); // תאריך נוכחי כברירת מחדל
                      }
                      
                      return new Date(dateField).toLocaleDateString('he-IL');
                    })()}
                  </Typography>
                </Box>

                {/* פעולות עריכה ומחיקה - קבועות בצד שמאל במרכז */}
                <Box sx={{ 
                  position: 'absolute', 
                  left: 8, 
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 0.5,
                  zIndex: 10
                }}>
                  <IconButton 
                    color="info" 
                    size="small" 
                    onClick={() => onEditNote(note)}
                    sx={{ 
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                      '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.2)' }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    size="small" 
                    onClick={() => handleDeleteClick(note)}
                    sx={{ 
                      bgcolor: 'rgba(220, 38, 38, 0.1)',
                      '&:hover': { bgcolor: 'rgba(220, 38, 38, 0.2)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 2, flexDirection: 'row', justifyContent: 'flex-end', bgcolor: '#f8fafc', direction: 'rtl' }}>
        <Button variant="contained"  onClick={() => onAddNote(student)} sx={{backgroundColor:'rgba(35, 145, 75, 0.99)' ,borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 2px 8px rgba(36, 188, 92, 0.99)' }}>
          הוסף הערת גביה
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose} sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 'bold' }}>
          סגור
        </Button>
      </DialogActions>
      {/* דיאלוג אישור מחיקה */}
      <MuiDialog open={deleteDialogOpen} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ direction: 'rtl', fontWeight: 'bold' }}>אישור מחיקת הערה</DialogTitle>
        <DialogContent sx={{ direction: 'rtl' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            האם אתה בטוח שברצונך למחוק את ההערה הזו? פעולה זו אינה ניתנת לשחזור.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {noteToDelete?.noteContent}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ direction: 'rtl', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" color="primary">ביטול</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">מחק</Button>
        </DialogActions>
      </MuiDialog>
    </Dialog>
  );
}

export default StudentNotesDialog;
