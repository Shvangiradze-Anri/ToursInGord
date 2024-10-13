import { Fragment, lazy } from "react";
import { Helmet } from "react-helmet-async";

const DisplayedImages = lazy(() => import("./displayedImages"));

function Gallery() {
  return (
    <Fragment>
      {" "}
      <Helmet>
        <title>Site Images</title>
        <meta name="description" content="Site images data" />
        <link rel="canonical" href="/ImagesData/Gallery" />
      </Helmet>
      <section className="bg-sky-500 dark:bg-purple-700 p-4 rounded-xl min-600:p-6">
        <div className="m-auto w-fit border-b-2 border-sky-400 dark:border-purple-500 rounded-l-lg rounded-r-lg">
          <p className="text-center p-2 text-res-base w-max min-600:p-4">
            Gallery Images
          </p>
        </div>
        <DisplayedImages page="gallery" />
      </section>
    </Fragment>
  );
}

export default Gallery;
