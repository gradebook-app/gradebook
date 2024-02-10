import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
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

    const accountHasValue = useMemo(() => !!Object.keys(account).length, [ account ]);

    const setCache = useCallback(async () => {
        const cache = await AsyncStorage.getItem(`@account-${user?.studentId}`);
        if (cache) {
            const cachedDataParsed = JSON.parse(cache);
            if (
                Object.keys(cachedDataParsed).length && !accountHasValue
            ) setAccount(cachedDataParsed);
        }
    }, [accountHasValue, user?.studentId]);

    const getAccount = useCallback(async () => {
        if (!accountHasValue) setCache();
        if (!accountHasValue) setLoading(true);

        const response = await api.get(GET_ACCOUNT);
        
        if (response && Object.keys(response).length) {
            setAccount(response);
            setLoading(false);
            AsyncStorage.setItem(`@account-${user?.studentId}`, JSON.stringify(response));
        }
    }, [accountHasValue, setCache, user?.studentId]);

    const reload = () => {
        setLoading(true);
        getAccount();
    };

    useEffect(() => {
        getAccount();
    }, [ getAccount, accountHasValue ]);

    return { reload, loading, account };
};