import { EDefaultActions, ISetDonateProducts, ISetLoading } from "../constants";

export const setLoading = (loading:boolean) : ISetLoading => ({
    type: EDefaultActions.SET_LOADING,
    payload: loading,
});

export const setDonateProducts = (donateProducts:ISetDonateProducts["payload"]) : ISetDonateProducts => ({
    type: EDefaultActions.SET_DONATE_PRODUCTS,
    payload: donateProducts
}); 