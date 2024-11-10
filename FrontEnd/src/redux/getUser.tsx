import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAdmin } from "../api/axios";
import { toast } from "react-toastify";
import { RootState } from "./redux";

interface UserImage {
  url: string;
}

interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  image: UserImage;
  gender: string;
  birthday: string;
  role: string;
  __v: number;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchSingleUser",
  async (_, { getState }) => {
    const state = getState() as RootState;
    console.log("user logged");

    if (state.user.user) {
      return state.user.user;
    }

    try {
      const response = await axiosAdmin.get("/user");
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      window.location.replace("/");
      localStorage.removeItem("expDate");
      clearUserProfile();
    }
  }
);
export const updateUserImage = createAsyncThunk(
  "user/updateUserImage",
  async ({
    email,
    userImage,
  }: {
    email: string;
    userImage: string | ArrayBuffer | null;
  }) => {
    try {
      const response = await axiosAdmin.put(`/users/update/image/${email}`, {
        userImage,
      });

      console.log("Update Image Response:", response);

      if (response.status !== 404 && response.data) {
        toast.success("Image is updated");
        return response.data;
      } else {
        throw new Error("Image update failed or returned no data.");
      }
    } catch (error) {
      console.error("Error updating user image:", error);
      toast.error("Failed to update user image.");
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    try {
      await axiosAdmin.post("/api/user/logout");

      dispatch(clearUserProfile()); // Clears the user data from state
      toast.success("Successfully logged out."); // Notify the user
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed."); // Notify the user
      throw error; // Rethrow the error for proper handling
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(updateUserImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload) {
          console.log(action);
          state.user.image = action.payload.image;
        }
      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
