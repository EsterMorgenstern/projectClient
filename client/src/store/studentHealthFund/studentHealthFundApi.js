import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchStudentHealthFunds = createAsyncThunk(
  'studentHealthFund/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/GetAll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const addStudentHealthFund = createAsyncThunk(
  'studentHealthFund/add',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/StudentHealthFund/Add`, studentHealthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add student health fund');
    }
  }
);

export const updateStudentHealthFund = createAsyncThunk(
  'studentHealthFund/update',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/StudentHealthFund/Update/${studentHealthFund.id}`, studentHealthFund);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update student health fund');
    }
  }
);

export const deleteStudentHealthFund = createAsyncThunk(
  'studentHealthFund/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/StudentHealthFund/Delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete student health fund');
    }
  }
);
