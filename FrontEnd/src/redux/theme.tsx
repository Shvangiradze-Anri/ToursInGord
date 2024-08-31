import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: localStorage.getItem("darkMode") === "true", // Load from local storage
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString()); // Save to local storage
    },
  },
});
export const { toggleDarkMode } = themeSlice.actions;

export default themeSlice.reducer;
