import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getPaymentNotes = createAsyncThunk(
  'studentNotes/getPaymentNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentNotes/getByPaymentsNotes`);
      
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue('שגיאה בקבלת הערות גביה');
      }
    } catch (error) {
      console.error('שגיאה בקבלת הערות גביה:', error);
      
      // Handle different error scenarios
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           `שגיאת שרת: ${error.response.status}`;
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        return rejectWithValue('שגיאת רשת - לא ניתן להתחבר לשרת');
      } else {
        return rejectWithValue('שגיאה לא צפויה');
      }
    }
  }
);

// פונקציה עזר לחילוץ studentIds מהערות גביה לפי טקסט מסוים
export const extractStudentIdsByNoteContent = (paymentNotes, searchTerm) => {
  if (!Array.isArray(paymentNotes) || !searchTerm) {
    return [];
  }
  
  return paymentNotes
    .filter(note => 
      note.noteContent && 
      note.noteContent.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(note => note.studentId)
    .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates
};

// פונקציה עזר לחילוץ studentIds מהערות גביה לפי הערות אוטומטיות
export const extractStudentIdsByAutomaticBillingNotes = (paymentNotes, selectedAutomaticNotes) => {
  if (!Array.isArray(paymentNotes) || !Array.isArray(selectedAutomaticNotes) || selectedAutomaticNotes.length === 0) {
    return [];
  }
  
  const studentIds = new Set();
  
  selectedAutomaticNotes.forEach(noteType => {
    // חיפוש בהערות - נחפש בצורה גמישה יותר
    paymentNotes.forEach((note) => {
      let isMatch = false;
      
      if (note.noteContent) {
        // חיפוש גמיש יותר - נכלול יותר וריאציות של הטקסט
        const content = note.noteContent.toLowerCase();
        
        // נבדוק את כל הטקסט בהערה עבור כל סוג
        switch (noteType) {
          case 'noReferralSent':
            isMatch = content.includes('לא שלחו הפניה') || 
                     content.includes('לא שלחה הפניה') ||
                     content.includes('אין הפניה') ||
                     content.includes('חסרה הפניה') ||
                     content.includes('🚫 לא שלחו הפניה');
            break;
          case 'noEligibility':
            isMatch = content.includes('אין זכאות') || 
                     content.includes('לא זכאי') ||
                     content.includes('אינו זכאי') ||
                     content.includes('אין זכאות לטיפולים') ||
                     content.includes('❌ אין זכאות לטיפולים');
            break;
          case 'insufficientTreatments':
            isMatch = content.includes('מס\' הטיפולים') || 
                     content.includes('מספר הטיפולים') ||
                     content.includes('טיפולים בהתחייבות') ||
                     content.includes('התחייבות נמוך') ||
                     content.includes('לא מספיק') ||
                     content.includes('📊 מס\' הטיפולים');
            break;
          case 'treatmentsFinished':
            isMatch = content.includes('נגמרו הטיפולים') || 
                     content.includes('סיים את הטיפולים') ||
                     content.includes('הטיפולים נגמרו') ||
                     content.includes('אין עוד טיפולים') ||
                     content.includes('סיים התחייבות') ||
                     content.includes('✅ סיים התחייבות') ||
                     content.includes('🔚 נגמרו הטיפולים');
            break;
          case 'authorizationCancelled':
            isMatch = content.includes('הו"ק בוטלה') || 
                     content.includes('הרשאה בוטלה') ||
                     content.includes('בוטלה ההרשאה') ||
                     content.includes('האישור בוטל') ||
                     content.includes('🚨 הו"ק בוטלה');
            break;
          default:
            isMatch = content.includes(noteType.toLowerCase());
        }
        
      }
      
      if (isMatch) {
        studentIds.add(note.studentId);
      }
    });
  });
  
  return Array.from(studentIds);
};