import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "../utils/api";
import { ISchedule } from "../store/interfaces/schedule.interface";
import { getScheduleEndpoint } from "../constants/endpoints/user";
import moment from "moment";
import { useSelector } from "react-redux";
import { IRootReducer } from "../store/reducers";
import { getUser } from "../store/selectors";

interface IUseSchedule {
    dateSelected: string,
}

export const useSchedule = ({ dateSelected }:IUseSchedule) => {
    const [ schedule, setSchedule ] = useState<ISchedule>({} as ISchedule);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ fetching, setFetching ] = useState<boolean>(false);

    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const dateParameter = useMemo(() => moment(dateSelected).format("L"), [ dateSelected ]);

    const getSchedule = useCallback(async () => {
        const response = await api.get(getScheduleEndpoint(dateParameter)).catch(() => null);

        if (response && Object.keys(response).length && user?.studentId) {
            setSchedule(response);
        } else setSchedule({});
    }, [ dateParameter, user?.studentId ]);

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
