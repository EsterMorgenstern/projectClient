import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const reportUnreportedDate = createAsyncThunk(
  'studentHealthFund/reportUnreportedDate',
  async ({ studentHealthFundId, date }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/StudentHealthFund/${studentHealthFundId}/ReportUnreportedDate`,
        `"${date}"`,
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }
      );
      return { studentHealthFundId, date, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to report unreported date');
    }
  }
);