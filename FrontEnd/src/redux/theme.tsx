import { createSlice } from "@reduxjs/toolkit";

interface themeType {
  darkMode: boolean;
}

const initialState:themeType = {
  darkMode: localStorage.getItem("darkMode") === "true", // Load from local storage
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString()); // Save to local storage
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
