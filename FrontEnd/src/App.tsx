import Home from "./Pages/Main/Home";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, lazy, useEffect, useState } from "react";
import { fetchImages } from "./redux/getImages";
import { fetchUser } from "./redux/getUser"; // Combined imports
import { axiosAdmin, axiosUser } from "./api/axios";
import { AppDispatch, RootState } from "./redux/redux";

// Lazy load Helmet for optimization
const Helmet = lazy(() =>
  import("react-helmet-async").then((module) => ({ default: module.Helmet }))
);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch images
        await dispatch(fetchImages());
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const expDate = localStorage.getItem("expDate");
      try {
        if (!user && expDate && expDate !== undefined) {
          await dispatch(fetchUser());
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data");
      }
    };

    fetchInitialData();
  }, [dispatch, user]);

  const refreshToken = async () => {
    try {
      const res = await axiosUser.post("/refresh", { withCredentials: true });
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
        <link rel="canonical" href="http://localhost:5173/" />
      </Helmet>
      <Home />
    </Fragment>
  );
};

export default App;
