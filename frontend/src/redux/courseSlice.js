import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

const initialState = {
  courses: [],
  currentCourse: null,
  teacherCourses: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async ({ category, level, search, page } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (level && level !== 'all') params.append('level', level);
      if (search) params.append('search', search);
      if (page) params.append('page', page);
      const { data } = await API.get(`/courses?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch courses'
      );
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch course'
      );
    }
  }
);

export const fetchTeacherCourses = createAsyncThunk(
  'courses/fetchTeacherCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/courses/teacher');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch courses'
      );
    }
  }
);

export const enrollCourse = createAsyncThunk(
  'courses/enroll',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await API.post(`/courses/${courseId}/enroll`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to enroll'
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      await API.delete(`/courses/${courseId}`);
      return courseId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete course'
      );
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTeacherCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherCourses = action.payload;
      })
      .addCase(fetchTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.isEnrolled = true;
        }
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.teacherCourses = state.teacherCourses.filter(
          (course) => course._id !== action.payload
        );
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;

