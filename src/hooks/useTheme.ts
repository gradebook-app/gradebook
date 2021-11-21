import { createContext, useContext } from "react";
import { ITheme } from "../constants/theme";

const ThemeContext = createContext<ITheme>({} as ITheme);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = () => {
    const theme = useContext(ThemeContext);
    return theme; 
};