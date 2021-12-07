export enum EUserActions {
    SET_USER = "SET_USER",
    SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN",
    SET_SHOWN_ALERT = "SET_SHOWN_ALERT",
}

export interface ISetShownAlert {
    type: EUserActions.SET_SHOWN_ALERT,
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