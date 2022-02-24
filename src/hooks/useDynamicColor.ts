import React from "react";
import { DynamicColorIOS, Platform } from "react-native";
import { useAppearanceTheme } from "./useAppearanceTheme";

interface IDynamicColors { 
    light: string; 
    dark: string; 
}

export const useDynamicColor = ({ light, dark } : IDynamicColors) => {
    if (Platform.OS === "ios") return DynamicColorIOS({ dark, light });

    const { isDark } = useAppearanceTheme();
    return isDark ? dark : light; 
}