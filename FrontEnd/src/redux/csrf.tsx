import { createSlice } from "@reduxjs/toolkit";

let token: any = null;

const csrfSlice = createSlice({
  name: "csrfToken",
  initialState: {
    csrfToken: null,
  },
  reducers: {
    csrfTokenReducer: (state, action) => {
      if (token !== null || undefined) {
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
