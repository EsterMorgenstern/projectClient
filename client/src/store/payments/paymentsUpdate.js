import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const updatePayment = createAsyncThunk(
    'payments/update',
    async ({ paymentId, ...paymentData }, { rejectWithValue }) => {
        try {
            console.log('🚀 Updating payment:', paymentId, paymentData);
            
            const payload = {
                paymentId: parseInt(paymentId),
                studentId: parseInt(paymentData.studentId),
                amount: parseFloat(paymentData.amount),
                paymentDate: paymentData.paymentDate,
                paymentMethod: paymentData.paymentMethod,
                status: paymentData.status,
                courseName: paymentData.courseName,
                notes: paymentData.notes || '',
                updatedAt: new Date().toISOString(),
                updatedBy: 'system'
            };

            const response = await axios.put(`${API_BASE_URL}/Payments/Update`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            console.log('✅ Payment updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating payment:', error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
