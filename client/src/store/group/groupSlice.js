import { createSlice } from '@reduxjs/toolkit';
import { fetchGroups } from './groupGellAllThunk';
import { addGroup } from './groupAddThunk';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
// getAllGroups
      .addCase(fetchGroups.pending, (state) => {
        console.log('Fetching groups...');
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        console.error('Error fetching groups:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      
// addGroup
      .addCase(addGroup.pending, (state) => {
        console.log('Adding group...');
        state.loading = true;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.groups.push(action.payload); // Add the new branch to the state
      })
      .addCase(addGroup.rejected, (state, action) => {
        console.error('Error adding group:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default groupSlice.reducer;
