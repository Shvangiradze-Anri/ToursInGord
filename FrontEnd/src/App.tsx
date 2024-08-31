import Home from "./Pages/Main/Home";

import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useCallback, useEffect } from "react";
import { fetchUser } from "./redux/getUser";
import { useLoaderData } from "react-router-dom";
import { axiosAdmin, axiosUser } from "./api/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";



const App = () => {
  const loaderData = useLoaderData();

  const cook=document.cookie
  console.log("Document Cookies: ", cook);

  const dispatchUser = useDispatch<any>();

  console.log("fetchUser",fetchUser);
  

  const dispatchFetchUser = useCallback(() => {
    dispatchUser(fetchUser());
  }, [dispatchUser]);

  useEffect(() => {
    
    const token = Cookies.get("accessT");
    
    if (token) {
      dispatchFetchUser();
    }
  }, [dispatchFetchUser]);

  const refreshToken = async () => {
    try {
      console.log("refreshtoken");

      const refreshT = Cookies.get("refreshT") as string;
      const res = await axiosUser.post("/refresh", {
        refreshToken: refreshT,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  axiosAdmin.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();

      const token = Cookies.get("accessT");

      const decodedToken = jwtDecode(token as string);

      if (
        decodedToken &&
        decodedToken.exp &&
        decodedToken.exp * 1000 < currentDate.getTime()
      ) {
        const data = await refreshToken();
        if (data) {
          const accessT = Cookies.get("accessT") as string;
          config.headers["authorization"] = `Bearer ${accessT}`;
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <Fragment>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="On this page you can learn about us, learn about our services and view the photo gallery."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      {!loaderData && Array.isArray(loaderData) && loaderData.length === 0 ? (
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
      ) : (
        <Home />
      )}
    </Fragment>
  );
};

export default App;
