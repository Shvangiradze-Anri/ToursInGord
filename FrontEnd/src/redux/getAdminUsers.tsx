import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAdmin } from "../api/axios";

interface UserImage {
  url: string; // Add other properties as needed
}
interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string; // Consider excluding this from state if not needed
  image: UserImage; // More specific type for image
  gender: string;
  birthday: string;
  role: string;
  __v: number;
}

interface UserState {
  adminUsers: User[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  adminUsers: null,
  loading: false,
  error: null,
};
// let cachedUsers: User[] | null = null;

export const fetchUsersAdmin = createAsyncThunk(
  "user/fetchAllUsers",
  async () => {
    try {
      // Check if we have cached data
      // if (cachedUsers) {
      //   console.log("Returning cached user data");
      //   return cachedUsers; // Return the cached user data if it exists
      // }

      // If no cached data, fetch from server
      const response = await axiosAdmin.get("/adminusers");

      // cachedUsers = response.data;
      return response.data; // Return user data from the server
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error for proper handling in rejected case
    }
  }
);
const adminUserSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminUsers = action.payload; // Store user data in state
      })
      .addCase(fetchUsersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Handle error
      });
  },
});

// Export the action creator and slice reducer
export default adminUserSlice.reducer;
