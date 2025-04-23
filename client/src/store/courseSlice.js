import { createSlice } from '@reduxjs/toolkit';
import { fetchCourses } from './CoursesGetAllThunk';

// export const fetchCourses = createAsyncThunk(
//   'courses/fetchCourses',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('https://localhost:5000/api/Course/GetAll');
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );

// export const addCourse = createAsyncThunk(
//   'courses/addCourse',
//   async (course, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('https://localhost:5000/api/Course/Add', course);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );

// export const updateCourse = createAsyncThunk(
//   'courses/updateCourse',
//   async (course, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`https://localhost:5000/api/Course/Update/${course.id}`, course);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );

// export const deleteCourse = createAsyncThunk(
//   'courses/deleteCourse',
//   async (id, { rejectWithValue }) => {
//     try {
//       await axios.delete(`https://localhost:5000/api/Course/Delete/${id}`);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'An error occurred');
//     }
//   }
// );

 const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    //   .addCase(addCourse.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(addCourse.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.courses.push(action.payload);
    //   })
    //   .addCase(addCourse.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(updateCourse.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(updateCourse.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const index = state.courses.findIndex((course) => course.id === action.payload.id);
    //     if (index !== -1) {
    //       state.courses[index] = action.payload;
    //     }
    //   })
    //   .addCase(updateCourse.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   })
    //   .addCase(deleteCourse.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(deleteCourse.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.courses = state.courses.filter((course) => course.id !== action.payload);
    //   })
    //   .addCase(deleteCourse.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.error.message;
    //   });
  },
});
export default courseSlice.reducer;

  