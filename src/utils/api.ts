import store from "../store/index";
import config from "../../config";
import { getAccessToken } from "../store/selectors";
import { LOGIN_CLIENT } from "../constants/endpoints/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasNotificationPermission } from "./notification";
import * as Notifications from "expo-notifications"
import { setUser } from "../store/actions/user.actions";
import { setSetAccessToken } from "../store/actions/auth.actions";

function retrieveAccessToken() {
    const state = store.getState()
    const accessToken = getAccessToken(state);
    return accessToken; 
}

function constructURL(endpoint:string):string {
    let url = config.api.url;
    if (endpoint.startsWith('/'))
        url += endpoint
    else {
        url += `/${endpoint}`;
    }
    return url; 
}

const revalidateClient = async () => {
    const credentials = await AsyncStorage.getItem("@credentials");
    let token = null; 
    try {
        const hasPermission = await hasNotificationPermission()
        if (hasPermission) {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        };
    } catch(e) {};

    if (credentials) {
        const data = JSON.parse(credentials);
        const response = await post(LOGIN_CLIENT, { ...data, notificationToken: token });

        if (response && response?.access === true) {
            const user = response?.user
            store.dispatch(setUser(user || {}))
            store.dispatch(setSetAccessToken(response.accessToken));
            return true;
        } else if (response && response?.access === false) {
            await AsyncStorage.clear();
            store.dispatch(setUser({}));
            store.dispatch(setSetAccessToken(null));
            return false; 
        }
    }
}

export const get = async (endpoint:string) => {
    const accessToken = retrieveAccessToken();

    let defaultOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };

    const url = constructURL(endpoint);

    return await fetch(url, defaultOptions)
        .then(res => {
            if (res.status === 401) throw "expired"
            else return res.json();
        })
        .catch(async e => {
            if (e === 'expired') {
                const hasAccess = await revalidateClient();
                if (hasAccess) {
                    defaultOptions.headers.Authorization = `Bearer ${retrieveAccessToken()}`;
                    return await fetch(url, defaultOptions).then(res => res.json()).catch(e => {
                        return null;
                    });
                }
            }
            return {};
        });
}

export const post = async (endpoint:string, body?:any) => {
    const accessToken = retrieveAccessToken();

    let defaultOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(body || {}),
    };

    const url = constructURL(endpoint);

    return await fetch(url, defaultOptions)
        .then(res => {
            console.log(res.status);
            if (res.status === 401) throw 'expired';
            else return res.json()
        })
        .catch(async e => {
            if (e === 'expired') {
                const hasAccess = await revalidateClient();
                if (hasAccess) { 
                    defaultOptions.headers.Authorization = `Bearer ${retrieveAccessToken()}`;
                    return await fetch(url, defaultOptions).then(res => res.json()).catch(e => {
                        return null;
                    });
                }
            }
            return {};
        });
}