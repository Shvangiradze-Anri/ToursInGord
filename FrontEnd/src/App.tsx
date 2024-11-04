import Home from "./Pages/Main/Home";
import { Fragment, lazy, useEffect } from "react";

import { axiosAdmin, axiosUser } from "./api/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/redux";
import { fetchUser } from "./redux/getUser";

// Lazy load Helmet for optimization
const Helmet = lazy(() =>
  import("react-helmet-async").then((module) => ({ default: module.Helmet }))
);

const App = () => {
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchInitialData = async () => {
      const expDate = localStorage.getItem("expDate");
      try {
        if (!user && expDate) {
          await dispatch(fetchUser());
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchInitialData();
  }, [dispatch, user]);

  const refreshToken = async () => {
    try {
      const res = await axiosUser.post("/refresh");
      console.log("refreshtoken res", res);
      localStorage.setItem("expDate", res.data.expDate);
    } catch (err) {
      console.log("Error refreshing token", err);
    }
  };

  axiosAdmin.interceptors.request.use(
    async (config) => {
      const expDate = Number(localStorage.getItem("expDate"));
      const currentTime = Date.now();

      if (expDate && !isNaN(expDate) && expDate < currentTime) {
        await refreshToken();
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  if (loading)
    return (
      <div className="text-center">
        <svg
          className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.24 0-4.267-.905-5.745-2.365l1.541-1.544z"
          ></path>
        </svg>
        <p className="text-lg font-semibold">Preparing your adventure...</p>
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <Fragment>
      <Helmet>
        <title>Tours in Gord</title>
        <meta
          name="description"
          content="Welcome to ToursInGord! Explore Georgia's Zeda Gordi. On this page you can learn about us, learn about our services, and view the photo gallery."
        />
        <link rel="canonical" href="toursingord.netlify.app" />
      </Helmet>
      <Home />
    </Fragment>
  );
};

export default App;
