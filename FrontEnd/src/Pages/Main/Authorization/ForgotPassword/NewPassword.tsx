import {
  FormEventHandler,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePasswordValidation } from "../validation/validation";
import CryptoJS from "crypto-js";

import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { axiosUser } from "../../../../api/axios";

function NewPassword() {
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

  const filteredImagesAuth = useMemo(() => {
    const filteredL = images.filter((item) => item.page === "authlightbg");
    const filteredD = images.filter((item) => item.page === "authdarkbg");
    return { light: filteredL, dark: filteredD };
  }, [images]);

  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");

  const [errorPassword, setErrorPassword] = useState<string>("");
  const [reErrorPassword, setReErrorPassword] = useState<string>("");

  useEffect(() => {
    changePasswordValidation(password, setErrorPassword);
  }, [password, rePassword]);
  useEffect(() => {
    if (rePassword && rePassword !== password) {
      setReErrorPassword("The password isn't suitable");
    } else {
      setReErrorPassword("");
    }
  });

  const darkMode = useSelector((state: any) => state.theme.darkMode);

  const location = useLocation();

  const [email, setData] = useState<string | null>(null);

  useEffect(() => {
    if (location.state) {
      try {
        setData(location.state);
      } catch (error) {
        console.log(error);
      }
    }
  }, [location.state]);

  const navigate = useNavigate();

  const hundleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!errorPassword && !reErrorPassword && password === rePassword) {
      const GenerateSecretKey = () => {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return Array.from(array, (byte) =>
          ("0" + (byte & 0xff).toString(16)).slice(-2)
        ).join("");
      };
      try {
        const codeSecretKey = GenerateSecretKey();
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({ password, email }),
          codeSecretKey
        ).toString();

        const res = await axiosUser.put(
          `/Authorization/Change_Password/New_Password`,
          {
            encryptedData,
            codeSecretKey,
          }
        );
        if (res.status === 200) {
          navigate("/Authorization");
          import("react-toastify").then(({ toast }) =>
            toast.success(`${res.data.success}`)
          );
        } else {
          import("react-toastify").then(({ toast }) =>
            toast.error(`${res.status}`)
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      import("react-toastify").then(({ toast }) =>
        toast.error("Inappropriate password")
      );
    }
  };
  return (
    <Fragment>
      <Helmet>
        <title>New Password</title>
        <meta name="description" content="Enter new password" />
        <link
          rel="canonical"
          href="/Authorization/Change_Password/New_Password"
        />
      </Helmet>
      <div
        style={
          darkMode
            ? {
                backgroundImage: `url(${filteredImagesAuth.dark[0].image.secure_url})`,
              }
            : {
                backgroundImage: `url(${filteredImagesAuth.light[0].image.secure_url})`,
              }
        }
        className="grid place-items-center h-[100dvh] bg-cover bg-center bg-no-repeat px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black"
      >
        <form
          onSubmit={hundleSubmit}
          className="flex flex-col  w-full  gap-8 [&>div>input]:p-2 min-300:w-11/12 min-400:w-4/5 min-500:w-3/5 min-800:w-2/4 min-1000:w-2/5 min-1200:w-1/3 min-1300:w-[24rem]"
        >
          <div className="  grid text-blue-700 gap-2 text-res-base dark:text-[#e89c3e]">
            <p>New Password</p>{" "}
            <input
              type="password"
              required
              id="password"
              autoFocus
              onChange={(password) => setPassword(password.target.value)}
              className=" border-2 bg-transparent  w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700  focus-within:border-orange-300  dark:focus-within:border-blue-400 "
            />
            <p className="text-red-600 text-res-special-errors">
              {errorPassword}
            </p>
          </div>

          <div className="grid gap-2  text-blue-700 text-res-base dark:text-[#e89c3e] ">
            <p>Repeat Password</p>
            <input
              type="password"
              required
              id="repeatPassword"
              onChange={(repassword) => setRePassword(repassword.target.value)}
              className="border-2 bg-transparent outline-none border-orange-400   rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400"
            />
            <p className="text-red-600 text-res-special-errors">
              {reErrorPassword}
            </p>
          </div>
          <div className=" grid place-items-center gap-3  text-res-base">
            <button
              type="submit"
              className="bg-blue-900 dark:bg-[#e89c3e] p-2  text-[#e89c3e] w-2/4 border-transparent border-2   rounded-md dark:text-blue-700 hover:bg-transparent hover:dark:bg-transparent hover:text-blue-900  hover:dark:text-[#e89c3e] hover:border-blue-900 hover:dark:border-[#e89c3e]  transition duration-300"
            >
              Change
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default NewPassword;
