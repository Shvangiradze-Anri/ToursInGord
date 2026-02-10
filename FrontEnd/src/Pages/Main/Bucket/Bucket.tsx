import { Fragment } from "react";
import { Helmet } from "react-helmet-async";

function Bucket() {
  return (
    <Fragment>
      <Helmet>
        <title>Bucket</title>
        <meta name="description" content="Your Purchased Tickets" />
        <link rel="canonical" href="/Bucket" />
      </Helmet>
      <section className="pt-[17.25rem] pb-[10rem] min-h-[100vh]  px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black">
        <div className="grid justify-center  gap-5 p-4 min-600:p-12 min-900:p-20 rounded-lg bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
          <p className="text-res-special-galerry-title  dark:text-blue-800 text-[#e89c3e]">
            Tour Ticket
          </p>
          <div
            className="flex flex-col  min-[367px]:flex-row min-[367px]:flex-wrap gap-4    
            [&>div]:rounded-lg  [&>div]:min-w-[9rem] min-1100:flex-nowrap [&>div]:p-3 [&>div]:grid [&>div]:gap-1"
          >
            <div className="bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
              <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
                From
              </p>
              <p className="text-res-sm text-black dark:text-white">
                30/01/2025
              </p>
            </div>
            <div className="bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
              <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
                To
              </p>
              <p className="text-res-sm text-black dark:text-white">
                30/02/2025
              </p>
            </div>
            <div className="bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
              <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
                Price
              </p>
              <p className="text-res-sm text-black dark:text-white">300Gel</p>
            </div>
            <div className="bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
              <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
                Hotel
              </p>
              <p className="text-res-sm text-black dark:text-white">Yes</p>
            </div>
            <div className="bg-[#00e1ff3a] dark:bg-[#00e1ff0f]">
              <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
                Purchased On
              </p>
              <p className="text-res-sm text-black dark:text-white">
                30/01/2024
              </p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Bucket;
