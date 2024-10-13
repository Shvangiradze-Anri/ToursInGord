import { Fragment, lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { emailValidation, passwordValidation } from "./validation/validation";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/redux";
import { axiosUser } from "../../../api/axios";

const Helmet = lazy(() =>
  import("react-helmet-async").then((module) => ({ default: module.Helmet }))
);

function LogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    emailValidation(email, setErrorEmail);
    passwordValidation(password, setErrorPassword);
  }, [email, password]);

  const GenerateSecretKey = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Dynamic import of crypto-js
    const CryptoJS = (await import("crypto-js")).default;

    // Dynamic import of react-toastify
    const { toast } = await import("react-toastify");

    try {
      const secretKey = GenerateSecretKey();
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ email, password }),
        secretKey
      ).toString();

      const response = await axiosUser.post("/Authorization", {
        secretKey,
        encryptedData,
      });

      const { data } = response;

      if (data.error) {
        toast.error(`${data.error}`);
      } else {
        setEmail("");
        setPassword("");
        window.location.replace("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during login.");
    }
  };

  type Image = {
    id: number;
    image: {
      url: string;
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

  const filteredImagesAuth = useMemo(() => {
    const filteredL = images.filter((item) => item.page === "authbgl");
    const filteredD = images.filter((item) => item.page === "authbgd");
    return { light: filteredL, dark: filteredD };
  }, [images]);

  const backgroundImage = useMemo(
    () =>
      darkMode
        ? `url(${filteredImagesAuth.dark[0]?.image.url})`
        : `url(${filteredImagesAuth.light[0]?.image.url})`,
    [darkMode, filteredImagesAuth]
  );

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Helmet>
          <title>Log In</title>
          <meta name="description" content="Log into your account" />
          <link rel="canonical" href="/Authorization" />
        </Helmet>
      </Suspense>
      <div
        style={{ backgroundImage }}
        className="grid h-[100dvh] place-items-center bg-cover bg-center bg-no-repeat px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black"
      >
        <form
          onSubmit={handlesubmit}
          className="flex flex-col w-full gap-8 [&>div>input]:p-2 min-300:w-11/12 min-400:w-4/5 min-500:w-3/5 min-800:w-2/4 min-1000:w-2/5 min-1200:w-1/3 min-1300:w-[24rem]"
        >
          <div className="grid text-blue-700 gap-2 text-res-base dark:text-[#e89c3e]">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              autoComplete="on"
              id="email"
              placeholder="Enter email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 bg-transparent w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300 dark:focus-within:border-blue-400"
            />
            <p className="text-red-600 text-res-special-errors">{errorEmail}</p>
          </div>
          <div className="grid gap-2 text-blue-700 text-res-base dark:text-[#e89c3e]">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              id="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 bg-transparent outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300 dark:focus-within:border-blue-400"
            />
            <p className="text-red-600 text-res-special-errors">
              {errorPassword}
            </p>
            <div className="grid place-items-end w-full">
              <Link
                to="Change_Password"
                className="w-fit !text-res-sm text-blue-700 dark:text-[#e89c3e]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="grid place-items-center gap-3 text-res-base">
            <button
              type="submit"
              className="bg-blue-900 dark:bg-[#e89c3e] p-2 text-[#e89c3e] w-2/4 border-transparent border-2 rounded-md dark:text-blue-700 hover:bg-transparent hover:dark:bg-transparent hover:text-blue-900 hover:dark:text-[#e89c3e] hover:border-blue-900 hover:dark:border-[#e89c3e] transition duration-300"
            >
              Log In
            </button>
            <Link
              to="Registration"
              className="px-3 pb-1 text-res-sm border-b-2 border-blue-300 dark:border-purple-700 text-blue-700 dark:text-[#e89c3e]"
            >
              Registration
            </Link>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default LogIn;
