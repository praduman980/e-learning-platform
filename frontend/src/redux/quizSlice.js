import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

const initialState = {
  currentQuiz: null,
  quizResult: null,
  loading: false,
  error: null,
};

export const fetchQuiz = createAsyncThunk(
  'quiz/fetch',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/courses/${courseId}/quiz`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch quiz'
      );
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async ({ quizId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/quiz/${quizId}/submit`, { answers });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit quiz'
      );
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearQuiz: (state) => {
      state.currentQuiz = null;
      state.quizResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.quizResult = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;

