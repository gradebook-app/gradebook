import { EAuthActions, ILoginClient, ILogoutClient, ISetAccessDenied, ISetAccessToken, ISetLoginError } from "../constants/auth.constants";

export const setLoginClient = ({ userId, pass, schoolDistrict, notificationToken } : any) : ILoginClient => ({
    type: EAuthActions.LOGIN_CLIENT,
    payload: {
        userId,
        pass,
        schoolDistrict,
        notificationToken
    }
});

export const setLogoutClient = (payload: { userId: string }) : ILogoutClient => ({
    type: EAuthActions.LOGOUT_CLIENT,
    payload,
});

export const setAccessDenied= (denied:boolean) : ISetAccessDenied => ({
    type: EAuthActions.SET_ACCESS_DENIED,
    payload: denied,
});

export const setSetAccessToken = (accessToken: string | null) : ISetAccessToken => ({
    type: EAuthActions.SET_ACCESS_TOKEN,
    payload: accessToken,
});

export const setLoginError = (error:boolean) : ISetLoginError => ({
    type: EAuthActions.LOGIN_ERROR,
    payload: error,
});