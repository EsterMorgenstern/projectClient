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

const sanitizeCommitmentPayload = (commitment, includeId = false) => {
  const payload = {
    studentHealthFundId: Number(commitment?.studentHealthFundId ?? commitment?.StudentHealthFundId ?? 0),
    commitmentNumber: commitment?.commitmentNumber ?? commitment?.CommitmentNumber ?? '',
    commitmentTreatments:
      commitment?.commitmentTreatments === '' || commitment?.commitmentTreatments == null
        ? null
        : Number(commitment?.commitmentTreatments ?? commitment?.CommitmentTreatments),
    usedTreatments: Number(commitment?.usedTreatments ?? commitment?.UsedTreatments ?? 0),
    startDate: commitment?.startDate ?? commitment?.StartDate ?? null,
    endDate: commitment?.endDate ?? commitment?.EndDate ?? null,
    filePath: commitment?.filePath ?? commitment?.FilePath ?? '',
    notes: commitment?.notes ?? commitment?.Notes ?? '',
    isActive: commitment?.isActive ?? commitment?.IsActive ?? true,
    createdAt: commitment?.createdAt ?? commitment?.CreatedAt ?? null,
  };

  if (includeId) {
    const commitmentId = Number(
      commitment?.id ?? commitment?.Id ?? commitment?.commitmentId ?? commitment?.CommitmentId ?? 0
    );
    payload.id = commitmentId;
  }

  return payload;
};

export const fetchCommitmentsByStudentHealthFund = createAsyncThunk(
  'healthFundCommitment/fetchByStudentHealthFund',
  async (studentHealthFundId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/HealthFundCommitment/ByStudentHealthFund/${studentHealthFundId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch commitments'));
    }
  }
);

export const fetchHealthFundCommitmentById = createAsyncThunk(
  'healthFundCommitment/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/HealthFundCommitment/GetById/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch commitment'));
    }
  }
);

export const addHealthFundCommitment = createAsyncThunk(
  'healthFundCommitment/add',
  async (commitment, { rejectWithValue }) => {
    try {
      const payload = sanitizeCommitmentPayload(commitment, false);
      const response = await axios.post(`${API_BASE_URL}/HealthFundCommitment/Add`, payload);
      return response.data?.data || response.data || payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to add commitment'));
    }
  }
);

export const updateHealthFundCommitment = createAsyncThunk(
  'healthFundCommitment/update',
  async (commitment, { rejectWithValue }) => {
    try {
      const commitmentId = Number(
        commitment?.id ?? commitment?.Id ?? commitment?.commitmentId ?? commitment?.CommitmentId ?? 0
      );
      if (!commitmentId) {
        throw new Error('Commitment id is required');
      }

      const payload = sanitizeCommitmentPayload(commitment, true);
      const response = await axios.put(
        `${API_BASE_URL}/HealthFundCommitment/Update/${commitmentId}`,
        payload
      );
      return response.data?.data || response.data || payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update commitment'));
    }
  }
);

export const deleteHealthFundCommitment = createAsyncThunk(
  'healthFundCommitment/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/HealthFundCommitment/Delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete commitment'));
    }
  }
);
