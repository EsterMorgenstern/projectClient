
import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './studentSlice';
import instructorsReducer from './instructorSlice';

const store = configureStore({
  reducer: {
    students: studentsReducer,
    instructors: instructorsReducer,
  },
});

export default store;
