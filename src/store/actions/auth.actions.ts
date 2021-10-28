import { EAuthActions, ILoginClient, ISetAccessToken } from "../constants/auth.constants";

export const setLoginClient = ({ userId, pass } : any) : ILoginClient => ({
    type: EAuthActions.LOGIN_CLIENT,
    payload: {
        userId,
        pass,
    }
})

export const setSetAccessToken = (accessToken: string) : ISetAccessToken => ({
    type: EAuthActions.SET_ACCESS_TOKEN,
    payload: accessToken,
})