import { EUserActions } from "../constants/user.constants";
import { IUser } from "../interfaces/user.interface";

export interface IUserReducer {
    accessToken: string | null,
    user?: IUser,
    notificationToken: null | string,
}

const initialState = {
    accessToken: null,
    notificationToken: null,
}

const userReducer = (state:IUserReducer=initialState, action:any) => {
    switch(action.type) {
        case EUserActions.SET_USER: {
            return { ...state, user: action.payload }
        }

        case EUserActions.SET_NOTIFICATION_TOKEN: {
            return { ...state, notificationToken: action.payload }
        }

        default: {
            return state; 
        }
    }
}

export { userReducer };