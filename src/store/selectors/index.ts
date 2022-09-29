import { IRootReducer } from "../reducers";

export const getUser = (state:IRootReducer) => state.user.user;
export const getStateNotificationToken = (state:IRootReducer) => state.user.notificationToken;

export const getAccessToken = (state:IRootReducer) => state.auth.accessToken;
export const isAccessDenied = (state:IRootReducer) => state.auth.accessDenied;
export const isLoginError = (state:IRootReducer) => state.auth.loginError;
export const isLoading = (state:IRootReducer) => state.default.loading;

export const getDonateProducts = (state:IRootReducer) => state.default.donateProducts;