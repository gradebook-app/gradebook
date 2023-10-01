import { IRootReducer } from "../reducers";

const getUserId = (state:IRootReducer) => state.user.user?._id;
const getShownAlert = (state:IRootReducer) => state.user.shownAlert2_0;
const getShownSaveBanner = (state:IRootReducer) => state.user.shownSaveBanner;
const getIsUpdatingCourseWeight = (state:IRootReducer) => state.user.updatingCourseWeight;

export { getUserId, getShownAlert, getShownSaveBanner, getIsUpdatingCourseWeight };