import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react"
import { GET_GPA } from "../constants/endpoints/grades";
import * as api from "../utils/api";

export interface IGPA {
    unweightedGPA?: number,
    weightedGPA?: number,
}

export const useGPA = () => {
    const [ loading, setLoading ] = useState(false);
    const [ gpa, setGPA ] = useState<IGPA>({});

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@gpa`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                Object.keys(cachedDataParsed).length && !Object.keys(gpa).length
            ) setGPA(cachedDataParsed);
        }
    }, [ gpa ]); 

    const getGPA = useCallback(async () => {
        if (!Object.keys(gpa).length) setCache();

        if (!Object.keys(gpa).length) setLoading(true);

        const response = await api.get(GET_GPA);
        
        if (response && Object.keys(response).length) {
            setGPA(response);
            AsyncStorage.setItem(`@gpa`, JSON.stringify(response));
        }
    }, []);

    const reload = () => {
        getGPA().finally(() => setLoading(false));
    };

    useEffect(() => {
        getGPA().finally(() => setLoading(false));
    }, [ getGPA ]);

    return { reload, loading, gpa }
}