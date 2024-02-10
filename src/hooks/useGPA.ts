import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
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

    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const hasGPAValue = useMemo(() => !!Object.keys(gpa).length, [ gpa ]);

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@gpa-${user?.studentId}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                Object.keys(cachedDataParsed).length && !hasGPAValue
            ) setGPA(cachedDataParsed);
        }
    }, [user?.studentId, hasGPAValue]);

    const getGPA = useCallback(async () => {
        if (!hasGPAValue) setCache();

        const response = await api.get(GET_GPA).catch((e) => {
            console.log(e);
        });
        
        if (response && Object.keys(response).length) {
            setLoading(false);
            setGPA(response);
            AsyncStorage.setItem(`@gpa-${user?.studentId}`, JSON.stringify(response));
        }
    }, [hasGPAValue, setCache, user?.studentId]);

    const reload = () => {
        setLoading(true);
        getGPA();
    };

    useEffect(() => {
        if (hasGPAValue) return; 
        setLoading(true);
        getGPA();
    }, [getGPA, hasGPAValue]);
    
    return { reload, loading, gpa };
};