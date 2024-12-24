import axios from "axios";

const axiosUser = axios.create({
  baseURL: " https://tour-in-gord.onrender.com",
  withCredentials: true,
});

const axiosAdmin = axios.create({
  baseURL: " https://tour-in-gord.onrender.com",
  withCredentials: true,
});

export { axiosUser, axiosAdmin };

// https://tour-in-gord.onrender.com

// http://localhost:5300
