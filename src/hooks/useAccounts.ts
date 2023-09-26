import { useCallback, useEffect, useRef, useState } from "react";
import * as api from "../utils/api";
import { GET_ALL_ACCOUNTS } from "../constants/endpoints/user";

export interface IGeneralUserAccount { 
    studentId:string, 
    name: string
}

export const useAccounts = () => {
    const [ accounts, setAccounts ] = useState<IGeneralUserAccount[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const controller = useRef(new AbortController()).current;

    const getAccounts = useCallback(async () => {
        setLoading(true);

        const response = await api.get(
            GET_ALL_ACCOUNTS,
            controller,
        ).catch(() => {
            setLoading(false);
        });
        
        if (response) setLoading(false);

        const queriedAccounts = response?.accounts; 

        if (queriedAccounts.length) {
            setAccounts(queriedAccounts);
        }
    }, []);

    const reload = () => {
        setLoading(true);
        getAccounts().finally(() => {
            setLoading(false);
        });     
    };

    useEffect(() => {
        getAccounts();
        return () => {
            setLoading(false);
            controller.abort();
        };
    }, [ getAccounts ]);

    return { loading, accounts, reload };
};
