import { EUserActions } from "../constants/user.constants";
import { IUser } from "../interfaces/user.interface";

export interface IUserReducer {
    accessToken: string | null,
    user?: IUser,
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