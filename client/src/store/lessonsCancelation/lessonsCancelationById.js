// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchLessonCancellationById = createAsyncThunk(
//   'lessonCancellations/fetchById',
//   async (id, thunkAPI) => {
//     try {
//       const res = await axios.get(`${API_URL}/LessonCancellations/GetById/${id}`);
//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchLessonCancellationById = createAsyncThunk(
    'lessonCancellations/fetchById',
    async (cancellationId, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching lesson cancellation by ID:', cancellationId);
            const response = await axios.get(`${API_BASE_URL}/LessonCancellations/GetById/${cancellationId}`);
            console.log('✅ Cancellation fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching cancellation:', error.response?.data);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
