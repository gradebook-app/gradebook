import { useEffect, useState } from "react";
import { Appearance, Platform } from "react-native";


export const useAppearanceTheme = () => {
    const [ isDark, setIsDark ] = useState<boolean>(Appearance.getColorScheme() === "dark");

    const listener = (_:any) => {
        setIsDark(Appearance.getColorScheme() === "dark");
    };

    useEffect(() => {
        Appearance.addChangeListener(listener);
        return () => Appearance.removeChangeListener(listener);
    }, []);

    return { isDark: Platform.OS === "ios" ? isDark : true };
};