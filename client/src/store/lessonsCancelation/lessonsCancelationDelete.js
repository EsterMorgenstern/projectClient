// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const deleteLessonCancellation = createAsyncThunk(
//   'lessonCancellations/delete',
//   async (id, thunkAPI) => {
//     try {
//       await axios.delete(`${API_URL}/LessonCancellations/Delete/${id}`);
//       return id;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteLessonCancellation = createAsyncThunk(
    'lessonCancellations/delete',
    async (cancellationId, { rejectWithValue }) => {
        try {
            console.log('🚀 Deleting lesson cancellation:', cancellationId);
            
            await axios.delete(`${API_BASE_URL}/LessonCancellations/Delete/${cancellationId}`);
            
            console.log('✅ Cancellation deleted successfully:', cancellationId);
            return cancellationId;
        } catch (error) {
            console.error('❌ Error deleting cancellation:', error);
            
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue('שגיאת רשת - אין תגובה מהשרת');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);
