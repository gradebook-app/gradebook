export enum EUserActions {
    SET_USER = "SET_USER",
    SET_NOTIFICATION_TOKEN = "SET_NOTIFICATION_TOKEN"
}

export interface ISetUser {
    type: EUserActions.SET_USER,
    payload: any
}

export interface ISetNotificationToken {
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload: string,
}