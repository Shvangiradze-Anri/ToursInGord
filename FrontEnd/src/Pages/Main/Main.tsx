import AboutTour from "./About_tour/AboutTour";
import Galerry from "./Gallery/Galerry";
import Hotel from "./Hotel/Hotel";
import Contact from "./Contact/Contact";
import Cookies from "js-cookie";

import { Link } from "react-router-dom";
import { Fragment, useEffect, useMemo, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateRefs } from "../../redux/componentRef";
import { cachedUser } from "../../redux/getUser";

const ok = () => {
  console.log("cachedUser",cachedUser);

  const allCookies = Cookies.get();

  console.log("All cookies:", allCookies);
  const token = Cookies.get("accessToken");
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", token); // Added logging for debugging
}

const Main = () => {
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const dispatch = useDispatch<any>();

  const aboutTourRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const hotelRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getOffset = async () => {
      if (
        aboutTourRef.current &&
        galleryRef.current &&
        hotelRef.current &&
        contactRef.current
      ) {
        const offsetTopAbout = aboutTourRef.current.offsetTop;
        const offsetTopGallery = galleryRef.current.offsetTop - 200;
        const offsetTopHotel = hotelRef.current.offsetTop;
        const offsetTopContact = contactRef.current.offsetTop;

        dispatch(
          updateRefs({
            aboutRef: offsetTopAbout,
            galleryRef: offsetTopGallery,
            hotelRef: offsetTopHotel,
            contactRef: offsetTopContact,
          })
        );
      }
    };
    getOffset();
  }, [dispatch]);

  type Image = {
    id: number;
    image: {
      secure_url: string;
    };
    page: string;
  };

  type ImagesState = {
    loading: boolean;
    images: Image[];
    error: string | null;
  };

  const { images } = useSelector(
    (state: { images: ImagesState }) => state.images
  );

  const filteredImagesL = useMemo(
    () => images.filter((item) => item.page === "lightbg"),
    [images]
  );
  const filteredImagesD = useMemo(
    () => images.filter((item) => item.page === "darkbg"),
    [images]
  );
  const filteredTourL = useMemo(
    () => images.filter((item) => item.page === "tourbgl"),
    [images]
  );
  const filteredTourD = useMemo(
    () => images.filter((item) => item.page === "tourbgd"),
    [images]
  );
  const filteredHotelL = useMemo(
    () => images.filter((item) => item.page === "hotelbgl"),
    [images]
  );
  const filteredHotelD = useMemo(
    () => images.filter((item) => item.page === "hotelbgd"),
    [images]
  );

  return (
    <Fragment>
      <section
        style={
          darkMode
            ? {
                backgroundImage: `url(${
                  filteredImagesD[0]?.image !== undefined
                    ? filteredImagesD[0].image.secure_url
                    : ""
                })`,
              }
            : {
                backgroundImage: `url(${
                  filteredImagesL[0]?.image !== undefined
                    ? filteredImagesL[0].image.secure_url
                    : ""
                })`,
              }
        }
        className="flex flex-col h-[100dvh] w-full  items-center justify-between text-center bg-cover  bg-no-repeat  shadow-bot-white dark:shadow-bot-black "
      >
        <span onClick={ok} className=" text-res-xl text-blue-900 dark:text-[#e89c3e] leading-[2rem] mx-3 absolute top-2/4 -translate-y-2/4 min-400:leading-[3rem] min-1000:leading-[4rem]">
          Travel with your loved ones <br />
          <span className="text-[#ff742a] dark:text-blue-900">
            Collect memories
          </span>
        </span>
        <div
          className="grid grid-flow-row w-11/12  p-3 gap-2 text-start text-black dark:text-white  rounded-lg bg-[#00e1ff3a] dark:bg-[#00e1ff0f] absolute bottom-0 
          [&>div]:grid [&>div]:grid-flow-col [&>div]:w-full [&>div>div>p]:w-fit [&>div>div]:min-w-[6rem] [&>div]:gap-2 [&>div>div]:p-2 
          min-400:grid-flow-col min-400:[&>div]:grid-flow-row min-400:w-5/6 min-500:[&>div]:min-w-full  min-800:[&>div]:grid-flow-col 
          min-800:p-6 min-800:[&>div>div]:p-4 xl:w-[70%] min-1400:w-4/6 min-1600:w-3/5 min-2000:w-[55%]
        "
        >
          <div className=" [&>div]:bg-white dark:[&>div]:bg-black [&>div]:rounded-lg ">
            <div>
              <p className="text-blue-900 dark:text-[#e89c3e]  text-res-base ">
                From:
              </p>
              <p className="text-res-sm">08/06</p>
            </div>
            <div>
              <p className="text-blue-900 dark:text-[#e89c3e] text-res-base">
                to:
              </p>
              <p className="text-res-sm">12/06</p>
            </div>
          </div>
          <div className="  [&>div]:grid [&>div]:bg-white dark:[&>div]:bg-black [&>div]:rounded-lg">
            <div>
              <p className="text-blue-900 dark:text-[#e89c3e] text-res-base">
                Phone:
              </p>
              <p className="text-res-sm">5</p>
            </div>
            <div>
              <p className="text-blue-900 dark:text-[#e89c3e] text-res-base">
                Price:
              </p>
              <p className="text-res-sm">300 Gel</p>
            </div>
          </div>

          <div className=" [&>div]:grid   [&>div]:bg-white dark:[&>div]:bg-black [&>div]:rounded-lg">
            <div>
              <p className="text-blue-900 dark:text-[#e89c3e] text-res-base">
                Hotel:
              </p>
              <p className="text-res-sm">100 Gel</p>
            </div>
            <div
              className="   !bg-transparent  !p-0
            [&>button]:hover:bg-white dark:[&>button]:hover:bg-black"
            >
              {" "}
              <Link to="/BookTour">
                <button
                  className="block items-center w-full      h-[3.75rem] text-res-base bg-blue-900 dark:bg-[#e89c3e] rounded-lg 
                  hover:text-blue-900 dark:hover:text-[#e89c3e] hover:bg-[#e89c3e] dark:hover:bg-blue-900 transition-all duration-300  min-800:h-full 
             "
                >
                  <p>Book</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        ref={aboutTourRef}
        style={
          darkMode
            ? {
                backgroundImage: `url(${
                  filteredTourD[0]?.image !== undefined
                    ? filteredTourD[0]?.image?.secure_url
                    : ""
                })`,
              }
            : {
                backgroundImage: `url(${
                  filteredTourL[0]?.image !== undefined
                    ? filteredTourL[0]?.image?.secure_url
                    : ""
                })`,
              }
        }
        className="grid items-center min-h-[100dvh]  px-4 py-20 bg-no-repeat bg-cover  shadow-whole-white dark:shadow-whole-black min-700:px-12"
      >
        <AboutTour />
      </section>
      <section ref={galleryRef}>
        <Galerry />
      </section>
      <section
        id="hotelref"
        ref={hotelRef}
        style={
          darkMode
            ? {
                backgroundImage: `url(${
                  filteredHotelD[0]?.image !== undefined
                    ? filteredHotelD[0]?.image?.secure_url
                    : ""
                })`,
              }
            : {
                backgroundImage: `url(${
                  filteredHotelL[0]?.image !== undefined
                    ? filteredHotelL[0].image.secure_url
                    : ""
                })`,
              }
        }
        className=" grid  items-center content-center w-full min-h-[100dvh] px-4 py-20 bg-cover bg-center bg-no-repeat bottom-0 left-0 relative shadow-whole-white dark:shadow-whole-black min-700:px-12 min-900:gap-8"
      >
        <Hotel />
      </section>
      <section
        ref={contactRef}
        className="flex justify-center  px-2 w-full dark:shadow-whole-black bg-white dark:bg-black relative min-300:p-4 min-700:px-12 min-1300:p-20"
      >
        <Contact />
      </section>
    </Fragment>
  );
};
export default Main;
