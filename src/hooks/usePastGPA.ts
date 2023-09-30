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

    const hasGPAValue = useMemo(() => pastGPA.value, [ pastGPA ]);

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@gpaPast-${user?.studentId}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                cachedDataParsed?.pastGradePointAverages?.length && !hasGPAValue
            ) setPastGPA(cachedDataParsed.pastGradePointAverages);
        }
    }, [hasGPAValue, user?.studentId]);

    const getPastGPA = useCallback(async () => {
        if (!hasGPAValue) setCache();

        const response = await api.get(GET_PAST_GPA).catch(_ => null);
        if (response && response?.pastGradePointAverages) {
            setLoading(false);
            setPastGPA({ pastGPAs: response.pastGradePointAverages, value: true });
            AsyncStorage.setItem(`@gpaPast-${user?.studentId}`, JSON.stringify(response));
        }
    }, [hasGPAValue, setCache, user?.studentId]);

    const reload = () => {
        setLoading(true);
        getPastGPA();
    };

    useEffect(() => {
        if (hasGPAValue) return; 
        setLoading(true);
        getPastGPA();
    }, [ getPastGPA, hasGPAValue ]);

    return { reload, loading, pastGPA: pastGPA.pastGPAs || [] };
};