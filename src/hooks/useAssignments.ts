import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryAssignments } from "../constants/endpoints/assignments";
import { IAssignment } from "../store/interfaces/assignment.interface";
import * as api from "../utils/api";

interface IUseAssigments { 
    courseId:string, 
    sectionId: string
    markingPeriod: string,
}

export const useAssigments = ({ courseId, sectionId, markingPeriod  }:IUseAssigments) => {
    const [ assignments, setAssignments ] = useState<IAssignment[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    const setCache = useCallback(async () => {
        const data = await AsyncStorage.getItem(`@assignments-${courseId}-${sectionId}-${markingPeriod}`);
        if (data) {
            const { assignments:cachedAssignments } = JSON.parse(data);
            if (!assignments.length) {
                setAssignments(cachedAssignments);
            }
        }
    }, [ courseId, sectionId ]);

    const getAssignments = useCallback(async () => {
        if (!assignments.length) setCache();

        setLoading(true);

        console.log(markingPeriod);
        const response = await api.get(queryAssignments(courseId, sectionId, markingPeriod ));
        
        setLoading(false);

        const data = response?.assignments; 

        if (data && data.length) {
            setAssignments(data);

            AsyncStorage.setItem(`@assignments-${courseId}-${sectionId}-${markingPeriod}`, JSON.stringify({ assignments: data }));
        };
    }, [ courseId, sectionId ])

    const reload = () => {
        setLoading(true)
        getAssignments().finally(() => {
            setLoading(false);
        });     
    }

    useEffect(() => {
        getAssignments()
    }, [ getAssignments ]);

    return { assignments, loading, reload }
}
