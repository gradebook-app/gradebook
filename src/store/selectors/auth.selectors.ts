import { IRootReducer } from "../reducers";

const getEmail = (state:IRootReducer) => state.auth.email;
const getPass = (state:IRootReducer) => state.auth.pass;
const getSchoolDistrict = (state:IRootReducer) => state.auth.schoolDistrict;

export { getEmail, getPass, getSchoolDistrict };