import { IRootReducer } from "../reducers";

export const isLoading = (state:IRootReducer) => state.default.loading;
export const getAccessToken = (state:IRootReducer) => state.auth.accessToken;
export const isAccessDenied = (state:IRootReducer) => state.auth.accessDenied;
export const getUser = (state:IRootReducer) => state.user.user;
export const getStateNotificationToken = (state:IRootReducer) => state.user.notificationToken;