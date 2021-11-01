import { useCallback, useEffect, useState } from "react"
import { Appearance } from "react-native";


export const useAppearanceTheme = () => {
    const [ isDark, setIsDark ] = useState<boolean>(Appearance.getColorScheme() === 'dark');
    
    const handleThemeChange = useCallback(() => {
        Appearance.addChangeListener((e) => {
            setIsDark(e.colorScheme === 'dark');
        });
    }, []);

    useEffect(handleThemeChange, [ handleThemeChange ]);

    return { isDark };
}