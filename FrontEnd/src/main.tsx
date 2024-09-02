import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import App from "./App";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { ErrorBoundary } from "react-error-boundary";
const Book = lazy(() => import("./Pages/Main/Book/Book"));
const Bucket = lazy(() => import("./Pages/Main/Bucket/Bucket"));
const LogIn = lazy(() => import("./Pages/Main/Authorization/LogIn"));
const Registration = lazy(
  () => import("./Pages/Main/Authorization/Registration")
);
const ChangePassword = lazy(
  () => import("./Pages/Main/Authorization/ForgotPassword/ChangePassword")
);
const GetCode = lazy(
  () => import("./Pages/Main/Authorization/ForgotPassword/GetCode")
);
const NewPassword = lazy(
  () => import("./Pages/Main/Authorization/ForgotPassword/NewPassword")
);
const Admin = lazy(() => import("./admin/Admin"));
const UserData = lazy(() => import("./admin/pages/userData/userData"));
const SiteImages = lazy(() => import("./admin/pages/siteImage/siteImages"));

import { Provider } from "react-redux";
import store from "./redux/redux";
import Main from "./Pages/Main/Main";
import { fetchImages } from "./redux/getImages";
const ErrorFallback = lazy(
  () => import("./Components/ErrorBoundinary/errorBoundinary")
);
const Tour = lazy(() => import("./admin/pages/siteImage/tour"));
const Gallery = lazy(() => import("./admin/pages/siteImage/gallery"));
const Hotel = lazy(() => import("./admin/pages/siteImage/hotel"));
const PageNotFound = lazy(() => import("./Components/PageNotFound"));



const rootContainer = document.getElementById("root") as HTMLElement;

const route = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      loader={() => store.dispatch(fetchImages()).unwrap()}
    >
      <Route index element={<Main />} />
      <Route
        path="BookTour"
        element={
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.replace("/")}
          >
            <Suspense fallback={<div>Loading</div>}>
              <Book />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="Bucket"
        element={
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => window.location.replace("/")}
          >
            <Suspense fallback={<div>Loading</div>}>
              <Bucket />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route path="admin">
        <Route
          index
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.replace("/")}
            >
              <Suspense fallback={<div>Loading</div>}>
                <Admin />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="ImagesData"
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.replace("/")}
            >
              <Suspense fallback={<div>Loading</div>}>
                <SiteImages />
              </Suspense>
            </ErrorBoundary>
          }
        >
          <Route
            path="Tour"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <Tour />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="Gallery"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <Gallery />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="Hotel"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <Hotel />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>

        <Route
          path="UsersData"
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.replace("/")}
            >
              <Suspense fallback={<div>Loading</div>}>
                <UserData />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </Route>
      <Route path="Authorization">
        <Route
          index
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.replace("/")}
            >
              <Suspense fallback={<div>Loading</div>}>
                <LogIn />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="Registration"
          element={
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => window.location.replace("/")}
            >
              <Suspense fallback={<div>Loading</div>}>
                <Registration />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="Change_Password">
          <Route
            index
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <ChangePassword />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="Get_Code"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <GetCode />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="New_Password"
            element={
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => window.location.replace("/")}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <NewPassword />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

if (rootContainer) {
  ReactDOM.createRoot(rootContainer).render(
    <React.StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <RouterProvider router={route} />{" "}
        </Provider>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root container not found.");
}
