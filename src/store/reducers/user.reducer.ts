import { EUserActions } from "../constants/user.constants";

export interface IUserReducer {
    accessToken: string | null,
    user?: {
        _id: string,
        notificationToken: string,
    }
}

const initialState = {
    accessToken: null,
}

const userReducer = (state:IUserReducer=initialState, action:any) => {
    switch(action.type) {
        case EUserActions.SET_USER: {
            return { ...state, user: action.payload }
        }

        default: {
            return state; 
        }
    }
}

export { userReducer };