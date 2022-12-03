import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";
import { TabObject } from "../../global/types";

export interface WordSearchResults {
  wordID: string;
  word: String;
  tabs: TabObject[];
  created: boolean;
}

const initialState: {
  results: WordSearchResults;
  changeFlag: boolean;
  currentTabIndex: number;
  status: "idle" | "loading" | "failed";
} = {
  results: { wordID: "", word: "", tabs: [], created: false },
  changeFlag: false,
  currentTabIndex: 0,
  status: "idle",
};

export const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    userOnTab: (
      state,
      action: PayloadAction<{
        index: number;
      }>
    ) => {
      state.currentTabIndex = action.payload.index;
    },
    triggerChangeFlag: (state) => {
      state.changeFlag = !state.changeFlag;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWord.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWord.fulfilled, (state, action) => {
        state.status = "idle";

        if (action.payload?.data.word) {
          state.results = {
            wordID: action.payload.data._id,
            word: action.payload.data.word,
            tabs: action.payload.data.tabs,
            created: true,
          };
        } else
          state.results = {
            wordID: "",
            word: action.payload?.word || "",
            tabs: [],
            created: false,
          };
      })
      .addCase(fetchWord.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchWord = createAsyncThunk(
  "word/fetchWord",
  async (word: String) => {
    if (word.length > 2) {
      return axios.get("/api/word/" + word).then((res) => {
        return { data: res.data, word: word };
      });
    }
  }
);

export const { userOnTab, triggerChangeFlag } = wordSlice.actions;

export const selectWordResults = (state: RootState) => state.word.results;
export const selectCurrentTab = (state: RootState) =>
  state.word.results.tabs[state.word.currentTabIndex];
export const selectChangeFlag = (state: RootState) => state.word.changeFlag;

export default wordSlice.reducer;
