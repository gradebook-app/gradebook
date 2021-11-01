import { EAuthActions } from "../constants/auth.constants";

export interface IAuthReducer {
    accessToken: string | null,
    accessDenied: boolean,
}

const initialState = {
    accessToken: null,
    accessDenied: false,
}

const authReducer = (state:IAuthReducer=initialState, action:any) => {
    switch(action.type) {
        case EAuthActions.SET_ACCESS_TOKEN: {
            return { ...state, accessToken: action.payload }
        }

        case EAuthActions.SET_ACCESS_DENIED: {
            return { ...state, accessDenied: action.payload }
        }


        default: {
            return state; 
        }
    }
}

export { authReducer };