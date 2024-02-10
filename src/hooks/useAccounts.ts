import { useCallback, useEffect, useState } from "react";
import * as api from "../utils/api";
import { GET_ALL_ACCOUNTS } from "../constants/endpoints/user";

export interface IGeneralUserAccount { 
    studentId:string, 
    name: string
}

export const useAccounts = () => {
    const [ accounts, setAccounts ] = useState<IGeneralUserAccount[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);

    const getAccounts = useCallback(async () => {
        setLoading(true);

        const response = await api.get(
            GET_ALL_ACCOUNTS,
        ).catch(() => {
            setLoading(false);
        });
        
        setLoading(false);

        const queriedAccounts = response?.accounts || [];

        if (queriedAccounts.length) {
            setAccounts(queriedAccounts);
        }
    }, []);

    const reload = () => {
        getAccounts().finally(() => {
            setLoading(false);
        });     
    };

    useEffect(() => {
        getAccounts();
        return () => {
            setLoading(false);
        };
    }, [getAccounts]);

    return { loading, accounts, reload };
};
