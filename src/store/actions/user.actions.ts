import { EUserActions, ISetNotificationToken, ISetUser } from "../constants/user.constants";

export const setUser = (payload:any) : ISetUser => ({
    type: EUserActions.SET_USER,
    payload,
});

export const setNotificationToken = (payload:string) : ISetNotificationToken => ({
    type: EUserActions.SET_NOTIFICATION_TOKEN,
    payload,
})