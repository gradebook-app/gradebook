import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryAssignments } from "../constants/endpoints/assignments";
import { IAssignment } from "../store/interfaces/assignment.interface";
import * as api from "../utils/api";
import { ISchedule } from "../store/interfaces/schedule.interface";
import { getScheduleEndpoint } from "../constants/endpoints/user";
import moment from "moment";

interface IUseSchedule {
    dateSelected: string,
}

export const useSchedule = ({ dateSelected }:IUseSchedule) => {
    const [ schedule, setSchedule ] = useState<ISchedule>({} as ISchedule);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ fetching, setFetching ] = useState<boolean>(false);

    // const setCache = useCallback(async () => {
    //     const data = await AsyncStorage.getItem(`@assignments-${courseId}-${sectionId}-${markingPeriod}`);
    //     if (data) {
    //         const { assignments:cachedAssignments } = JSON.parse(data);
    //         if (!assignments.length) {
    //             setAssignments(cachedAssignments);
    //         }
    //     }
    // }, [ courseId, sectionId ]);

    const dateParameter = useMemo(() => moment(dateSelected).format("L"), [ dateSelected ]);

    const getSchedule = useCallback(async () => {
        
        // if (!assignments.length) setCache();
        const response = await api.get(getScheduleEndpoint(dateParameter));

        if (response && Object.keys(response).length) {
            setSchedule(response);
            // AsyncStorage.setItem(`@assignments-${courseId}-${sectionId}-${markingPeriod}`, JSON.stringify({ assignments: data }));
        } else setSchedule({});
    }, [ dateParameter ]);

    const reload = () => {
        setLoading(true);
        getSchedule().finally(() => {
            setLoading(false);
        });     
    };

    useEffect(() => {
        setFetching(true);
        getSchedule().finally(() => {
            setFetching(false);
        });
    }, [ getSchedule ]);

    return { schedule, reload, loading, fetching };
};
