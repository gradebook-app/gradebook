import store from "../store/index";
import config from "../../config";
import { getAccessToken } from "../store/selectors";

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

export const get = async (endpoint:string) => {
    const accessToken = retrieveAccessToken();

    const defaultOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };

    const url = constructURL(endpoint);

    return await fetch(url, defaultOptions)
        .then(res => res.json())
        .catch(e => e);
}

export const post = async (endpoint:string, body?:any) => {
    const defaultOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body || {}),
    };

    const url = constructURL(endpoint);

    return await fetch(url, defaultOptions)
        .then(res => res.json())
        .catch(e => e);
}