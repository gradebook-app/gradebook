import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { EUserActions } from "../constants/user.constants";
import { IAction } from "../interfaces/action.interface";
import { IUser } from "../interfaces/user.interface";

export interface IUserReducer {
    accessToken: string | null,
    user?: IUser,
    notificationToken: null | string,
    shownAlert2_0: boolean,
    shownSaveBanner: boolean,
    updatingCourseWeight: boolean; 
    seenInterstitial: boolean; 
}

const persistConfig = {
    key: "user",
    storage: AsyncStorage,
    whitelist: [ "user", "shownAlert2_0", "shownSaveBanner" ]
};


const initialState = {
    accessToken: null,
    notificationToken: null,
    shownAlert2_0: false,
    shownSaveBanner: false,
    updatingCourseWeight: false,
    seenInterstitial: false
};

const userReducer = (state:IUserReducer=initialState, action:IAction) => {
    switch(action.type) {
    case EUserActions.SET_SHOWN_ALERT_2_0: {
        return { ...state, shownAlert2_0: action.payload };
    }

    case EUserActions.SET_SEEN_INTERSTITIAL: {
        return { ...state, seenInterstitial: action.payload };
    }

    case EUserActions.SET_UPDATING_COURSE_WEIGHT: {
        return { ...state, updatingCourseWeight: action.payload};
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