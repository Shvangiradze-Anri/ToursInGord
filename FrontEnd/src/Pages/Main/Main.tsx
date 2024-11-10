import { Link } from "react-router-dom";
import { Fragment, lazy, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRefs } from "../../redux/componentRef";
import { AppDispatch, RootState } from "../../redux/redux";

const AboutTour = lazy(() => import("./About_tour/AboutTour"));
const Gallerry = lazy(() => import("./Gallery/Gallery"));
const Hotel = lazy(() => import("./Hotel/Hotel"));
const Contact = lazy(() => import("./Contact/Contact"));

const Main = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const dispatch = useDispatch<AppDispatch>();

  const aboutTourRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const hotelRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

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

  const backgroundImages = useMemo(() => {
    const getMainImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1727205507/Site%20Images/dyxnrrbgak3izvwetyhb.jpg"
        : "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1727205863/Site%20Images/blff7o0maaiid57vi7ih.jpg";
    const getTourImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1727266024/Site%20Images/cn01jnl5lqqda5zq2qd1.jpg"
        : "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1727261708/Site%20Images/ajx2p8lszxl876kgptlq.jpg";
    const getHotelImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1730293299/Site%20Images/ej6lrsg7h6ygczj0qtrl_o19fd2.webp"
        : "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1726513533/Site%20Images/uiy8ecrw0mefdatuchcj.webp";
    return {
      image: getMainImageUrl(),
      tour: getTourImageUrl(),
      hotel: getHotelImageUrl(),
    };
  }, [darkMode]);

  return (
    <Fragment>
      <section
        style={{ backgroundImage: `url(${backgroundImages?.image})` }}
        className="flex flex-col h-[100dvh] w-full  items-center justify-between text-center bg-cover   bg-no-repeat  shadow-bot-white dark:shadow-bot-black  "
      >
        <span className=" text-res-xl text-blue-900 dark:text-[#e89c3e] leading-[2rem] mx-3 absolute top-2/4 -translate-y-2/4 min-400:leading-[3rem] min-1000:leading-[4rem]">
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
              <p className="text-res-sm">555 555 555</p>
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
        style={{ backgroundImage: `url(${backgroundImages?.tour})` }}
        className="grid items-center min-h-[100dvh]  px-4 py-20 bg-no-repeat bg-cover  shadow-whole-white dark:shadow-whole-black min-700:px-12"
      >
        <AboutTour />
      </section>
      <section ref={galleryRef}>
        <Gallerry />
      </section>
      <section
        id="hotelref"
        ref={hotelRef}
        style={{ backgroundImage: `url(${backgroundImages?.hotel})` }}
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
