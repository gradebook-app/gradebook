import { Product } from "react-native-iap";

export enum EDefaultActions {
    SET_LOADING = "SET_LOADING",
    SET_DONATE_PRODUCTS = "SET_DONATE_PRODUCTS"
}

export interface ISetLoading {
    type: EDefaultActions.SET_LOADING,
    payload: boolean,
}

export interface ISetDonateProducts {
    type: EDefaultActions.SET_DONATE_PRODUCTS,
    payload: Product[]
}