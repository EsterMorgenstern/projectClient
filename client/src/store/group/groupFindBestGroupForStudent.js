import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

// Thunk חדש לקבלת מספר קבוצות
export const FindBestGroupsForStudent = createAsyncThunk(
  'groups/findBestGroupsForStudent',
  async ({ studentId, maxResults = 5 }, { rejectWithValue }) => {
    try {
      console.log('🚀 שולח בקשה לשרת עבור תלמיד:', studentId, 'מקסימום תוצאות:', maxResults);
      
      const response = await axios.get(`${API_BASE_URL}/Group/FindBestGroupsForStudent/${studentId}?maxResults=${maxResults}`);
      
      console.log('📡 תגובה גולמית מהשרת:', response);
      console.log('📊 נתוני התגובה:', response.data);
      console.log('📋 סוג הנתונים:', typeof response.data);
      console.log('📝 האם זה מערך?', Array.isArray(response.data));
      
      // בדיקה מפורטת של התגובה
      if (!response.data) {
        console.warn('⚠️ אין נתונים בתגובה');
        return [];
      }
      
      // אם התגובה היא מערך
      if (Array.isArray(response.data)) {
        console.log('✅ התגובה היא מערך עם', response.data.length, 'פריטים');
        return response.data;
      }
      
      // אם התגובה היא אובייקט יחיד
      if (typeof response.data === 'object') {
        console.log('📦 התגובה היא אובייקט יחיד, ממיר למערך');
        return [response.data];
      }
      
      // אם התגובה היא מחרוזת (JSON)
      if (typeof response.data === 'string') {
        try {
          const parsedData = JSON.parse(response.data);
          console.log('🔄 פרסור JSON הצליח:', parsedData);
          return Array.isArray(parsedData) ? parsedData : [parsedData];
        } catch (parseError) {
          console.error('❌ שגיאה בפרסור JSON:', parseError);
          throw new Error('שגיאה בפרסור נתוני השרת');
        }
      }
      
      console.warn('⚠️ פורמט תגובה לא מוכר:', response.data);
      return [];
      
    } catch (error) {
      console.error('❌ שגיאה בקריאה לשרת:', error);
      console.error('📋 פרטי השגיאה:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'שגיאה בחיפוש קבוצות מתאימות';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// שמירה על ה-Thunk המקורי לתאימות לאחור
export const FindBestGroupForStudent = createAsyncThunk(
  'groups/findBestGroupForStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      console.log('🚀 שולח בקשה לשרת עבור תלמיד (קבוצה אחת):', studentId);
      
      const response = await axios.get(`${API_BASE_URL}/Group/FindBestGroupForStudent/${studentId}`);
      
      console.log('📡 תגובה מהשרת (קבוצה אחת):', response.data);
      
      if (!response.data) {
        console.warn('⚠️ לא נמצאה קבוצה מתאימה');
        return null;
      }
      
      return response.data;
      
    } catch (error) {
      console.error('❌ שגיאה בקריאה לשרת:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'שגיאה בחיפוש קבוצה מתאימה';
      
      return rejectWithValue(errorMessage);
    }
  }
);
