import {
  FormEventHandler,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { emailValidation } from "../validation/validation";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import { axiosUser } from "../../../../api/axios";
import { RootState } from "../../../../redux/redux";
import { Helmet } from "react-helmet-async";

function ChangePassword() {
  const [email, setEmail] = useState<string>("");

  const [errorEmail, setErrorEmail] = useState<string>("");
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    emailValidation(email, setErrorEmail);
  }, [email]);

  const navigate = useNavigate();

  const GenerateSecretKey = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };

  const handleCode: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const defaultNumber = Math.floor(100000 + Math.random() * 900000);

    if (!errorEmail) {
      const codeSecretKey = GenerateSecretKey();
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ defaultNumber, email }),
        codeSecretKey
      ).toString();

      navigate("/Authorization/Change_Password/Get_Code", {
        state: { encryptedData, codeSecretKey },
      });

      try {
        const res = await axiosUser.post(
          `/Authorization/Registration/ConfrimCode`,
          {
            encryptedData,
            codeSecretKey,
          }
        );

        // Lazy load react-toastify to show notification
        import("react-toastify").then(({ toast }) => {
          if (res.status === 200) {
            toast.success("Code is Sent");
          } else {
            toast.error("Code didn't Send");
          }
        });
      } catch (error: unknown) {
        console.error("An error occurred:", error);
      }
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
        <title>Change Password</title>
        <meta name="description" content="Change account password" />
        <link rel="canonical" href="/Authorization/Change_Password" />
      </Helmet>
      <div
        style={{ backgroundImage: `url(${backgroundImages?.image})` }}
        className="grid place-items-center h-[100dvh]  bg-cover bg-center bg-no-repeat px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black"
      >
        <form
          onSubmit={handleCode}
          className="grid gap-8 [&>div>input]:p-2 min-300:w-11/12 min-400:w-4/5 min-500:w-3/5 min-800:w-2/4 min-1000:w-2/5 min-1200:w-1/3 min-1300:w-[24rem]"
        >
          <div className="grid text-blue-700 gap-2 text-res-base dark:text-[#e89c3e]">
            <p>Email</p>
            <input
              type="email"
              id="email"
              autoComplete="on"
              required
              autoFocus
              onChange={(email) => setEmail(email.target.value)}
              className="border-2 bg-transparent w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300 dark:focus-within:border-blue-400"
            />
            <p className="text-red-600 text-res-special-errors">{errorEmail}</p>
          </div>

          <div className="grid place-items-center">
            <button
              type="submit"
              className="bg-blue-900 dark:bg-[#e89c3e] p-2 text-[#e89c3e] w-2/4 border-transparent border-2 rounded-md dark:text-blue-700 hover:bg-transparent hover:dark:bg-transparent hover:text-blue-900 hover:dark:text-[#e89c3e] hover:border-blue-900 hover:dark:border-[#e89c3e] transition duration-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default ChangePassword;
