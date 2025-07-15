import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const addPayment = createAsyncThunk(
    'payments/addPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            console.log('🚀 Adding payment:', paymentData);
            const response = await axios.post(`${API_BASE_URL}/Payments/Add`, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('✅ Payment added:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error adding payment:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
