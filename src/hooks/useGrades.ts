import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { queryGrades } from "../constants/endpoints/grades";
import { ICourse } from "../store/interfaces/course.interface";
import * as api from "../utils/api";

interface IResponse {
    courses: ICourse[],
    markingPeriods: string[],
    currentMarkingPeriod: string
}

export const useGrades = ({ markingPeriod } : { markingPeriod: string }) => {
    const [ data, setData ] = useState<IResponse>({
        courses: [],
        markingPeriods: [],
        currentMarkingPeriod: "",
    });
    const [ loading, setLoading ] = useState<boolean>(false);

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@courses-${markingPeriod}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                !data.courses.length ||
                 data.currentMarkingPeriod !== markingPeriod
            ) setData(cachedDataParsed);
        }
    }, [ markingPeriod, data ]); 

    const getGrades = useCallback(async () => {
        if (
            !data.courses.length ||
            data.currentMarkingPeriod !== markingPeriod
        ) setCache();

        setLoading(true);

        const response = await api.get(queryGrades(markingPeriod));

        setLoading(false);

        const { courses = [], markingPeriods = [], currentMarkingPeriod = ""} = response;

        if (courses.length) {
            const responseData = { courses, markingPeriods, currentMarkingPeriod };
            setData(responseData);
            AsyncStorage.setItem(`@courses-${currentMarkingPeriod}`, JSON.stringify(responseData));
        }
    }, [ markingPeriod ]);

    const reload = () => {
        setLoading(true);
        getGrades().finally(() => {
            setLoading(false);
        });     
    };

    useEffect(() => {
        getGrades();
    }, [ getGrades ]);

    return { ...data, loading, reload };
};
