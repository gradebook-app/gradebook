import store from "../store/index";
import config from "../../config";
import { getAccessToken } from "../store/selectors";
import { LOGIN_CLIENT } from "../constants/endpoints/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../store/actions/user.actions";
import { setSetAccessToken } from "../store/actions/auth.actions";
import messaging from "@react-native-firebase/messaging";

function retrieveAccessToken() {
    const state = store.getState();
    const accessToken = getAccessToken(state);
    return accessToken; 
}

function constructURL(endpoint:string):string {
    let url = config.api.url;
    if (endpoint.startsWith("/"))
        url += endpoint;
    else {
        url += `/${endpoint}`;
    }
    return url; 
}

export const revalidateClient = async (specifiedStudentId?:string) => {
    const credentials = await AsyncStorage.getItem("@credentials");
    let token = null; 
    try {
        const authStatus = await messaging().hasPermission();
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            token = await messaging().getToken();
        }
    } catch(e) {}

    if (credentials) {
        const data = JSON.parse(credentials);
        const response:any = await post(LOGIN_CLIENT, { 
            ...data, 
            notificationToken: 
            token,  
            studentId: specifiedStudentId
        });

        if (response && response?.access === true) {
            const user = response?.user;
            store.dispatch(setUser(user || {}));
            store.dispatch(setSetAccessToken(response.accessToken));
            return true;
        } else if (response && response?.access === false) {
            await AsyncStorage.clear();
            store.dispatch(setUser({}));
            store.dispatch(setSetAccessToken(null));
            return false; 
        }
    }
};

export const get = async (endpoint:string, controller?:AbortController,) => {
    const accessToken = retrieveAccessToken();

    let defaultOptions:RequestInit = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json"
        }
    };

    if (controller) defaultOptions = { signal: controller.signal, ...defaultOptions }; 

    const url = constructURL(endpoint);

    return await fetch(url, defaultOptions)
        .then(res => {
            if (res.status === 401) throw "expired";
            else return res.json();
        })
        .catch(async e => {
            if (e === "expired") {
                const hasAccess = await revalidateClient();
                if (hasAccess) {
                    (defaultOptions?.headers as any).Authorization = `Bearer ${retrieveAccessToken()}`;
                    return await fetch(url, defaultOptions).then(res => res.json()).catch(e => {
                        return null;
                    });
                }
            }
            else throw e;
        });
};

export const post = async <Body, >(endpoint:string, body?:any, controller?:AbortController) => {
    const accessToken = retrieveAccessToken();

    let defaultOptions:RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "Accept": "application/json"
        },
        mode: "cors",
        body: JSON.stringify((body || {}) as Body),
    };

    if (controller) defaultOptions = { signal: controller.signal, ...defaultOptions }; 

    const url = constructURL(endpoint);

    return await new Promise((resolve, _) => {
        fetch(url, defaultOptions)
            .then(res => {
                if (res.status === 401) throw "expired";
                let initialResponse = null; 

                try { initialResponse = res.json(); }
                catch (e) { initialResponse = null; } 
                finally { resolve(initialResponse); }
            })
            .catch(async (e:string) => {
                if (e === "expired") {
                    const hasAccess = await revalidateClient();
                    if (hasAccess) { 
                        (defaultOptions?.headers as any).Authorization= `Bearer ${retrieveAccessToken()}`;
                        const retry = await fetch(url, defaultOptions).then(res => res.json()).catch(e => {
                            return null;
                        });
                        resolve(retry);
                    }
                } else resolve(null); 
            });
    });
};