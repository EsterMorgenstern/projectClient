import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      
import API_BASE_URL from '../../config/api';

export const addUser = createAsyncThunk(
    'user/addUser',
    async (user, { rejectWithValue }) => {
        try {

            console.log("user:   ",user)
            const response = await axios.post(`${API_BASE_URL}/User/Add`, user);
            console.log("response    ",response)


            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add course');
        }
    }                                                                                                                                                                                                           
);
