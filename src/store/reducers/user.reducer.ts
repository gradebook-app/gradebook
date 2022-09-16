import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, PURGE } from "redux-persist";
import { EUserActions } from "../constants/user.constants";
import { IAction } from "../interfaces/action.interface";
import { IUser } from "../interfaces/user.interface";

export interface IUserReducer {
    accessToken: string | null,
    user?: IUser,
    notificationToken: null | string,
    shownAlert1_5: boolean,
    shownSaveBanner: boolean,
}

const persistConfig = {
    key: 'user',
    storage: AsyncStorage,
    whitelist: [ 'user', 'shownAlert1_5', 'shownSaveBanner' ]
};


const initialState = {
    accessToken: null,
    notificationToken: null,
    shownAlert1_5: false,
    shownSaveBanner: false
};

const userReducer = (state:IUserReducer=initialState, action:IAction) => {
    switch(action.type) {
    case EUserActions.SET_SHOWN_ALERT_1_5: {
        return { ...state, shownAlert1_5: action.payload };
    }

    case EUserActions.SET_SHOWN_SAVE_BANNER: {
        return { ...state, shownSaveBanner: action.payload };
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