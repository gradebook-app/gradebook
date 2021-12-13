import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISettingsReducer } from "../store/reducers/settings.reducer";

export const useSettings = () => {
    const [ cacheInjected, setCacheInjected ] = useState(false);

    const [ settings, setSettings ] = useState<ISettingsReducer>({
        biometricsEnabled: false,
        savePassword: true,
        limitAds: false,
    });

    const insertCache = useCallback(async () => {
        if (cacheInjected) return; 

        const cache = await AsyncStorage.getItem("@settings");
        const cachedSettings = cache ? JSON.parse(cache) : null;
        if (!cachedSettings) {
            setCacheInjected(true);
            return; 
        } else {
            setSettings(cachedSettings);
        }
        setCacheInjected(true);
    }, [ cacheInjected ]);

    const handleUpdateSettings = useCallback(async (key:keyof ISettingsReducer, value:any) => {
        setSettings({ ...settings, [ key ]: value });

        const cache = await AsyncStorage.getItem("@settings");
        const updatedSettings = cache ? JSON.parse(cache) : {};
        AsyncStorage.setItem("@settings", JSON.stringify({ ...updatedSettings, [ key ]: value }));
    }, [ settings ]);

    useEffect(() => {
        insertCache();
    }, [ insertCache ]);

    return { settings, updateSettings:handleUpdateSettings, cacheInjected };
};