import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const deletePaymentMethod = createAsyncThunk(
    'payments/deletePaymentMethod',
    async (paymentMethodId, { rejectWithValue }) => {
        try {
            console.log('🚀 Deleting payment method:', paymentMethodId);
            await axios.delete(`${API_BASE_URL}/PaymentMethods/Delete/${paymentMethodId}`);
            console.log('✅ Payment method deleted:', paymentMethodId);
            return paymentMethodId;
        } catch (error) {
            console.error('❌ Error deleting payment method:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
