import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';
import quizReducer from './quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    quiz: quizReducer,
  },
});

