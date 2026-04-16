import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    fallbackMessage
  );
};

export const fetchStudentHealthFunds = createAsyncThunk(
  'studentHealthFund/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/GetAll`);
      const records = Array.isArray(response.data) ? response.data : [];
      console.log('✅ נתוני קופות תלמידים חזרו מהשרת:', records);
      return records;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch student health fund records'));
    }
  }
);

export const fetchStudentHealthFundById = createAsyncThunk(
  'studentHealthFund/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/GetById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch student health fund record'));
    }
  }
);

export const addStudentHealthFund = createAsyncThunk(
  'studentHealthFund/add',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/StudentHealthFund/Add`, studentHealthFund);
      return response.data?.data || response.data || studentHealthFund;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to add student health fund'));
    }
  }
);

export const updateStudentHealthFund = createAsyncThunk(
  'studentHealthFund/update',
  async (studentHealthFund, { rejectWithValue }) => {
    try {
      const recordId = studentHealthFund?.id ?? studentHealthFund?.Id;
      if (!recordId) {
        throw new Error('Student health fund id is required');
      }

      const response = await axios.put(
        `${API_BASE_URL}/StudentHealthFund/Update/${recordId}`,
        studentHealthFund
      );
      return response.data?.data || response.data || studentHealthFund;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update student health fund'));
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
      return rejectWithValue(getErrorMessage(error, 'Failed to delete student health fund'));
    }
  }
);

export const fetchReportedDates = createAsyncThunk(
  'studentHealthFund/fetchReportedDates',
  async (studentHealthFundId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/${studentHealthFundId}/reported-dates`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch reported dates'));
    }
  }
);

export const fetchUnreportedDates = createAsyncThunk(
  'studentHealthFund/fetchUnreportedDates',
  async (studentHealthFundId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/StudentHealthFund/${studentHealthFundId}/unreported-dates`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch unreported dates'));
    }
  }
);

export const reportUnreportedDate = createAsyncThunk(
  'studentHealthFund/reportUnreportedDate',
  async ({ studentHealthFundId, date }, { rejectWithValue }) => {
    try {
      const normalizedDate = typeof date === 'string'
        ? date.split('T')[0]
        : new Date(date).toISOString().split('T')[0];

      await axios.post(
        `${API_BASE_URL}/StudentHealthFund/${studentHealthFundId}/ReportUnreportedDate`,
        JSON.stringify(normalizedDate),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return { studentHealthFundId, date: normalizedDate };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to report date'));
    }
  }
);

export const uploadStudentHealthFundFile = createAsyncThunk(
  'studentHealthFund/uploadFile',
  async ({ file, studentHealthFundId, fileType }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${API_BASE_URL}/StudentHealthFund/UploadFile?studentHealthFundId=${studentHealthFundId}&fileType=${encodeURIComponent(fileType)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to upload file'));
    }
  }
);

export const validateAndFixUnreportedTreatments = createAsyncThunk(
  'studentHealthFund/validateAndFixUnreportedTreatments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/StudentHealthFund/ValidateAndFixUnreportedTreatments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to validate billing treatments'));
    }
  }
);
