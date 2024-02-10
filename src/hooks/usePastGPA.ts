import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GET_PAST_GPA } from "../constants/endpoints/grades";
import * as api from "../utils/api";
import { useSelector } from "react-redux";
import { IRootReducer } from "../store/reducers";
import { getUser } from "../store/selectors";

export interface IGPAPast {
    gradeLevel: number,
    unweightedGPA: number,
    weightedGPA: number,
    year: string,
}

export const usePastGPA = () => {
    const [ loading, setLoading ] = useState(false);
    const [ pastGPA, setPastGPA ] = useState<{
        pastGPAs: IGPAPast[], value: boolean
    }>({ pastGPAs: [], value: false });

    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@gpaPast-${user?.studentId}`);
       
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                cachedDataParsed?.pastGradePointAverages?.length && !pastGPA.pastGPAs?.length
            ) setPastGPA({pastGPAs: cachedDataParsed.pastGradePointAverages, value: true});
        }
    }, [pastGPA.pastGPAs?.length, user?.studentId]);

    const getPastGPA = useCallback(async () => {
        setCache();

        const response = await api.get(GET_PAST_GPA).catch(_ => null);
        if (response && response?.pastGradePointAverages) {
            setLoading(false);
            setPastGPA({ pastGPAs: response.pastGradePointAverages, value: true });
            AsyncStorage.setItem(`@gpaPast-${user?.studentId}`, JSON.stringify(response));
        }
    }, [setCache, user?.studentId]);

    const reload = () => {
        setLoading(true);
        getPastGPA();
    };

    useEffect(() => {
        if (pastGPA.pastGPAs?.length || pastGPA.value) return; 
        setLoading(true);
        getPastGPA();
    }, [getPastGPA, pastGPA.pastGPAs?.length, pastGPA.value]);


    return { reload, loading, pastGPA: pastGPA.pastGPAs || [] };
};