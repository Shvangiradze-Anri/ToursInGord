import { Fragment } from "react";
import Carouserl from "./Carouserl";

function Hotel() {
  return (
    <Fragment>
      <div className="flex flex-col-reverse items-center h-full gap-4 min-900:flex-row min-900:gap-8 min-900:items-start min-900:justify-between">
        <Carouserl />
        <div className="flex flex-col items-center max-w-md  gap-4 text-blue-800 dark:text-[#ffa83d]  px-8 rounded-xl bg-[#f7eaea71] dark:bg-[#08070771]  relative min-500:max-w-sm   min-900:justify-between min-900:h-full">
          <div className="flex flex-col items-center   min-900:items-start">
            <p className=" text-res-lg">Hotel Name</p>
            <span className="text-black dark:text-white  text-res-md-sm indent-2 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
              vitae doloremque quod animi dignissimos at sit voluptatum, autem
              ut voluptate aperiam modi quibusdam commodi excepturi dolores, non
              error! Iure, expedita?
            </span>
          </div>
          <button className="flex justify-center items-center w-32 h-11 mb-[2.0625rem] text-res-md-sm  bg-white dark:bg-black rounded-lg min-900:hover:shadow-white-drop min-900:dark:hover:shadow-black-drop min-900:transition-shadow min-900:duration-500 [&>p]:w-fit min-900:h-14 min-900:w-2/4 ">
            <p>Visit</p>
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default Hotel;
