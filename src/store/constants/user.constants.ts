export enum EUserActions {
    SET_USER = "SET_USER",
    SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN",
    SET_SHOWN_ALERT_1_5 = "SET_SHOWN_ALERT_1_5",
    SET_SHOWN_SAVE_BANNER = "SET_SHOWN_SAVE_BANNER",
    USER_PURGE_CACHE = "USER_PURGE_CACHE"
}

export interface ISetShownAlert {
    type: EUserActions.SET_SHOWN_ALERT_1_5,
    payload: boolean,
}

export interface ISetSaveBanner {
    type: EUserActions.SET_SHOWN_SAVE_BANNER,
    payload: boolean,
}

export interface ISetUser {
    type: EUserActions.SET_USER,
    payload: any
}

export interface ISetNotificationToken {
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload: string | null,
}

export interface IUserPurgeCache {
    type: EUserActions.USER_PURGE_CACHE,
    payload: {
        result?: Function
    }
}