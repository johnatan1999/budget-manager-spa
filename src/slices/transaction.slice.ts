import { createSlice } from '@reduxjs/toolkit'
import TransactionService from '../services/transaction/transaction.service';

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    data: [],
  },
  reducers: {
    setTransactions: (state, action) => {
        state.data = action.payload;
    },
    addTransaction: (state, action) => {
        state.data.push(action.payload);
    },
    updateTransaction: (state, action) => {
        const index = state.data.findIndex((transaction) => transaction.id === action.payload.id)  
        state.data[index] = action.payload
    },
    deleteTransaction: (state, action) => {
        state.data = state.data.filter((transaction) => transaction.id !== action.payload.id);
    }
  },
})

// Action creators are generated for each case reducer function
export const { addTransaction, updateTransaction, deleteTransaction, setTransactions } = transactionSlice.actions;

export const selectTransactions = (state) => state.transaction.data || [];


export default transactionSlice.reducer;