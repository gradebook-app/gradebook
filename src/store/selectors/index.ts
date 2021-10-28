import { IRootReducer } from "../reducers";

export const isLoading = (state:IRootReducer) => state.default.loading;
export const getAccessToken = (state:IRootReducer) => state.auth.accessToken;