import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAdmin } from "../api/axios";
import { toast } from "react-toastify";

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
  user: User[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export let cachedUser: User | null = null;

// Define the async thunk to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const response = await axiosAdmin.get("/user", {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data; // Return user data from the server
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Rethrow the error for proper handling in rejected case
  }
});

// Async thunk for updating the user image
export const updateUserImage = createAsyncThunk(
  "user/updateUserImage",
  async (
    {
      email,
      userImage,
    }: { email: string; userImage: string | ArrayBuffer | null },
    { dispatch }
  ) => {
    try {
      const response = await axiosAdmin.put(`/users/update/image/${email}`, {
        userImage,
      });

      if (response.status !== 404 && response.data.length > 0) {
        cachedUser = null;
        toast.success(`${response.data}`);

        // Fetch the updated user data after the image update
        dispatch(fetchUser());
      }
    } catch (error) {
      console.error("Error updating user image:", error);
      toast.error("Failed to update user image."); // Notify the user
      throw error; // Rethrow the error for proper handling
    }
  }
);

// Async thunk for logging out the user
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    try {
      await axiosAdmin.post("/api/user/logout", {}, { withCredentials: true });
      dispatch(clearUserProfile()); // Clears the user data from state
      toast.success("Successfully logged out."); // Notify the user
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed."); // Notify the user
      throw error; // Rethrow the error for proper handling
    }
  }
);

// Define the clearUserProfile reducer
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile(state) {
      state.user = null; // Reset user profile
      state.loading = false; // Reset loading state
      state.error = null; // Reset error state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data in state
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred"; // Handle error
      });
  },
});

// Export the action creator and slice reducer
export const { clearUserProfile } = userSlice.actions; // Export the action creator
export default userSlice.reducer; // Export the reducer
