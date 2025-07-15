import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deletePayment = createAsyncThunk(
    'payments/deletePayment',
    async (paymentId, { rejectWithValue }) => {
        try {
            console.log('🚀 Deleting payment:', paymentId);
            await axios.delete(`${API_BASE_URL}/Payments/Delete/${paymentId}`);
            console.log('✅ Payment deleted:', paymentId);
            return paymentId;
        } catch (error) {
            console.error('❌ Error deleting payment:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
