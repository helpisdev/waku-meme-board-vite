import { useContext } from "react";
import { ThemeContext } from "../provider/ThemeProvider";

export const useTheme = () => {
  const { theme, toggle } = useContext(ThemeContext);
  return { theme, toggle };
};
