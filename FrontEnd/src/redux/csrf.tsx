import { createSlice, PayloadAction } from "@reduxjs/toolkit";

let token: number | null = null;

interface CsrfState {
  csrfToken: number | null;
}

const initialState: CsrfState = {
  csrfToken: null,
};

const csrfSlice = createSlice({
  name: "csrfToken",
  initialState,
  reducers: {
    csrfTokenReducer: (state, action: PayloadAction<number>) => {
      if (token !== null) {
        state.csrfToken = token;
      } else {
        token = action.payload;
        state.csrfToken = action.payload;
      }
    },
  },
});

export const { csrfTokenReducer } = csrfSlice.actions;
export default csrfSlice.reducer;
