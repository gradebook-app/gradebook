import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { GET_ACCOUNT } from "../constants/endpoints/user";
import { IAccount } from "../store/interfaces/account.interface";
import * as api from "../utils/api";
import { useSelector } from "react-redux";
import { IRootReducer } from "../store/reducers";
import { getUser } from "../store/selectors";

export const useAccount = () => {
    const [ loading, setLoading ] = useState(false);
    const [ account, setAccount ] = useState<IAccount>({});

    const state = useSelector((state:IRootReducer) => state);
    const user = getUser(state);

    const setCache = async () => {
        const cache = await AsyncStorage.getItem(`@account-${user?.studentId}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                Object.keys(cachedDataParsed).length && !Object.keys(account).length
            ) setAccount(cachedDataParsed);
        }
    };

    const getAccount = useCallback(async () => {
        if (!Object.keys(account).length) setCache();

        if (!Object.keys(account).length) setLoading(true);

        const response = await api.get(GET_ACCOUNT);
        
        if (response && Object.keys(response).length) {
            setAccount(response);
            AsyncStorage.setItem(`@account-${user?.studentId}`, JSON.stringify(response));
        }
    }, [ user?.studentId ]);

    const reload = () => {
        setLoading(true);
        getAccount().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        let mounted = true; 
        getAccount().finally(() => {
            if (mounted) setLoading(false);
        });
        return () => {
            mounted = false; 
        };
    }, [ getAccount ]);

    return { reload, loading, account };
};