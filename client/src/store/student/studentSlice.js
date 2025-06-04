import { createSlice } from '@reduxjs/toolkit';
import { fetchStudents, searchStudents } from './studentGetAllThunk';
import { addStudent } from './studentAddThunk';
import { deleteStudent } from './studentDeleteThunk';
import { editStudent } from './studentEditThunk';
import { getStudentById } from './studentGetByIdThunk';
import { getStudentsByGroupId } from './studentGetByGroup';

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    loading: false,
    error: null,
    studentById: [],
    studentsByGroup: [],
    // Pagination state
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    // Search state
    searchTerm: '',
    isSearching: false
  },
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.isSearching = false;
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.totalCount = 0;
      state.totalPages = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchStudents with pagination
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // searchStudents
      .addCase(searchStudents.pending, (state) => {
        state.loading = true;
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.isSearching = false;
        state.students = action.payload.students;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.pageSize = action.payload.pageSize;
        state.totalPages = action.payload.totalPages;
        state.searchTerm = action.payload.searchTerm;
      })
      .addCase(searchStudents.rejected, (state, action) => {
        state.loading = false;
        state.isSearching = false;
        state.error = action.payload;
      })

      // addStudent
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        // Instead of pushing, refresh the current page
        state.totalCount += 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // editStudent
      .addCase(editStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(editStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStudents = state.students.map((student) =>
          student.id === action.payload.id ? action.payload : student
        );
        state.students = updatedStudents;
      })
      .addCase(editStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteStudent
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter((student) => student.id !== action.payload.id);
        state.totalCount -= 1;
        state.totalPages = Math.ceil(state.totalCount / state.pageSize);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Other cases remain the same...
      .addCase(getStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.studentById = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getStudentsByGroupId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStudentsByGroupId.fulfilled, (state, action) => {
        state.loading = false;
        state.studentsByGroup = action.payload;
      })
      .addCase(getStudentsByGroupId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPageSize, setCurrentPage, clearSearch, resetPagination } = studentsSlice.actions;
export default studentsSlice.reducer;
