import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { GET_GPA, GET_PAST_GPA } from "../constants/endpoints/grades";
import * as api from "../utils/api";

export interface IGPAPast {
    gradeLevel: number,
    unweightedGPA: number,
    weightedGPA: number,
    year: string,
}

export const usePastGPA = () => {
    const [ loading, setLoading ] = useState(false);
    const [ pastGPA, setPastGPA ] = useState<IGPAPast[]>([]);
    const controller = useRef(new AbortController()).current; 

    const setCache = async () => {
        const cache = await AsyncStorage.getItem("@gpaPast");
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                cachedDataParsed?.pastGradePointAverages?.length && !pastGPA.length
            ) setPastGPA(cachedDataParsed.pastGradePointAverages);
        }
    };

    const getPastGPA = useCallback(async () => {
        if (!pastGPA.length) setCache();

        if (!pastGPA.length) setLoading(true);

        const response = await api.get(GET_PAST_GPA, controller).catch(_ => null);
        
        if (response && response?.pastGradePointAverages?.length) {
            setPastGPA(response.pastGradePointAverages);
            AsyncStorage.setItem("@gpaPast", JSON.stringify(response));
        }
    }, []);

    const reload = () => {
        getPastGPA().finally(() => setLoading(false));
    };

    useEffect(() => {
        let mounted = true; 
        getPastGPA().finally(() => {
            if (mounted) setLoading(false);
        });

        return () => {
            controller.abort();
            mounted = false; 
        };
    }, [ getPastGPA ]);

    return { reload, loading, pastGPA };
};