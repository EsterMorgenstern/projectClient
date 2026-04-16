import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  MenuItem,
  TextField,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Close,
  FileDownload,
  LocalHospital
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { fetchUnreportedDates } from '../store/studentHealthFund/studentHealthFundApi';

const EXCEL_MAX_SHEET_NAME_LENGTH = 31;

const sanitizeExcelSheetName = (name, fallback = 'Sheet1') => {
  const safeName = String(name ?? '')
    .replace(/[\[\]\*\?/\\:]/g, '-')
    .trim();

  if (!safeName) {
    return fallback;
  }

  return safeName.slice(0, EXCEL_MAX_SHEET_NAME_LENGTH);
};

const sanitizeFileNamePart = (value, fallback = 'export') => {
  const safeValue = String(value ?? '')
    .replace(/[<>:"/\\|\?\*]/g, '-')
    .trim();

  return safeValue || fallback;
};

const ExcelExportDialog = ({ open, onClose, data, healthFundList, dispatch }) => {
  const [selectedHealthFund, setSelectedHealthFund] = useState('');
  const [exporting, setExporting] = useState(false);

  const healthFundOptions = [
    { id: 'leumit', name: 'לאומית' },
    { id: 'meuhedet', name: 'מאוחדת' },
    { id: 'maccabi', name: 'מכבי' },
    { id: 'clalit', name: 'כללית' }
  ];

  const handleExport = async () => {
    if (!selectedHealthFund) {
      alert('אנא בחר קופת חולים');
      return;
    }

    setExporting(true);

    try {
      // סינון התלמידים לפי קופת החולים שנבחרה
      const filteredStudents = data.filter(student => {
        const fund = healthFundList.find(f => Number(f.healthFundId) === Number(student.healthFundId));
        if (!fund) return false;
        
        const fundName = fund.name.toLowerCase();
        
        switch (selectedHealthFund) {
          case 'leumit':
            return fundName.includes('לאומית');
          case 'meuhedet':
            return fundName.includes('מאוחדת');
          case 'maccabi':
            return fundName.includes('מכבי');
          case 'clalit':
            return fundName.includes('כללית');
          default:
            return false;
        }
      });

      if (filteredStudents.length === 0) {
        alert('לא נמצאו תלמידים עבור קופת החולים שנבחרה');
        setExporting(false);
        return;
      }

      // הכנת הנתונים לייצוא
      const exportData = [];
      
      for (const student of filteredStudents) {
        const fund = healthFundList.find(f => Number(f.healthFundId) === Number(student.healthFundId));
        
        // השגת תאריכים לא מדווחים לתלמיד זה
        let unreportedDatesText = '';
        let unreportedDatesCount = 0;
        try {
          console.log(`🔍 מושך תאריכים לתלמיד ${student.studentId}...`);
          const unreportedDatesResult = await dispatch(fetchUnreportedDates(student.id)).unwrap();
          unreportedDatesCount = Array.isArray(unreportedDatesResult) ? unreportedDatesResult.length : 0;
          
          if (unreportedDatesResult && unreportedDatesResult.length > 0) {
            // קיבוץ התאריכים לפי חודשים
            const datesByMonth = unreportedDatesResult.reduce((acc, dateString) => {
              const date = new Date(dateString);
              const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
              const monthName = date.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
              
              if (!acc[monthKey]) {
                acc[monthKey] = {
                  monthName,
                  dates: []
                };
              }
              acc[monthKey].dates.push(date);
              return acc;
            }, {});
            
            // יצירת טקסט מעוצב של התאריכים
            const monthTexts = Object.keys(datesByMonth)
              .sort((a, b) => new Date(datesByMonth[a].dates[0]) - new Date(datesByMonth[b].dates[0]))
              .map(monthKey => {
                const monthData = datesByMonth[monthKey];
                const sortedDates = monthData.dates
                  .sort((a, b) => a - b)
                  .map(date => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`)
                  .join(', ');
                return `${monthData.monthName}: ${sortedDates}`;
              });
            
            unreportedDatesText = monthTexts.join(' | ');
          } else {
            unreportedDatesText = 'אין תאריכים לא מדווחים';
          }
        } catch (error) {
          console.error(`❌ שגיאה בהשגת תאריכים לתלמיד ${student.studentId}:`, error);
          unreportedDatesText = 'שגיאה בהשגת נתונים';
        }

        // השגת הערות מהטבלה (לא ההערות הנפרדות של התלמיד)
        let studentNotesText = '';
        try {
          // השתמש בהערות מהשדה notes של הרשומה בטבלה
          if (student.notes && student.notes.trim() !== '') {
            studentNotesText = student.notes.trim();
          } else {
            studentNotesText = 'אין הערות';
          }
        } catch (error) {
          console.error(`❌ שגיאה בהשגת הערות לתלמיד ${student.studentId}:`, error);
          studentNotesText = 'שגיאה בהשגת הערות';
        }
        
        exportData.push({
          'שם הילד': student.studentName || '',
          'ת"ז / קוד התלמיד': student.studentId,
          'מס\' השיעורים שצריך לדווח': unreportedDatesCount,
          'תאריכי הטיפולים הלא מדווחים': unreportedDatesText,
          'הערות': studentNotesText
        });
      }

      // יצירת קובץ Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // הגדרת רוחב עמודות
      const columnWidths = [
        { wch: 25 }, // שם הילד
        { wch: 18 }, // ת"ז / קוד התלמיד
        { wch: 20 }, // מס' השיעורים שצריך לדווח
        { wch: 60 }, // תאריכי הטיפולים הלא מדווחים
        { wch: 80 }  // הערות
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      const selectedFundName = healthFundOptions.find(f => f.id === selectedHealthFund)?.name || selectedHealthFund;
      const sheetName = sanitizeExcelSheetName(selectedFundName, 'תלמידים');
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // שמירת הקובץ
      const safeFundName = sanitizeFileNamePart(selectedFundName, 'קופה');
      const fileName = `תלמידים_${safeFundName}_${new Date().toLocaleDateString('he-IL').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      console.log(`✅ ייצוא הושלם: ${filteredStudents.length} תלמידים נוצאו לקובץ ${fileName}`);
      
      // סגירת הדיאלוג
      onClose();
      setSelectedHealthFund('');
      
    } catch (error) {
      console.error('❌ שגיאה בייצוא:', error);
      alert('שגיאה בייצוא הקובץ: ' + error.message);
    }

    setExporting(false);
  };

  const handleClose = () => {
    if (!exporting) {
      onClose();
      setSelectedHealthFund('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(37,99,235,0.15)',
          direction: 'rtl',
          bgcolor: 'white',
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: '#2563EB',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: 'rtl',
        minHeight: 60,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileDownload sx={{ fontSize: 32, color: 'white' }} />
          <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 'bold', ml: 1 }}>
            ייצוא לאקסל
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }} size="small" disabled={exporting}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        p: 4,
        direction: 'rtl',
        bgcolor: 'white',
      }}>
        <br />
        <Typography variant="body1" sx={{ 
          color: '#374151', 
          mb: 3,
          textAlign: 'center'
        }}>
          בחר קופת חולים לייצוא רשימת התלמידים עם פרטים מלאים:
        </Typography>
        
        <Box sx={{ 
          bgcolor: '#f0f9ff', 
          borderRadius: '8px', 
          p: 2, 
          border: '1px solid #0ea5e9',
          direction: 'rtl',
          mb: 3
        }}>
          <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 500 }}>
            הקובץ יכלול: שם הילד, ת"ז/קוד התלמיד, מספר השיעורים שצריך לדווח, תאריכי הטיפולים הלא מדווחים והערות התלמיד
          </Typography>
        </Box>

        <TextField
          select
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, direction: 'rtl' }}>
              <LocalHospital sx={{ color: '#2563EB' }} />
              <span>קופת חולים</span>
              <span style={{ color: '#d32f2f', fontWeight: 'bold', marginRight: 2 }}>*</span>
            </Box>
          }
          fullWidth
          variant="outlined"
          value={selectedHealthFund}
          onChange={(e) => setSelectedHealthFund(e.target.value)}
          disabled={exporting}
          sx={{ mb: 3 }}
          inputProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
        >
          {healthFundOptions.map(fund => (
            <MenuItem key={fund.id} value={fund.id}>
              {fund.name}
            </MenuItem>
          ))}
        </TextField>

        {selectedHealthFund && (
          <Box sx={{ 
            bgcolor: '#e3f2fd', 
            borderRadius: '8px', 
            p: 2, 
            border: '1px solid #2196f3',
            direction: 'rtl',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#1565c0', fontWeight: 500 }}>
              {(() => {
                const selectedFundName = healthFundOptions.find(f => f.id === selectedHealthFund)?.name;
                const count = data.filter(student => {
                  const fund = healthFundList.find(f => Number(f.healthFundId) === Number(student.healthFundId));
                  if (!fund) return false;
                  const fundName = fund.name.toLowerCase();
                  switch (selectedHealthFund) {
                    case 'leumit': return fundName.includes('לאומית');
                    case 'meuhedet': return fundName.includes('מאוחדת');
                    case 'maccabi': return fundName.includes('מכבי');
                    case 'clalit': return fundName.includes('כללית');
                    default: return false;
                  }
                }).length;
                return `נמצאו ${count} תלמידים מקופת חולים ${selectedFundName}`;
              })()}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{
        p: 2,
        gap: 1,
        direction: 'rtl',
        bgcolor: '#f8fafc',
        borderRadius: '0 0 16px 16px',
      }}>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleClose} 
          disabled={exporting}
          sx={{ borderRadius: '8px', px: 3, py: 1 }}
        >
          ביטול
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleExport}
          disabled={!selectedHealthFund || exporting}
          startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <FileDownload />}
          sx={{ 
            borderRadius: '8px', 
            px: 3, 
            py: 1, 
            fontWeight: 'bold',
            bgcolor: '#2563EB',
            '&:hover': { bgcolor: '#1D4ED8' },
            '&:disabled': { bgcolor: '#94A3B8' },
            direction: 'ltr'
          }}
        >
          {exporting ? '...מייצא' : 'ייצא לאקסל'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExcelExportDialog;