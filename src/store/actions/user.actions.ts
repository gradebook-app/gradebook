import { EUserActions, ISetNotificationToken, ISetUser } from "../constants/user.constants";

export const setShownAlert = (payload:boolean) => ({
    type: EUserActions.SET_SHOWN_ALERT,
    payload,
});

export const setUser = (payload:any) : ISetUser => ({
    type: EUserActions.SET_USER,
    payload,
});

export const setNotificationToken = (payload:string | null) : ISetNotificationToken => ({
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload,
});