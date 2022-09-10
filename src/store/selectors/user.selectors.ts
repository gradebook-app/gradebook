import { IRootReducer } from "../reducers";

const getUserId = (state:IRootReducer) => state.user.user?._id;
const getShownAlert = (state:IRootReducer) => state.user.shownAlert1_5;
const getShownSaveBanner = (state:IRootReducer) => state.user.shownSaveBanner;

export { getUserId, getShownAlert, getShownSaveBanner };