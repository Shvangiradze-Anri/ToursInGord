export const nameValidation = (
  name: string,
  setErrorName: React.Dispatch<React.SetStateAction<string>>
): void => {
  return name && name.length < 2
    ? setErrorName("Your name is too short")
    : name && name.length > 20
      ? setErrorName("Your name is too long")
      : setErrorName("");
};
export const lastnameValidation = (
  lastname: string,
  setErrorLastname: React.Dispatch<React.SetStateAction<string>>
): void => {
  return lastname && lastname.length < 2
    ? setErrorLastname("Your last name is too short")
    : lastname && lastname.length > 20
      ? setErrorLastname("Your last name is too long")
      : setErrorLastname("");
};

export const emailValidation = (
  email: string,
  setErrorEmail: React.Dispatch<React.SetStateAction<string>>
): void => {
  const emailRegular =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return email && !email.match(emailRegular)
    ? setErrorEmail("Email not valid")
    : setErrorEmail("");
};

export const passwordValidation = (
  password: string,
  setErrorPassword: React.Dispatch<React.SetStateAction<string>>
): void => {
  const passwordRegular =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
  return password && !password.match(passwordRegular)
    ? setErrorPassword(
        "Your password must contains (8-20 characters),(A,z,0-9,#$@...)"
      )
    : setErrorPassword("");
};

export const changePasswordValidation = (
  password: string,

  setErrorPassword: React.Dispatch<React.SetStateAction<string>>
): void => {
  const passwordRegular =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
  return password && !password.match(passwordRegular)
    ? setErrorPassword(
        "Your password must contains (8-20 characters),(A,z,0-9,#$@...) or they aren't suitable"
      )
    : setErrorPassword("");
};
