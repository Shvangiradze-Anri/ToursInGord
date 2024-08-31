import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<any>(true);

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(true);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme ? false : true));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
