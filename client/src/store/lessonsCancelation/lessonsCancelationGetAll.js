// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchLessonCancellations = createAsyncThunk(
//   'lessonCancellations/fetchAll',
//   async (_, thunkAPI) => {
//     try {
//       const res = await axios.get(`${API_URL}/LessonCancellations/GetAll`);
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchLessonCancellations = createAsyncThunk(
    'lessonCancellations/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching lesson cancellations...');
            const response = await axios.get(`${API_BASE_URL}/LessonCancellations/GetAll`);
            console.log('✅ Cancellations fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching cancellations:', error.response?.data);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
