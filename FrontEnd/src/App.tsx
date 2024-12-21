import Home from "./Pages/Main/Home";
import { Fragment, useCallback, useEffect, useRef } from "react";

import { axiosAdmin, axiosUser } from "./api/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/redux";
import { fetchUser } from "./redux/getUser";
import { Helmet } from "react-helmet-async";
import TopLoadingBar from "react-top-loading-bar";

const App = () => {
  const loadingBarRef = useRef<React.ElementRef<typeof TopLoadingBar> | null>(
    null
  );

  const { user, error } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const refreshPromiseRef = useRef<Promise<any> | null>(null);

  const refreshToken = useCallback(async () => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = axiosUser
        .post("/refresh")
        .then((res) => {
          localStorage.setItem("expDate", res.data.expDate);
          return res.data;
        })
        .catch((err) => {
          console.error("Error refreshing token", err);
          throw err;
        })
        .finally(() => {
          refreshPromiseRef.current = null; // Reset after request completes
        });
    }
    return refreshPromiseRef.current;
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const expDate = localStorage.getItem("expDate");
      const isExpDateValid = expDate && !isNaN(Number(expDate));

      try {
        if (!user && isExpDateValid) {
          const expirationTime = Number(expDate);
          if (expirationTime > Date.now()) {
            await dispatch(fetchUser());
          } else {
            console.log("Token has expired.");
            await refreshToken();
            await dispatch(fetchUser());
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchInitialData();
  }, [dispatch, user, refreshToken]);

  axiosAdmin.interceptors.request.use(
    async (config) => {
      const expDate = Number(localStorage.getItem("expDate"));
      const currentTime = Date.now();
      loadingBarRef.current?.continuousStart();

      if (expDate && !isNaN(expDate) && expDate <= currentTime) {
        console.log("runs");
        await refreshToken();
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosAdmin.interceptors.response.use(
    (response) => {
      loadingBarRef.current?.complete();
      return response;
    },
    (error) => {
      loadingBarRef.current?.complete();
      return Promise.reject(error);
    }
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
        <link rel="canonical" href="https://toursingord.netlify.app" />
      </Helmet>{" "}
      <TopLoadingBar color="#f11946" ref={loadingBarRef} />
      <Home />
    </Fragment>
  );
};

export default App;
