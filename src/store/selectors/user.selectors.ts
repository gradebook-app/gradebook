import { IRootReducer } from "../reducers";

const getUserId = (state:IRootReducer) => state.user.user?._id;

export { getUserId };