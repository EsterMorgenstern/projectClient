import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../config/api";

export const deleteGroup = createAsyncThunk(
    'groups/deleteGroup', 
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/Group/Delete?groupId=${groupId}`);
            
            return { groupId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete group');
        }
    }
);
