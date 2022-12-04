import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../app/store";

export interface UserObject {
  name: string;
  username: string;
  isEditor: boolean;
}

const initialState: {
  user: UserObject | "";
  status: "idle" | "loading" | "failed";
  settings: { isDark: boolean };
} = {
  user: "",
  status: "idle",
  settings: {
    isDark:
      localStorage.getItem("isDark") === null
        ? true
        : localStorage.getItem("isDark") === "true",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.settings = { isDark: action.payload };

      localStorage.setItem("isDark", state.settings.isDark.toString());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "idle";

        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  return axios.get("/api/current_user").then((res) => {
    return res.data;
  });
});

export const { setTheme } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectTheme = (state: RootState) => state.user.settings.isDark;

export default userSlice.reducer;
