import { ESchoolDistricts } from "../enums/school-districts.enum";

export enum EAuthActions {
    LOGIN_CLIENT = "LOGIN_CLIENT",
    LOGOUT_CLIENT = "LOGOUT_CLIENT",
    SET_ACCESS_DENIED = "SET_ACCESS_DENIED",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN",
    LOGIN_ERROR = "LOGIN_ERROR",
}

export interface ILoginClient {
    type: EAuthActions.LOGIN_CLIENT,
    payload: {
        userId: string,
        pass: string,
        schoolDistrict: ESchoolDistricts,
        notificationToken: string | null,
    }
}

export interface ILogoutClient {
    type: EAuthActions.LOGOUT_CLIENT,
    payload: { userId: string },
}

export interface ISetAccessDenied {
    type: EAuthActions.SET_ACCESS_DENIED,
    payload: boolean,
}

export interface ISetAccessToken {
    type: EAuthActions.SET_ACCESS_TOKEN,
    payload: string | null
}

export interface ISetLoginError {
    type: EAuthActions.LOGIN_ERROR,
    payload: boolean,
}