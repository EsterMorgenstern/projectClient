import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';                      

export const addUser = createAsyncThunk(
    'user/addUser',
    async (user, { rejectWithValue }) => {
        try {

            console.log("user:   ",user)
            const response = await axios.post(`http://localhost:5248/api/User/Add`, user);
            console.log("response    ",response)


            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add course');
        }
    }                                                                                                                                                                                                           
);
