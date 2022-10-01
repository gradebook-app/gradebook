import { OpaqueColorValue } from "react-native";
import { IThemeStatic, theme as staticTheme } from "../constants/theme";
import { useDynamicColor } from "./useDynamicColor";

export interface IThemeDynamic {
    theme: {
        background: OpaqueColorValue | string | any,
        secondary: OpaqueColorValue | string | any,
        icon: OpaqueColorValue | string | any,
        text: OpaqueColorValue | string | any,
        grey: OpaqueColorValue | string | any,
    },
}

export type ITheme = IThemeDynamic & IThemeStatic;


export const useTheme = () => {
    const dynamicBackgroundColor = useDynamicColor({
        light: "#fff",
        dark: "#000",
    });
      
    const dynamicSecondaryColor = useDynamicColor({
        light: "#fff",
        dark: "#111111",
    });
    
    const dynamicTextColor = useDynamicColor({
        light: "#000",
        dark: "#fff",
    });
    
    const dynamicGreyColor = useDynamicColor({
        light: "rgba(0, 0, 0, 0.5)",
        dark: "rgba(255, 255, 255, 0.5)",
    });
    
    const dynamicIconColor = useDynamicColor({
        light: "rgba(0, 0, 0, 0.15)",
        dark: "rgba(255, 255, 255, 0.35)",
    });
    

    const theme:ITheme = {
        ...staticTheme,
        theme: {
            background: dynamicBackgroundColor,
            secondary: dynamicSecondaryColor,
            icon: dynamicIconColor,
            text: dynamicTextColor,
            grey: dynamicGreyColor
        }
    }
    return theme; 
};