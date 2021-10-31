export enum EAuthActions {
    LOGIN_CLIENT = "LOGIN_CLIENT",
    SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN"
}

export interface ILoginClient {
    type: EAuthActions.LOGIN_CLIENT,
    payload: {
        userId: string,
        pass: string
    }
}

export interface ISetAccessToken {
    type: EAuthActions.SET_ACCESS_TOKEN,
    payload: string | null
}