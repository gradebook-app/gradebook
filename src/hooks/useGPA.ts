import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { GET_GPA } from "../constants/endpoints/grades";
import * as api from "../utils/api";
import { useSelector } from "react-redux";
import { IRootReducer } from "../store/reducers";
import { getUser } from "../store/selectors";

export interface IGPA {
    unweightedGPA?: number,
    weightedGPA?: number,
}

export const useGPA = () => {
    const [ loading, setLoading ] = useState(false);
    const [ gpa, setGPA ] = useState<IGPA>({});

    const controller = useRef(new AbortController()).current;
    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const setCache = async () => {
        const cache = await AsyncStorage.getItem(`@gpa-${user?.studentId}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                Object.keys(cachedDataParsed).length && !Object.keys(gpa).length
            ) setGPA(cachedDataParsed);
        }
    };

    const getGPA = useCallback(async () => {
        if (!Object.keys(gpa).length) setCache();

        if (!Object.keys(gpa).length) setLoading(true);

        const response = await api.get(GET_GPA, controller).catch(() => null);
        
        if (response && Object.keys(response).length) {
            setGPA(response);
            AsyncStorage.setItem(`@gpa-${user?.studentId}`, JSON.stringify(response));
        }
    }, []);

    const reload = () => {
        getGPA().finally(() => setLoading(false));
    };

    useEffect(() => {
        let mounted = true; 

        getGPA().finally(() => {
            if (mounted) setLoading(false);
        });

        return () => {
            controller.abort();
            mounted = false; 
        };
    }, [ getGPA ]);
    
    return { reload, loading, gpa };
};