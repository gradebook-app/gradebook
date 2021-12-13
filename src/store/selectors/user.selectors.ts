import { IRootReducer } from "../reducers";

const getUserId = (state:IRootReducer) => state.user.user?._id;
const getShownAlert = (state:IRootReducer) => state.user.shownAlert;

export { getUserId, getShownAlert };