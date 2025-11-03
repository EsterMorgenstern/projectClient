import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const getPaymentNotes = createAsyncThunk(
  'studentNotes/getPaymentNotes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentNotes/getByPaymentsNotes`);
      
      // Debug log - מפורט יותר
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('🔍 First payment note example:', response.data[0]);
        const sampleNotes = response.data.slice(0, 5);
        console.log('🔍 Sample notes structure:', sampleNotes.map(note => ({
          studentId: note.studentId,
          noteType: note.noteType,
          noteContent: note.noteContent ? note.noteContent.substring(0, 100) : 'No content'
        })));
      }
      
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
  console.log('🔍 extractStudentIdsByAutomaticBillingNotes - Input:', { 
    paymentNotesCount: paymentNotes?.length, 
    selectedAutomaticNotes: selectedAutomaticNotes
  });
  
  if (!Array.isArray(paymentNotes) || !Array.isArray(selectedAutomaticNotes) || selectedAutomaticNotes.length === 0) {
    console.log('🔍 Invalid input - returning empty array', {
      paymentNotesIsArray: Array.isArray(paymentNotes),
      selectedAutomaticNotesIsArray: Array.isArray(selectedAutomaticNotes),
      selectedAutomaticNotesLength: selectedAutomaticNotes?.length
    });
    return [];
  }
  
  const studentIds = new Set();
  

  
  selectedAutomaticNotes.forEach(noteType => {
    console.log(`🔍 Searching for noteType: ${noteType}`);
    
    // חיפוש בהערות - נחפש בצורה גמישה יותר
    paymentNotes.forEach((note, index) => {
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
        
        // דיבוג נוסף
        if (index < 3 || isMatch) {
          console.log(`🔍 Note check: StudentId=${note.studentId}, Match=${isMatch}, NoteType=${noteType}, Content="${content.substring(0, 100)}..."`);
        }
      }
      
      if (isMatch) {
        console.log(`🔍 Found match! StudentId: ${note.studentId} (${typeof note.studentId}), Content: ${note.noteContent}`);
        // נוסיף רק את הערך המקורי
        studentIds.add(note.studentId);
      }
    });
  });
  
  const result = Array.from(studentIds);
  console.log('🔍 Final student IDs:', result);
  return result;
};