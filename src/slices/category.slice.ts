import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    data: []
  },
  reducers: {
    setCategories: (state, action) => {
        state.data = action.payload;
    },
    addCategory: (state, action) => {
        state.data.push(action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addCategory, setCategories } = categorySlice.actions;

export const selectCategories = (state) => state.category.data || [];


export default categorySlice.reducer;