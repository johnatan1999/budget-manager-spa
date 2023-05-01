import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transaction.slice';
import categoryReducer from './slices/category.slice';

export default configureStore({
  reducer: {
    transaction: transactionReducer,
    category: categoryReducer
  },
})