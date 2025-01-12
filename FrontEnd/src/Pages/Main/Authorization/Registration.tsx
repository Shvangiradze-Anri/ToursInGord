import {
  FormEventHandler,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  emailValidation,
  lastnameValidation,
  nameValidation,
  passwordValidation,
} from "./validation/validation";
import { useSelector } from "react-redux";
import { axiosUser } from "../../../api/axios";
import { RootState } from "../../../redux/redux";
import { Helmet } from "react-helmet-async";

interface MatchCode {
  confrimCode: number | null;
  generatedCode: number | null;
}
function Registration() {
  const navigate = useNavigate();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [name, setName] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [gender, setGender] = useState<string>("Male"); // Default to 'Male'
  const maleRef = useRef<HTMLInputElement | null>(null);
  const femaleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setGender(femaleRef.current?.checked ? "Female" : "Male");
  }, [femaleRef, maleRef]);

  const [errorName, setErrorName] = useState<string>("");
  const [errorLastname, setErrorLastname] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  useEffect(() => {
    const debounceValidation = setTimeout(() => {
      nameValidation(name, setErrorName);
      lastnameValidation(lastname, setErrorLastname);
      emailValidation(email, setErrorEmail);
      passwordValidation(password, setErrorPassword);
    }, 300);

    return () => clearTimeout(debounceValidation);
  }, [name, lastname, email, password]);

  const Day = Array.from({ length: 31 }, (_, i) => i + 1);
  const Month = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [dayOpen, setDayOpen] = useState<boolean>(false);
  const [monthOpen, setMonthOpen] = useState<boolean>(false);
  const [monthAsNumber, setMonthASNUmber] = useState<number | null>(null);
  const [yearOpen, setYearOpen] = useState<boolean>(false);

  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const [birthday, setBirthday] = useState<string | null>(null);

  const dayRef = useRef<HTMLDivElement | null>(null);
  const monthRef = useRef<HTMLDivElement | null>(null);
  const yearRef = useRef<HTMLDivElement | null>(null);

  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  console.log("day", daysInMonth);
  console.log("Day", Day);

  const currentYear = new Date().getFullYear();
  const Year = useMemo(
    () => Array.from({ length: currentYear - 1919 + 2 }, (_, i) => 1920 + i),
    [currentYear]
  );
  useEffect(() => {
    const getDaysInMonth = (month: number): number => {
      // Array holding the number of days for each month (non-leap year scenario)
      const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      return daysPerMonth[month]; // Get the number of days for the selected month
    };

    const monthIndex = Month.indexOf(selectedMonth);
    if (monthIndex >= 0) {
      const days = getDaysInMonth(monthIndex);
      setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
    } else {
      setDaysInMonth([]); // Reset if no month is selected
    }
  }, [selectedMonth]);

  useEffect(() => {
    setBirthday(
      selectedDay && selectedMonth && selectedYear
        ? `${selectedDay}-${selectedMonth}-${selectedYear}`
        : null
    );
  }, [selectedDay, selectedMonth, monthAsNumber, selectedYear]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setDayOpen(false);
      }
      if (
        monthRef.current &&
        !monthRef.current.contains(event.target as Node)
      ) {
        setMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [openCodeSender, setOpenCodeSender] = useState<boolean>(false);
  const [matchCode, setMatchedCode] = useState<MatchCode>({
    confrimCode: null,
    generatedCode: null,
  });

  const handleCode: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (
      errorName ||
      errorLastname ||
      errorEmail ||
      errorPassword ||
      !birthday
    ) {
      return; // Do not proceed if there are validation errors
    }
    const GenerateSecretKey = () => {
      const array = new Uint8Array(16);
      window.crypto.getRandomValues(array);
      return Array.from(array, (byte) =>
        ("0" + (byte & 0xff).toString(16)).slice(-2)
      ).join("");
    };
    const CryptoJS = (await import("crypto-js")).default;
    try {
      const defaultNumber = Math.floor(100000 + Math.random() * 900000);
      setOpenCodeSender(true);
      setMatchedCode((prev) => ({ ...prev, generatedCode: defaultNumber }));

      const codeSecretKey = GenerateSecretKey();
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ defaultNumber, email }),
        codeSecretKey
      ).toString();

      const res = await axiosUser.post(
        "/Authorization/Registration/ConfrimCode",
        {
          encryptedData,
          codeSecretKey,
        }
      );

      import("react-toastify").then(({ toast }) => {
        if (res.status === 200) {
          toast.success("Code is Sended");
        } else {
          toast.error("Code doesn't Send");
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        import("react-toastify").then(({ toast }) =>
          toast.error("An error occurred while sending the code")
        );
      } else {
        console.error("An unexpected error occurred");
        import("react-toastify").then(({ toast }) =>
          toast.error("An unexpected error occurred")
        );
      }
    }
  };
  const GenerateSecretKey = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      if (matchCode.generatedCode === matchCode.confrimCode) {
        const signSecretKey = GenerateSecretKey();
        const encryptedSignData = CryptoJS.AES.encrypt(
          JSON.stringify({ name, lastname, email, password, gender, birthday }),
          signSecretKey
        ).toString();

        const res = await axiosUser.post(`/Authorization/Registration`, {
          encryptedSignData,
          signSecretKey,
        });
        if (res.data.error) {
          import("react-toastify").then(({ toast }) =>
            toast.error(res.data.error)
          );
        } else {
          setName("");
          setLastname("");
          setEmail("");
          setPassword("");
          setGender("");
          setSelectedDay("");
          setSelectedMonth("");
          setSelectedYear("");
          setOpenCodeSender(false);
          import("react-toastify").then(({ toast }) =>
            toast.success("You've successfully registered")
          );

          navigate("/Authorization");
        }
      } else {
        import("react-toastify").then(({ toast }) =>
          toast.error("Code is Wrong")
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      import("react-toastify").then(({ toast }) =>
        toast.error("Registration failed. Please try again later.")
      );
    }
  };
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const backgroundImages = useMemo(() => {
    const getMainImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1726513496/Site%20Images/sizukkags7wsoqh8hl17.jpg"
        : "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1726513492/Site%20Images/otjl6yqje0ds0dcda3ap.jpg";

    const getBlurredImageUrl = () =>
      darkMode
        ? "https://res.cloudinary.com/dywchsrms/image/upload/e_blur:500,f_auto,q_auto/v1726513496/Site%20Images/sizukkags7wsoqh8hl17.jpg"
        : "https://res.cloudinary.com/dywchsrms/image/upload/e_blur:500,f_auto,q_auto/v1726513492/Site%20Images/otjl6yqje0ds0dcda3ap.jpg";

    return {
      mainImage: getMainImageUrl(),
      blurredImage: getBlurredImageUrl(),
    };
  }, [darkMode]);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImages.mainImage;
    img.onload = () => setIsImageLoaded(true); // Mark image as loaded
  }, [backgroundImages.mainImage]);

  const backgroundStyle = {
    backgroundImage: `url(${isImageLoaded ? backgroundImages.mainImage : backgroundImages.blurredImage})`,
    backgroundColor: darkMode ? "#000" : "#fff", // Fallback color
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <Fragment>
      <Helmet>
        <title>Registration</title>
        <meta name="description" content="Create account" />
        <link rel="canonical" href="/Authorization/Registration" />
      </Helmet>
      <div
        style={backgroundStyle}
        className=" grid h-[100dvh] place-items-center bg-cover bg-center bg-no-repeat  px-4 min-700:px-12 min-900:px-28 bg-white dark:bg-black"
      >
        {openCodeSender ? (
          <div className="fixed grid place-items-center w-full h-[100dvh] z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md">
            <form
              className="grid place-items-center gap-y-8 w-[26.5rem] z-20"
              onSubmit={handleSubmit}
            >
              <div className="text-center">
                <span className="text-[#ffa217] mb-2 text-2xl font-normal leading-6 tracking-wider">
                  Code is sended
                </span>
                <p className="text-[#ffa217] mb-2 text-res-sm font-normal leading-6 tracking-wider ">
                  Check your Email
                </p>
              </div>
              <input
                className="w-full border-[#de4d28] border-2 outline-none p-4 text-base bg-transparent rounded-lg 
              placeholder:text-[#de4c2887] placeholder:text-sm focus:border-yellow-500 focus:outline-none"
                type="number"
                name="code"
                placeholder="Confrim Code"
                maxLength={7}
                required
                autoComplete="on"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMatchedCode((prevMatchCode) => ({
                    ...prevMatchCode,
                    confrimCode: e.target.valueAsNumber,
                  }))
                }
              />
              <button
                type="submit"
                className="grid place-items-center cursor-pointer py-2 px-7 border-2 border-[#de4d28] rounded-lg bg-transparent"
              >
                Confrim
              </button>
            </form>
          </div>
        ) : null}

        <form
          onSubmit={handleCode}
          className="flex flex-col  w-full  gap-3  min-300:w-11/12 min-400:w-4/5 min-500:w-3/5 min-800:w-2/4 min-1000:w-2/5 min-1200:w-1/3 min-1300:w-[24rem]"
        >
          <div className="  grid grid-flow-col text-blue-700 gap-2 text-res-base dark:text-[#e89c3e] [&>div>input]:p-2">
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                required
                autoComplete="on"
                value={name}
                name="name"
                id="name"
                autoFocus
                onChange={(name) => setName(name.target.value)}
                className=" border-2 bg-transparent w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400"
              />
              <p className="text-red-600 text-res-special-errors">
                {errorName}
              </p>
            </div>
            <div>
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                required
                autoComplete="on"
                value={lastname}
                name="lastname"
                id="lastname"
                onChange={(lastname) => setLastname(lastname.target.value)}
                className=" border-2 bg-transparent w-full outline-none border-orange-400 rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400"
              />
              <p className="text-red-600 text-res-special-errors">
                {errorLastname}
              </p>
            </div>
          </div>
          <div className="grid  gap-3 [&>div]:grid [&>div>input]:p-2  text-blue-700 text-res-base dark:text-[#e89c3e] ">
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                required
                autoComplete="on"
                value={email}
                name="email"
                id="email"
                onChange={(email) => setEmail(email.target.value)}
                className="border-2 bg-transparent outline-none text-res-sm border-orange-400   rounded-md  dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400"
              />
              <p className="text-red-600 text-res-special-errors">
                {errorEmail}
              </p>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                value={password}
                name="password"
                id="password"
                onChange={(password) => setPassword(password.target.value)}
                className="border-2 bg-transparent outline-none border-orange-400   rounded-md text-res-sm dark:border-blue-700 focus-within:border-orange-300  dark:focus-within:border-blue-400"
              />
              <p className="text-red-600 text-res-special-errors">
                {errorPassword}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-res-base text-blue-700 dark:text-[#ffbc69]">
              Gender
            </p>
            <div className="flex  text-black dark:text-white gap-4 [&>div]:flex [&>div]:gap-2">
              <label className="flex items-center relative align-middle	pl-10 text-res-md-sm   [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                <input
                  ref={femaleRef}
                  type="radio"
                  defaultChecked
                  name="Gender"
                  value="Female"
                  className="[display:none]"
                  required
                />
                <span
                  className="absolute block left-0 cursor-pointer h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] 
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700 "
                />
                Female
              </label>
              <label className="flex items-center relative align-middle	pl-10 text-res-md-sm   [&>input:checked~span:after]:-translate-x-2/4 [&>input:checked~span:after]:-translate-y-2/4 [&>input:checked~span:after]:scale-100">
                <input
                  ref={maleRef}
                  type="radio"
                  name="Gender"
                  value="Male"
                  className="[display:none]"
                  required
                />
                <span
                  className="absolute block left-0 cursor-pointer h-4 w-4 border-2 border-[#e89c3e] dark:border-blue-700 rounded-[50%] 
                  after:[content:''] after:block after:absolute after:top-2/4 after:left-2/4 after:-translate-x-1/2 after:-translate-y-1/2 
                  after:scale-0 after:transition-all after:ease-in-out after:duration-300 after:rounded-[50%] after:h-2 after:w-2
                  after:bg-[#e89c3e] after:dark:bg-blue-700"
                />
                Male
              </label>
            </div>
          </div>

          <div>
            <div className="grid grid-flow-col gap-3 [&>div>p]:text-blue-700 text-res-base [&>div>p]:dark:text-[#e89c3e] text-black dark:text-white ">
              <div ref={dayRef}>
                <p>Day</p>
                <div
                  onClick={() => setDayOpen(!dayOpen)}
                  className="relative grid  text-center border-2 border-orange-400   rounded-md  dark:border-blue-700"
                >
                  <p className="text-res-md-sm">
                    {selectedDay === "" ? "--" : selectedDay}
                  </p>
                  <svg
                    className={`absolute top-2/4 right-2 -translate-y-2/4 w-section-icon-width ${
                      dayOpen ? "rotate-0" : "rotate-180"
                    }`}
                    viewBox="0 0 22 12"
                    fill="none"
                  >
                    <path
                      className="stroke-blue-700 dark:stroke-orange-400"
                      d="M1 11C4.90524 7.09475 7.09476 4.90524 11 1L21 11"
                      stroke=""
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <ul
                  className={`relative px-2 mt-1 overflow-y-auto  border-2 border-orange-400  dark:border-blue-700 rounded-md   transition-all duration-500  ${
                    dayOpen
                      ? "h-32  border-orange-400  dark:border-blue-700 "
                      : "h-0  border-transparent  dark:border-transparent"
                  }`}
                >
                  <div className="flex gap-1 justify-between items-center  w-full sticky top-0 bg-blue-500  dark:bg-purple-600 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.25 10.5C1.25 5.39139 5.39139 1.25 10.5 1.25C15.6086 1.25 19.75 5.39139 19.75 10.5C19.75 15.6086 15.6086 19.75 10.5 19.75C5.39139 19.75 1.25 15.6086 1.25 10.5ZM10.5 2.75C6.21981 2.75 2.75 6.21981 2.75 10.5C2.75 14.7802 6.21981 18.25 10.5 18.25C14.7802 18.25 18.25 14.7802 18.25 10.5C18.25 6.21981 14.7802 2.75 10.5 2.75Z"
                        fill=""
                      />
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.081 16.0805C16.3739 15.7876 16.8488 15.7876 17.1417 16.0805L21.3843 20.3232C21.6772 20.6161 21.6772 21.0909 21.3843 21.3838C21.0914 21.6767 20.6165 21.6767 20.3236 21.3838L16.081 17.1412C15.7881 16.8483 15.7881 16.3734 16.081 16.0805Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="number"
                      name="day"
                      placeholder="Day"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className=" w-full p-1 text-res-sm outline-none bg-transparent "
                      required
                    />
                  </div>
                  {daysInMonth.length > 0
                    ? daysInMonth.map((day: number, id: number) => {
                        return (
                          <li
                            key={id}
                            onClick={() => {
                              setSelectedDay(day.toString());
                              setDayOpen(false);
                            }}
                            className={`w-full text-res-sm text-black dark:text-white bg-transparent list-none hover:bg-[#00e1ff2a] rounded pl-1 ${
                              day.toString().startsWith(selectedDay)
                                ? "block"
                                : setTimeout(() => {
                                    "hidden";
                                  }, 1000)
                            }
                          ${
                            day.toString() === selectedDay
                              ? " hover:bg-[#00e1ffbe]  dark:hover:bg-purple-500  "
                              : null
                          }`}
                          >
                            {day}
                          </li>
                        );
                      })
                    : Day.map((day: number, id: number) => {
                        return (
                          <li
                            key={id}
                            onClick={() => {
                              setSelectedDay(day.toString());
                              setDayOpen(false);
                            }}
                            className={`w-full text-res-sm text-black dark:text-white bg-transparent list-none hover:bg-[#00e1ff2a] rounded pl-1 ${
                              day.toString().startsWith(selectedDay)
                                ? "block"
                                : setTimeout(() => {
                                    "hidden";
                                  }, 1000)
                            }
                          ${
                            day.toString() === selectedDay
                              ? " hover:bg-[#00e1ffbe]  dark:hover:bg-purple-500  "
                              : null
                          }`}
                          >
                            {day}
                          </li>
                        );
                      })}
                </ul>
              </div>
              <div ref={monthRef}>
                <p>Month</p>
                <div
                  onClick={() => setMonthOpen(!monthOpen)}
                  className="relative grid  text-center border-2 border-orange-400   rounded-md  dark:border-blue-700"
                >
                  <p className="text-res-md-sm">
                    {selectedMonth === "" ? "--" : selectedMonth}
                  </p>
                  <svg
                    className={`absolute top-2/4 right-2 -translate-y-2/4 w-section-icon-width ${
                      monthOpen ? "rotate-0" : "rotate-180"
                    }`}
                    viewBox="0 0 22 12"
                    fill="none"
                  >
                    <path
                      className="stroke-blue-700 dark:stroke-orange-400"
                      d="M1 11C4.90524 7.09475 7.09476 4.90524 11 1L21 11"
                      stroke=""
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <ul
                  className={`relative px-2 mt-1 overflow-y-auto  border-2 border-orange-400  dark:border-blue-700 rounded-md   transition-all duration-500  ${
                    monthOpen
                      ? "h-32  border-orange-400  dark:border-blue-700 "
                      : "h-0  border-transparent  dark:border-transparent"
                  }`}
                >
                  <div className="flex gap-1 justify-between items-center  w-full sticky top-0  bg-blue-500  dark:bg-purple-600 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.25 10.5C1.25 5.39139 5.39139 1.25 10.5 1.25C15.6086 1.25 19.75 5.39139 19.75 10.5C19.75 15.6086 15.6086 19.75 10.5 19.75C5.39139 19.75 1.25 15.6086 1.25 10.5ZM10.5 2.75C6.21981 2.75 2.75 6.21981 2.75 10.5C2.75 14.7802 6.21981 18.25 10.5 18.25C14.7802 18.25 18.25 14.7802 18.25 10.5C18.25 6.21981 14.7802 2.75 10.5 2.75Z"
                        fill=""
                      />
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.081 16.0805C16.3739 15.7876 16.8488 15.7876 17.1417 16.0805L21.3843 20.3232C21.6772 20.6161 21.6772 21.0909 21.3843 21.3838C21.0914 21.6767 20.6165 21.6767 20.3236 21.3838L16.081 17.1412C15.7881 16.8483 15.7881 16.3734 16.081 16.0805Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="text"
                      name="month"
                      placeholder="Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full p-1 text-res-sm outline-none bg-transparent"
                      required
                    />
                  </div>
                  {Month.map((month: string, id: number) => {
                    return (
                      <li
                        key={id}
                        onClick={() => {
                          setSelectedMonth(month);
                          setMonthOpen(false);
                          setMonthASNUmber(id + 1);
                        }}
                        className={`w-full text-res-sm text-black dark:text-white bg-transparent list-none hover:bg-[#00e1ff2a] rounded pl-1 ${
                          month.toLowerCase().startsWith(selectedMonth)
                            ? "block"
                            : setTimeout(() => {
                                "hidden";
                              }, 1000)
                        }
                         ${
                           month === selectedMonth
                             ? "hover:bg-[#00e1ffbe]  dark:hover:bg-purple-500  "
                             : null
                         }`}
                      >
                        {month}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div ref={yearRef}>
                <p>Year</p>
                <div
                  onClick={() => setYearOpen(!yearOpen)}
                  className="relative grid  text-center border-2 border-orange-400   rounded-md  dark:border-blue-700"
                >
                  <p className="text-res-md-sm">
                    {selectedYear === "" ? "--" : selectedYear}
                  </p>
                  <svg
                    className={`absolute top-2/4 right-2 -translate-y-2/4 w-section-icon-width ${
                      yearOpen ? "rotate-0" : "rotate-180"
                    }`}
                    viewBox="0 0 22 12"
                    fill="none"
                  >
                    <path
                      className="stroke-blue-700 dark:stroke-orange-400"
                      d="M1 11C4.90524 7.09475 7.09476 4.90524 11 1L21 11"
                      stroke=""
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <ul
                  className={`relative px-2 mt-1 overflow-y-auto  border-2 border-orange-400  dark:border-blue-700 rounded-md   transition-all duration-500  ${
                    yearOpen
                      ? "h-32  border-orange-400  dark:border-blue-700 "
                      : "h-0  border-transparent  dark:border-transparent"
                  }`}
                >
                  <div className="flex gap-1  items-center  w-full sticky top-0  bg-blue-500  dark:bg-purple-600 rounded">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.25 10.5C1.25 5.39139 5.39139 1.25 10.5 1.25C15.6086 1.25 19.75 5.39139 19.75 10.5C19.75 15.6086 15.6086 19.75 10.5 19.75C5.39139 19.75 1.25 15.6086 1.25 10.5ZM10.5 2.75C6.21981 2.75 2.75 6.21981 2.75 10.5C2.75 14.7802 6.21981 18.25 10.5 18.25C14.7802 18.25 18.25 14.7802 18.25 10.5C18.25 6.21981 14.7802 2.75 10.5 2.75Z"
                        fill=""
                      />
                      <path
                        className="fill-blue-700 dark:fill-orange-400"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.081 16.0805C16.3739 15.7876 16.8488 15.7876 17.1417 16.0805L21.3843 20.3232C21.6772 20.6161 21.6772 21.0909 21.3843 21.3838C21.0914 21.6767 20.6165 21.6767 20.3236 21.3838L16.081 17.1412C15.7881 16.8483 15.7881 16.3734 16.081 16.0805Z"
                        fill=""
                      />
                    </svg>
                    <input
                      type="number"
                      name="year"
                      placeholder="Year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className=" w-full p-1 text-res-sm outline-none bg-transparent"
                      required
                    />
                  </div>
                  {Year.map((year: number, id: number) => {
                    return (
                      <li
                        key={id}
                        onClick={() => {
                          setSelectedYear(year.toString());
                          setYearOpen(!yearOpen);
                        }}
                        className={`w-full text-res-sm text-black dark:text-white bg-transparent list-none hover:bg-[#00e1ff2a] rounded pl-1 ${
                          year.toString().startsWith(selectedYear)
                            ? "block"
                            : setTimeout(() => {
                                "hidden";
                              }, 1000)
                        }
                        ${
                          year.toString() === selectedYear
                            ? "hover:bg-[#00e1ffbe]  dark:hover:bg-purple-500  "
                            : null
                        }`}
                      >
                        {year}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="mt-4 grid place-items-center gap-3  text-res-base">
              {" "}
              <button
                type="submit"
                className="bg-blue-900 dark:bg-[#e89c3e] p-2  text-[#e89c3e] w-2/4 border-transparent border-2   rounded-md dark:text-blue-700 hover:bg-transparent hover:dark:bg-transparent hover:text-blue-900  hover:dark:text-[#e89c3e] hover:border-blue-900 hover:dark:border-[#e89c3e]  transition duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default Registration;
