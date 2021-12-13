import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { EUserActions } from "../constants/user.constants";
import { IAction } from "../interfaces/action.interface";
import { IUser } from "../interfaces/user.interface";

export interface IUserReducer {
    accessToken: string | null,
    user?: IUser,
    notificationToken: null | string,
    shownAlert: boolean,
}

const persistConfig = {
    key: 'user',
    storage: AsyncStorage,
    whitelist: [ 'user', 'shownAlert' ]
};


const initialState = {
    accessToken: null,
    notificationToken: null,
    shownAlert: false,
};

const userReducer = (state:IUserReducer=initialState, action:IAction) => {
    switch(action.type) {
    case EUserActions.SET_SHOWN_ALERT: {
        return { ...state, shownAlert: action.payload };
    }

    case EUserActions.SET_USER: {
        return { ...state, user: action.payload };
    }

    case EUserActions.SET_NOTIFICATION_TOKEN: {
        return { ...state, notificationToken: action.payload };
    }

    default: {
        return state; 
    }
    }
};

const userReducerPersisted = persistReducer(persistConfig, userReducer);

export default userReducerPersisted;