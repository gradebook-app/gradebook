import store from "../store/index";
import config from "../../config";

//const state = store.getState();

function constructURL(endpoint:string):string {
    let url = config.api.url;
    if (endpoint.startsWith('/'))
        url += endpoint
    else {
        url += `/${endpoint}`;
    }
    return url; 
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