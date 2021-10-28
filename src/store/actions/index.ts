import { EDefaultActions, ISetLoading } from "../constants";


export const setLoading = (loading:boolean) : ISetLoading => ({
    type: EDefaultActions.SET_LOADING,
    payload: loading,
});