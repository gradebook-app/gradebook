import { Product } from "react-native-iap";
import { combineReducers } from "redux";
import { EDefaultActions } from "../constants";
import { authReducer, IAuthReducer } from "./auth.reducer";
import settingsReducer, { ISettingsReducer } from "./settings.reducer";
import userReducer, { IUserReducer } from "./user.reducer";

export interface IRootReducer {
    auth: IAuthReducer;
    user: IUserReducer;
    default: IDefaultReducer,
    settings: ISettingsReducer,
}

interface IDefaultReducer {
    loading: boolean,
    donateProducts: Product[]
}

const initialState = {
    loading: false,
    donateProducts: []
};

const defaultReducer = (state:IDefaultReducer=initialState, action:any) => {
    switch(action.type) {
        case EDefaultActions.SET_LOADING: {
            return { ...state, loading: action.payload };
        }
        case EDefaultActions.SET_DONATE_PRODUCTS: {
            return { ...state, donateProducts: action.payload}
        }
        default: {
            return state; 
        }
    }
};

const reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    default: defaultReducer,
    settings: settingsReducer,
});

export { reducers };