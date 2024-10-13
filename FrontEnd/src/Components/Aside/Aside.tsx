import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Toast from "../Toast";
import { Link, useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../../redux/theme";
import { RootState } from "../../redux/redux";

function Aside() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const [scrollUp, setScrollUp] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrollUp(true);
      } else {
        setScrollUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollUP = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollUpAnim = {
    start: { scale: 0 },
    end: { scale: 1, transition: { duration: 0.3 } },
    exit: { scale: 0 },
  };

  const element = document.documentElement;

  useEffect(() => {
    switch (darkMode) {
      case true:
        element.classList.add("dark");
        break;
      default:
        element.classList.remove("dark");
        break;
    }
  }, [darkMode, element]);

  const location = useLocation();
  return (
    <aside className=" flex flex-col  items-center fixed z-30 gap-y-4 bottom-[100px] right-6 min-600:gap-y-6 min-600:right-[0.875rem] min-600:bottom-[124px] ">
      <Toast />
      <AnimatePresence>
        {scrollUp && !location.pathname.startsWith("/admin") ? (
          <Link to="/#">
            <motion.div
              className="p-[0.3125rem] min-400:p-[0.375rem] min-600::p-2 bg-[#00e1ff77] dark:bg-[#461f55dd]  w-fit rounded-full cursor-pointer min-1000:hover:shadow-aside-shadow min-1000:dark:hover:shadow-[#461f55dd] min-1000:transition-shadow min-1000:duration-300"
              variants={scrollUpAnim}
              initial="start"
              animate="end"
              exit="exit"
            >
              <svg
                onClick={scrollUP}
                className="w-8 h-8  min-1000:w-11 min-1000:h-11"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 15L11.5 7.5L19 15"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </Link>
        ) : null}
      </AnimatePresence>
      {location.pathname.startsWith("/admin") && (
        <Link to="/">
          <svg
            viewBox="0 0 21 18"
            fill="none"
            className="p-[0.3125rem] w-11 h-11 min-400:p-[0.375rem] min-600::p-2 bg-[#00e1ffe2] dark:bg-[#461f55dd]  rounded-full cursor-pointer 
            min-1000:w-14  min-1000:h-14  min-1000:hover:shadow-aside-shadow min-1000:dark:hover:shadow-[#461f55dd] min-1000:transition-shadow min-1000:duration-300 "
          >
            <path
              d="M20.4465 15.9936H18.3168L18.286 15.9394L19.308 15.1448C19.3697 15.0905 19.494 14.8711 19.4323 14.8169C19.3705 14.7626 18.9968 14.8584 18.9351 14.9127L18.1893 15.4592L12.0391 3.03906L12.792 1.12807C12.8229 1.07378 12.5503 0.0944495 12.4886 0.0401623C12.4268 0.0130186 11.3883 0.496831 11.3266 0.551118L10.3539 1.53906L9.73707 0.603232C9.70621 0.548945 9.0111 0.266659 8.91851 0.293802C8.85678 0.320946 8.57144 0.907589 8.6023 0.98902L9.03906 3.03906L4.53906 11.0391C4.5082 11.0933 4.97733 11.4848 5.03906 11.5391C5.06993 11.5391 5.51096 11.9747 5.51096 11.9747C5.57269 11.9747 6.26833 12.029 6.26833 11.9747L10.6008 3.88549L16.3493 15.9936H14.071C14.1018 15.9665 14.8782 16.0826 14.8474 16.0283L11.2044 10.0836C11.2044 10.0836 10.8168 10.0836 10.786 10.0836C10.786 10.0836 10.7152 10.0836 10.6843 10.0836H10.6185C10.6185 10.0836 10.5699 10.0836 10.5391 10.0836L10.4773 10.0736C10.4773 10.0736 10.0391 10.0119 10.0391 10.0391C10.0082 10.0662 9.56993 10.5119 9.53906 10.5391L6.5 16C6.46914 16.0543 5.06402 15.9394 5.12575 15.9665L3.70112 15.9394L5.03906 14.0391C5.06993 13.9848 4.60079 13.5933 4.53906 13.5391C4.47733 13.5119 3.10079 13.4848 3.03906 13.5391L2.53906 15.0391L2.03906 14.5391C1.97733 14.4848 1.60079 14.4848 1.53906 14.5391C1.47733 14.5933 0.977334 14.9848 1.03906 15.0391L2.88474 15.9122L2.85388 15.9394H0.693383C0.600791 15.9394 0.539062 15.9936 0.539062 16.0751C0.539062 16.1565 0.600791 16.9581 0.693383 16.9581L2.64743 16.898C2.5 18.0391 3.5 17.5391 3.5 17.5391C3.53086 17.5391 3.30399 16.9252 3.30399 16.898L18 17C18.0309 17 18.5 17.0391 18.5 17.0391C19.2379 17.0391 19 17.0391 19 17.0391H20.5C20.5926 17.0391 20.5391 16.1565 20.5391 16.0751C20.5391 15.9936 20.5391 15.9936 20.4465 15.9936ZM13.8724 15.9936H11V10.7006L13.8724 15.9936C13.8724 15.9665 13.8415 15.9665 13.8724 15.9936ZM7.66139 15.9665L10.4773 10.7006L10.3086 15.9936L7.66139 15.9665C7.63052 15.9665 7.63052 15.9665 7.66139 15.9665Z"
              fill="#FF9900"
            />
            <path
              d="M4.07784 13.3111C4.13957 13.3111 5.40019 13.5 5.50003 13.5L6.00003 12.5C6.03089 12.4457 4.87543 12.1185 4.81371 12.0642C4.75198 12.0371 4.57781 11.5 4.07784 11.5L3.5 13C4 13.5 3.98525 13.284 4.07784 13.3111Z"
              fill="#FF9900"
            />
          </svg>
        </Link>
      )}
      <div
        onClick={handleToggleDarkMode}
        className="flex p-3 bg-[#00e1ff77] dark:bg-[#461f55dd] cursor-pointer relative items-center rounded-full min-600:gap-4 min-1000:rounded-2xl min-1000:hover:shadow-aside-shadow min-1000:dark:hover:shadow-[#461f55dd] min-1000:cursor-pointer min-1000:transition-shadow min-1000:duration-300"
      >
        <svg
          className={`[display:none] min-600:grid absolute w-9 h-9 left-[0.1875rem] transition-all duration-500  ${
            darkMode && "left-[2.4rem] rotate-180"
          }`}
          viewBox="0 0 35 35"
          fill="none"
        >
          <circle
            cx="17.6465"
            cy="17.145"
            r="12"
            transform="rotate(-135 17.6465 17.145)"
            fill={darkMode ? "darkblue" : "orange"}
          />
          <path
            d="M24.6476 10.1438C28.5111 14.0073 28.5086 20.2739 24.642 24.1405"
            stroke={darkMode ? "orange" : "darkblue"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className={`grid ${darkMode && "[display:none] min-600:grid "}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="orange"
        >
          <path
            d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z"
            stroke="orange"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.14 19.14L19.01 19.01M19.01 4.99L19.14 4.86L19.01 4.99ZM4.86 19.14L4.99 19.01L4.86 19.14ZM12 2.08V2V2.08ZM12 22V21.92V22ZM2.08 12H2H2.08ZM22 12H21.92H22ZM4.99 4.99L4.86 4.86L4.99 4.99Z"
            stroke="orange"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className={`grid ${!darkMode && "[display:none] min-600:grid "}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="darkblue"
        >
          <path
            d="M2.02804 12.4222C2.39976 17.5709 6.912 21.7598 12.3122 21.9897C16.1223 22.1497 19.5297 20.4301 21.5742 17.7208C22.4209 16.6111 21.9665 15.8713 20.552 16.1212C19.8601 16.2412 19.1477 16.2912 18.4043 16.2612C13.3551 16.0612 9.2249 11.9723 9.20425 7.14353C9.19393 5.84386 9.47271 4.61417 9.97866 3.49446C10.5362 2.25478 9.86508 1.66493 8.5744 2.19479C4.48551 3.86437 1.6873 7.85334 2.02804 12.4222Z"
            stroke="darkblue"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </aside>
  );
}

export default Aside;
