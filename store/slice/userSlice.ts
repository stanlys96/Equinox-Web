import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Rating {
  rate: number;
  count: number;
}

export interface StoreData {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

interface UserState {
  currentPagination: number;
  currentOffset: number;
  storeData: StoreData[];
}

const initialState: UserState = {
  currentPagination: 10,
  currentOffset: 0,
  storeData: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePagination: (state, action: PayloadAction<number>) => {
      state.currentPagination = action.payload;
    },
    updateOffset: (state, action: PayloadAction<number>) => {
      state.currentOffset = action.payload;
    },
    updateStoreData: (state, action: PayloadAction<StoreData[]>) => {
      state.storeData = action.payload;
    },
    addStoreData: (state, action: PayloadAction<StoreData>) => {
      state.storeData = [...state.storeData, action.payload];
    },
    updateSingleStoreData: (state, action) => {
      const index = state.storeData.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.storeData[index] = { ...state.storeData[index], ...action.payload };
      }
    },
    deleteSingleStoreData: (state, action) => {
      state.storeData = state.storeData.filter((data) => data?.id?.toString() !== action.payload);
    }
  },
});

export const {
  updatePagination,
  updateOffset,
  updateStoreData,
  addStoreData,
  updateSingleStoreData,
  deleteSingleStoreData
} = userSlice.actions;
export default userSlice.reducer;