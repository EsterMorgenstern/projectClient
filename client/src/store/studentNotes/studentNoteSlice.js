import { createSlice } from '@reduxjs/toolkit';
import { getNotesByStudentId } from './studentNotesGetById';
import { addStudentNote } from './studentNoteAddThunk';
import { deleteStudentNote } from './studentNoteDeleteThunk';
import { updateStudentNote } from './studentNoteUpdateThunk';
import { getNotesByUserId } from './studentNotesGetByUserId';

const studentNotesSlice = createSlice({
  name: 'studentNotes',
  initialState: {
    studentNotes: [],
    notesByUser:[],
    allNotes: [],
    loading: false,
    error: null,
    selectedNote: null,
  },
  reducers: {
    clearNotes: (state) => {
      state.studentNotes = [];
      state.error = null;
    },
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get notes by student ID
      .addCase(getNotesByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotesByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.studentNotes = action.payload;
      })
      .addCase(getNotesByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student notes';
      })

       // Get notes by user ID
      .addCase(getNotesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.notesByUser = action.payload;
      })
      .addCase(getNotesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student notes';
      })
      
      // Add student note
      .addCase(addStudentNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudentNote.fulfilled, (state, action) => {
        state.loading = false;
        state.studentNotes.push(action.payload);
      })
      .addCase(addStudentNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add student note';
      })
      
      // Update student note
      .addCase(updateStudentNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.studentNotes.findIndex(note => note.noteId === action.payload.noteId);
        if (index !== -1) {
          state.studentNotes[index] = action.payload;
        }
      })
      .addCase(updateStudentNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update student note';
      })
      
      // Delete student note
      .addCase(deleteStudentNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudentNote.fulfilled, (state, action) => {
        state.loading = false;
        state.studentNotes = state.studentNotes.filter(note => note.noteId !== action.payload);
      })
      .addCase(deleteStudentNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete student note';
      });
  },
});

export const { clearNotes, setSelectedNote, clearError } = studentNotesSlice.actions;
export default studentNotesSlice.reducer;
