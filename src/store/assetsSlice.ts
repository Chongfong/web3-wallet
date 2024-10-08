import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  assets: [],
  balance: null,
  usdPrices: {},
  account: {},
};

const assetsSlice = createSlice({
  name: 'assetsData',
  initialState,
  reducers: {
    setAssets: (state, action) => {
      state.assets = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setUsdPrices: (state, action) => {
      state.usdPrices = action.payload;
    },
    setAccount: (state, action) => {
        state.account = action.payload;
    }
  },
});

export const { setAssets, setBalance, setUsdPrices, setAccount } = assetsSlice.actions;
export default assetsSlice.reducer;
