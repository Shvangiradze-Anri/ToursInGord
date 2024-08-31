import axios from "axios";

const axiosUser = axios.create({
  baseURL: "http://localhost:5300",
  withCredentials: true,
});

const axiosAdmin = axios.create({
  baseURL: "http://localhost:5300",
  withCredentials: true,
});

export { axiosUser, axiosAdmin };

// https://tour-in-gord.onrender.com

// http://localhost:5173
