export enum EDefaultActions {
    SET_LOADING = "SET_LOADING"
}

export interface ISetLoading {
    type: EDefaultActions.SET_LOADING,
    payload: boolean,
}