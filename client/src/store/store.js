
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentSlice';
import instructorsReducer from './instructorSlice';
import coursesReducer from './courseSlice';

const store = configureStore({
  reducer: {
    students: studentsReducer,
    instructors: instructorsReducer,
    courses: coursesReducer,
  },
});

export default store;
