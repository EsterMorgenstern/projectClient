import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deleteStudentHealthFund = createAsyncThunk(
  'studentHealthFund/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/StudentHealthFund/Delete?studentHealthFundId=${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete student health fund');
    }
  }
);
