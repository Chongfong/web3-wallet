import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from './assetsSlice';

const store = configureStore({
  reducer: {
    assetsData: assetsReducer,
  },
});

export default store;
