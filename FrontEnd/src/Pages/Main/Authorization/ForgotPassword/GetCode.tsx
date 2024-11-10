import {
  FormEventHandler,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { RootState } from "../../../../redux/redux";
import { Helmet } from "react-helmet-async";

function GetCode() {
  const codeRef = useRef<HTMLInputElement | null>(null);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  type decryptedDataT = {
    decryptedNumber: number | null;
    decryptedEmail: number | null;
  };

  const [data, setData] = useState<decryptedDataT>({
    decryptedNumber: null,
    decryptedEmail: null,
  });
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          location.state.encryptedData,
          location.state.codeSecretKey
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setData({
          decryptedNumber: decryptedData.defaultNumber,
          decryptedEmail: decryptedData.email,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [location.state]);

  const navigate = useNavigate();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const inputValue = codeRef.current?.value;
    const inputValueAsNumber = inputValue ? parseInt(inputValue, 10) : null;

    if (
      codeRef.current?.value.toString().length === 6 &&
      inputValueAsNumber === data.decryptedNumber
    ) {
      setData({
        decryptedNumber: null,
        decryptedEmail: null,
      });
      navigate("/Authorization/Change_Password/New_Password", {
        state: data.decryptedEmail,
      });
    } else {
      import("react-toastify").then(({ toast }) =>
        toast.error("Code doesn't matched")
      );
    }
  };
  const backgroundImages = useMemo(() => {
    const getMainImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1726513496/Site%20Images/sizukkags7wsoqh8hl17.jpg"
        : "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1726513492/Site%20Images/otjl6yqje0ds0dcda3ap.jpg";

    return {
      image: getMainImageUrl(),
    };
  }, [darkMode]);
  return (
    <Fragment>
      <Helmet>
        <title>Write code</title>
        <meta name="description" content="write code to acces changes" />
      </Helmet>
      <div
        style={{ backgroundImage: `url(${backgroundImages?.image})` }}
        className="grid place-items-center  h-[100dvh] bg-cover bg-center bg-no-repeat  px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black"
      >
        <form
          onSubmit={handleSubmit}
          className="grid  gap-8 [&>div>input]:p-2 min-300:w-11/12 min-400:w-4/5 min-500:w-3/5 min-800:w-2/4 min-1000:w-2/5 min-1200:w-1/3 min-1300:w-[24rem]"
        >
          <div className="  grid text-blue-700 gap-2 text-res-base dark:text-[#e89c3e]">
            <p>Code</p>{" "}
            <input
              ref={codeRef}
              type="number"
              id="confrimCode"
              required
              autoFocus
              className=" border-2 bg-transparent w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400 "
            />
          </div>

          <div className="grid place-items-center">
            <button
              type="submit"
              className="bg-blue-900 dark:bg-[#e89c3e] p-2  text-[#e89c3e] w-2/4 border-transparent border-2   rounded-md dark:text-blue-700 hover:bg-transparent hover:dark:bg-transparent hover:text-blue-900  hover:dark:text-[#e89c3e] hover:border-blue-900 hover:dark:border-[#e89c3e]  transition duration-300"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default GetCode;
