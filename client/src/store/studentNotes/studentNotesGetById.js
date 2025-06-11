import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getNotesByStudentId= createAsyncThunk(
  'studentNote/GetNotesByStudentId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5248/api/StudentNotes/getById/${id}`);


      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);
 