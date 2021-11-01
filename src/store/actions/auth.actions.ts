import { EAuthActions, ILoginClient, ISetAccessDenied, ISetAccessToken } from "../constants/auth.constants";

export const setLoginClient = ({ userId, pass, schoolDistrict } : any) : ILoginClient => ({
    type: EAuthActions.LOGIN_CLIENT,
    payload: {
        userId,
        pass,
        schoolDistrict
    }
})

export const setAccessDenied= (denied:boolean) : ISetAccessDenied => ({
    type: EAuthActions.SET_ACCESS_DENIED,
    payload: denied,
})

export const setSetAccessToken = (accessToken: string | null) : ISetAccessToken => ({
    type: EAuthActions.SET_ACCESS_TOKEN,
    payload: accessToken,
})