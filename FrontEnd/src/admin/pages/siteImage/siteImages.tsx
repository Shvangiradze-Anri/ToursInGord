import { Fragment, Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { RootState } from "../../../redux/redux";

// Dynamically import Helmet
const Helmet = lazy(() =>
  import("react-helmet-async").then((module) => ({ default: module.Helmet }))
);

function SiteImages() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Helmet>
          <title>Site Images</title>
          <meta name="description" content="Site images data" />
          <link rel="canonical" href="/ImagesData" />
        </Helmet>
      </Suspense>
      <section>
        {user &&
        user[0].role === "admin" &&
        location.pathname.startsWith("/admin") ? (
          <div className="flex flex-col min-h-[100dvh] bg-sky-600 dark:bg-purple-950">
            <div className="grid place-items-center h-fit p-4 min-800:p-6">
              <div className="grid grid-flow-col text-center w-[92%] min-300:w-3/4 text-res-md gap-4 p-4 bg-sky-400 dark:bg-purple-600 rounded-lg">
                <Link to="/admin/ImagesData/Tour">tour</Link>
                <Link to="Gallery">gallery</Link>
                <Link to="Hotel">hotel</Link>
              </div>
            </div>
            <div className="p-2 min-400:p-4 min-600:p-6 min-1000:p-8">
              <Outlet />
            </div>
          </div>
        ) : null}
      </section>
    </Fragment>
  );
}

export default SiteImages;
