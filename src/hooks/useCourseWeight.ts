import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../utils/api";
import { ECourseWeight } from "../store/enums/weights";
import { queryCourseWeight } from "../constants/endpoints/grades";

interface IUseCourseWeight { 
    courseId:string, 
    sectionId: string
}

export const useCourseWeight = ({ courseId, sectionId  }:IUseCourseWeight) => {
    const [ weight, setWeight ] = useState<ECourseWeight | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);
    const controller = useRef(new AbortController()).current;

    const getCourseWeight = useCallback(async () => {
        setLoading(true);

        const response = await api.get(
            queryCourseWeight(courseId, sectionId),
            controller,
        ).catch(() => {
            setLoading(false);
        });
        
        if (response) setLoading(false);

        const weight = response?.weight; 

        if (weight !== undefined) {
            setWeight(weight);
        }
    }, [ courseId, sectionId ]);

    const reload = () => {
        setLoading(true);
        getCourseWeight().finally(() => {
            setLoading(false);
        });     
    };

    const updateWeight = (newWeight:ECourseWeight) => {
        setWeight(newWeight);
    };

    useEffect(() => {
        getCourseWeight();
        return () => {
            setLoading(false);
            controller.abort();
        };
    }, [ getCourseWeight ]);

    return { loading, weight, reload, setWeight:updateWeight };
};
