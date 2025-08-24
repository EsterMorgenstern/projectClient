import { createSlice } from '@reduxjs/toolkit';
import { deleteCourse } from './courseDeleteThunk';
import { addCourse } from './courseAddThunk';
import { updateCourse } from './courseUpdateThunk';
import { fetchCourses } from './CoursesGetAllThunk';

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
//addCourse      
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updateCourse      
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex((course) => course.courseId === action.payload.courseId);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
//deleteCourse    
      .addCase(deleteCourse.pending, (state) => {
        console.log('deleteCourse...');
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.courses = state.courses.filter((course) => course.courseId !== action.payload.courseId);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        console.error('Error deleteCourse:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default courseSlice.reducer;

  