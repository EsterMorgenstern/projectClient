
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentSlice';
import instructorsReducer from './instructorSlice';
import coursesReducer from './courseSlice';
import studentCoursesReducer from './studentCourseSlice';  

const store = configureStore({
  reducer: {
    students: studentsReducer,
    instructors: instructorsReducer,
    courses: coursesReducer,
    studentCourses: studentCoursesReducer,  
  },
});

export default store;
