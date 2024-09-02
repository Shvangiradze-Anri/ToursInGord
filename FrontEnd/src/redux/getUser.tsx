import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { axiosAdmin } from "../api/axios";
import { toast } from "react-toastify";

// Define the type for the user data
interface User {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  image: string;
  birthday: string;
  gender: string;
  role: string;
}

// Define the initial state type
interface UserState {
  loading: boolean;
  users: User[] ;
  error: string;
}

const initialState: UserState = {
  loading: false,
  users: [], // Initialize users as an empty array
  error: "",
};
export let cachedUser: User | null = null;
// Define the async thunk to fetch users
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    console.log("fetch user");

    if (cachedUser !== null) {
      return cachedUser;
    } else {
      const token = Cookies.get("accessT");

      if (!token) {
        throw new Error("Token not found in cookie");
      }
      const decodedToken: JwtPayload & User = jwtDecode(token);
      cachedUser = decodedToken;
      return decodedToken;
    }
  } catch (error) {
    console.log(error);
  }
});

export const updateUserImage = createAsyncThunk(
  "user/updateUserImage",
  async (
    {
      email,
      userImage,
    }: { email: string; userImage: string | ArrayBuffer | null },
    { dispatch }
  ) => {
    console.log("update user image");
    try {
      const accessT = Cookies.get("accessT") as string;
      const csrfToken = Cookies.get("csrfT");
      // Assuming userImage is a base64 encoded string

      const response = await axiosAdmin.put(
        `/users/update/image/${email}`,
        { userImage },
        {
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
            Authorization: `Bearer ${accessT}`, // Assuming you store the token in localStorage
          },
        }
      );

      if (response.status !== 404 && response.data.length > 0) {
        console.log("dalogda");
        cachedUser = null;
        toast.success(`${response.status}`);
        // Dispatch fetchUser action separately
        dispatch(fetchUser());
      }
    } catch (error) {
      console.log(error);
      throw error; // Ensure to re-throw the error to be handled in the rejected case
    }
  }
);

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;

        state.users = [action.payload as User];

        state.error = "";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.error = action.error.message || "An error occurred";
      });
  },
});

// Export the async thunk and the slice reducer
export default userSlice.reducer;
