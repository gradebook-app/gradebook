import { IRootReducer } from "../reducers";

const getBiometricsEnabled = (state:IRootReducer) => state.settings.biometricsEnabled;
const getLimitAds = (state:IRootReducer) => state.settings.limitAds;
const getSavePassword = (state:IRootReducer) => state.settings.savePassword;
const getSettings = (state:IRootReducer) => state.settings;

export { getBiometricsEnabled, getLimitAds, getSavePassword, getSettings };