import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import wordReducer from "../slices/wordSlice";
import userReducer from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    word: wordReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
