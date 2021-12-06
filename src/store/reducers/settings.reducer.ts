import AsyncStorage from "@react-native-async-storage/async-storage";
import persistReducer from "redux-persist/es/persistReducer";
import { ESettingsActions } from "../constants/settings.interface";
import { IAction } from "../interfaces/action.interface";

export interface ISettingsReducer {
    biometricsEnabled: boolean,
    savePassword: boolean,
    limitAds: boolean,
}

const persistConfig = {
    key: 'settings',
    storage: AsyncStorage,
};

const initialState:ISettingsReducer = {
    biometricsEnabled: false,
    limitAds: false,
    savePassword: true,
}

const settingsReducer = (state:ISettingsReducer = initialState, action:IAction) : ISettingsReducer => {
    switch (action.type) {
        case ESettingsActions.SET_BIOMETRICS_ENABLED: {
            return { ...state, biometricsEnabled: action.payload }
        }
        case ESettingsActions.SET_LIMIT_ADS: {
            return { ...state, limitAds: action.payload }
        }
        case ESettingsActions.SET_SAVE_PASSWORD: {
            return { ...state, savePassword: action.payload }
        }
        default: {
            return state; 
        }
    }
};

const settingsReducerPersisted = persistReducer(persistConfig, settingsReducer);

export default settingsReducerPersisted; 