import { createSlice } from '@reduxjs/toolkit';
import { cancelLesson } from './cancelLesson';
import { cancelAllGroupsForDay } from './cancelAllGroupsForDay';
import { getCanceledLessons } from './getCanceledLessons';
import { getCanceledLessonsByDate } from './getCanceledLessonsByDate';
import { undoCancelLesson } from './undoCancelLesson';
import { createCompletionLesson } from './createCompletionLesson';
import { markLessonAsCompletion } from './markLessonAsCompletion';
import { getCompletionLessons } from './getCompletionLessons';
import { getCompletionLessonsByGroupId } from './getCompletionLessonsByGroupId';
import { getLessonsByGroupId } from './getLessonsByGroupId';
import { getLessonsByDate } from './getLessonsByDate';
import { fetchLessonsByDate } from './lessonsByDateThunk';
import { deleteLesson } from './deleteLesson';

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    canceledLessons: [],
    completionLessons: [],
    canceledByDate: {},
    completionByGroup: {},
    lessonsByGroup: {},
    lessonsByDate: {},
    loading: false,
    error: null,
    lastAction: null
  },
  reducers: {
    clearLessonsError: (state) => {
      state.error = null;
    },
    clearLessonsLastAction: (state) => {
      state.lastAction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCanceledLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCanceledLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.canceledLessons = action.payload || [];
      })
      .addCase(getCanceledLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCanceledLessonsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCanceledLessonsByDate.fulfilled, (state, action) => {
        state.loading = false;
        const { date, lessons } = action.payload;
        state.canceledByDate[date] = lessons || [];
        state.canceledLessons = lessons || [];
      })
      .addCase(getCanceledLessonsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'cancelLesson', payload: action.payload };
      })
      .addCase(cancelLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelAllGroupsForDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAllGroupsForDay.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'cancelAllGroupsForDay', payload: action.payload };
      })
      .addCase(cancelAllGroupsForDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(undoCancelLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(undoCancelLesson.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload || {};
        if (id) {
          state.canceledLessons = state.canceledLessons.filter(l => (l.lessonId || l.id) !== id);
        }
        state.lastAction = { type: 'undoCancelLesson', payload: action.payload };
      })
      .addCase(undoCancelLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCompletionLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompletionLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.completionLessons = action.payload || [];
      })
      .addCase(getCompletionLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCompletionLessonsByGroupId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompletionLessonsByGroupId.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, lessons } = action.payload;
        state.completionByGroup[groupId] = lessons || [];
        state.completionLessons = lessons || [];
      })
      .addCase(getCompletionLessonsByGroupId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLessonsByGroupId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonsByGroupId.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, lessons } = action.payload;
        state.lessonsByGroup[groupId] = lessons || [];
      })
      .addCase(getLessonsByGroupId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLessonsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLessonsByDate.fulfilled, (state, action) => {
        state.loading = false;
        const { date, lessons } = action.payload;
        state.lessonsByDate[date] = lessons || [];
      })
      .addCase(getLessonsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createCompletionLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompletionLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'createCompletionLesson', payload: action.payload };
      })
      .addCase(createCompletionLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markLessonAsCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markLessonAsCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAction = { type: 'markLessonAsCompletion', payload: action.payload };
      })
      .addCase(markLessonAsCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload || {};
        if (id) {
          state.completionLessons = state.completionLessons.filter(l => (l.lessonId || l.id) !== id);
        }
        state.lastAction = { type: 'deleteLesson', payload: action.payload };
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLessonsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByDate.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.date && Array.isArray(action.payload.lessons)) {
          state.lessonsByDate[action.payload.date] = action.payload.lessons;
        }
      })
      .addCase(fetchLessonsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearLessonsError, clearLessonsLastAction } = lessonsSlice.actions;

export default lessonsSlice.reducer;
