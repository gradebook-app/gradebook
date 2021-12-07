import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { EAuthActions } from "../constants/auth.constants";
import { ESchoolDistricts } from "../enums/school-districts.enum";
import { IAction } from "../interfaces/action.interface";

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    whitelist: [ 'email', 'pass', 'schoolDistrict' ]
};

export interface IAuthReducer {
    accessToken: string | null,
    accessDenied: boolean,
    loginError: boolean,
    email: string | null,
    pass: string | null,
    schoolDistrict: ESchoolDistricts | null,
}

const initialState = {
    accessToken: null,
    accessDenied: false,
    loginError: false,
    email: null,
    pass: null,
    schoolDistrict: null,
};

const authReducer = (state:IAuthReducer=initialState, action:IAction) : IAuthReducer => {
    switch(action.type) {
        case EAuthActions.LOGIN_CLIENT: {
            return { 
                ...state, 
                email: action.payload?.userId, 
                pass: action.payload?.pass,
                schoolDistrict: action.payload?.schoolDistrict,
            }
        }
        case EAuthActions.SET_ACCESS_TOKEN: {
            return { ...state, accessToken: action.payload };
        }
        case EAuthActions.SET_ACCESS_DENIED: {
            return { ...state, accessDenied: action.payload };
        }
        case EAuthActions.LOGIN_ERROR: {
            return { ...state, loginError: action.payload };
        }  
            
        default: {
            return state; 
        }
    }
};

const authReducerPersisted = persistReducer(persistConfig, authReducer);
export default authReducerPersisted; 