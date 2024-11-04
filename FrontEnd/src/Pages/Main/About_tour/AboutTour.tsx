import { lazy } from "react";

const Carousel = lazy(() => import("./Carousel"));

function AboutTour() {
  return (
    <div className="flex flex-col   items-center min-900:flex-row min-900:gap-8 min-900:items-start min-900:justify-between">
      <div className="flex flex-col items-center  gap-y-5 text-black dark:text-white  min-900:items-start  min-400:gap-y-12 ">
        <div className="flex flex-col max-w-xs  items-center min-500:max-w-sm  min-900:items-start  ">
          <p className="text-res-lg text-blue-800  dark:text-[#e89c3e] relative top-0">
            About Tour
          </p>
          <span className="mt-2 w-[75%] text-res-md-sm min-400:w-full min-900:max-w-xs min-400:mt-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
            possimus quos assumenda ipsam dolorem iste repellendus, pariatur
            similique voluptates. Perferendis tempore velit aut molestiae illum
            blanditiis voluptate officiis corrupti delectus!
          </span>
        </div>
        <button className="flex justify-center items-center w-32 h-11 mb-[2.0625rem] text-res-md-sm  bg-blue-800 dark:bg-[#e89c3e] rounded-lg min-900:hover:shadow-blue-drop min-900:dark:hover:shadow-orange-drop min-900:transition-shadow min-900:duration-500 [&>p]:w-fit min-900:h-14 min-900:w-2/4 ">
          <p>BOOK</p>
        </button>
      </div>
      <Carousel />
    </div>
  );
}

export default AboutTour;
