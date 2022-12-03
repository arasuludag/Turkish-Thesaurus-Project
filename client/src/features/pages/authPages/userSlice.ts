import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";

export interface UserObject {
  name: string;
  username: string;
  isEditor: boolean;
}

const initialState: {
  user: UserObject | "";
  status: "idle" | "loading" | "failed";
} = {
  user: "",
  status: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
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

// export const {} = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
