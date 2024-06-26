import AsyncStorage from "@react-native-async-storage/async-storage";
import { all, put, select, takeLatest } from "@redux-saga/core/effects";
import { LOGIN_CLIENT, LOGOUT_CLIENT } from "../../constants/endpoints/auth";
import * as api from "../../utils/api";
import { setLoading } from "../actions";
import { setAccessDenied, setLoginError, setSetAccessToken } from "../actions/auth.actions";
import { setResetSettings } from "../actions/settings.actions";
import { setUser } from "../actions/user.actions";
import { EAuthActions, ILoginClient, ILogoutClient } from "../constants/auth.constants";
import { getSavePassword } from "../selectors/settings.selectors";
import CookieManager, { Cookies } from "@react-native-cookies/cookies";

function* getJSessionId() : Generator<Promise<Cookies>, [string | undefined, string], Cookies>{
    const cookies = yield CookieManager.getAll();
    const cookie = cookies[api.GENESIS_COOKIE]; 
    return [ 
        cookie.value ? cookie.value : undefined, 
        `${cookie.domain}${cookie.path}` 
    ];
}

function* loginClient({ payload } : ILoginClient) : Generator<any> {
    yield put(setLoading(true));
    
    const genesisLoginSuccess = yield api.attemptGenesisClientSideLogin(payload);
    if (!genesisLoginSuccess) {
        yield put(setAccessDenied(true));
        yield AsyncStorage.removeItem("@credentials");
        yield put(setLoading(false));
        return; 
    }

    const [genesisCookie, cookiePath]  = (yield getJSessionId()) as [string | undefined, string];
    CookieManager.clearByName(cookiePath, api.GENESIS_COOKIE);
  
    const response:any = yield api.post(
        LOGIN_CLIENT, 
        { ...payload, jSessionId: genesisCookie } as ILoginClient["payload"])
        .catch(() => null);

    if (response && response?.access === true) {
        const user = response?.user;
        yield put(setUser(user || {}));
        yield put(setSetAccessToken(response.accessToken));
        const savePassword = yield select(getSavePassword); 
        if (savePassword) yield AsyncStorage.setItem("@credentials", JSON.stringify(payload));
    } else if (response && response?.access === false) {
        yield put(setAccessDenied(true));
        yield AsyncStorage.removeItem("@credentials");
    } else if (!response) {
        yield put(setLoginError(true));
    }
    yield put(setLoading(false));
}

function* logoutClient({ payload } : ILogoutClient) : Generator<any> {
    yield put(setResetSettings());
    yield api.post(LOGOUT_CLIENT, payload).catch(() => null);
    yield put(setSetAccessToken(null));
}

const authSaga = function*(){
    yield all([
        takeLatest(EAuthActions.LOGIN_CLIENT, loginClient),
        takeLatest(EAuthActions.LOGOUT_CLIENT, logoutClient)
    ]);
};

export default authSaga; 