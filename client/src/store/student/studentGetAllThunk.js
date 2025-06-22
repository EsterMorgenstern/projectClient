import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

export const fetchStudents = createAsyncThunk(
    'students/fetchStudents',
    async ({ page = 1, pageSize = 10, searchTerm = '' } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await axios.get(`${API_BASE_URL}/Student/GetAll?${params}`);

            return {
                students: response.data.students || response.data,
                totalCount: response.data.totalCount || response.data.length,
                currentPage: page,
                pageSize: pageSize,
                totalPages: Math.ceil((response.data.totalCount || response.data.length) / pageSize)
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);

// Thunk for searching students with debouncing
export const searchStudents = createAsyncThunk(
    'students/searchStudents',
    async ({ searchTerm, page = 1, pageSize = 10 }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
                search: searchTerm
            });

            const response = await axios.get(`${API_BASE_URL}/Student/Search?${params}`);

            return {
                students: response.data.students || response.data,
                totalCount: response.data.totalCount || response.data.length,
                currentPage: page,
                pageSize: pageSize,
                totalPages: Math.ceil((response.data.totalCount || response.data.length) / pageSize),
                searchTerm
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'An error occurred');
        }
    }
);
