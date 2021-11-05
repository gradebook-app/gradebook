import AsyncStorage from "@react-native-async-storage/async-storage";
import { all, put, takeLatest } from "@redux-saga/core/effects"
import { LOGIN_CLIENT, LOGOUT_CLIENT } from "../../constants/endpoints/auth";
import { ISettings } from "../../pages/AccountScreen";
import * as api from "../../utils/api";
import { setLoading } from "../actions";
import { setAccessDenied, setSetAccessToken } from "../actions/auth.actions";
import { setUser } from "../actions/user.actions";
import { EAuthActions, ILoginClient } from "../constants/auth.constants";

function* loginClient({ payload } : ILoginClient) : Generator<any> {
    yield put(setLoading(true));
    const response:any = yield api.post(LOGIN_CLIENT, payload);
    if (response && response?.access === true) {
        const user = response?.user
        yield put(setUser(user || {}));
        yield put(setSetAccessToken(response.accessToken));
        const settings:any = yield AsyncStorage.getItem("@settings");
        if (settings) {
            const settingsParsed:ISettings = JSON.parse(settings); 
            const savePassword = settingsParsed.savePassword; 
            if (savePassword) yield AsyncStorage.setItem("@credentials", JSON.stringify(payload));
        } else {
            yield AsyncStorage.setItem("@settings", JSON.stringify({ savePassword: true }));
            yield AsyncStorage.setItem("@credentials", JSON.stringify(payload))
        }
    } else if (response && response?.access === false) {
        yield put(setAccessDenied(true));
        yield AsyncStorage.removeItem("@credentials")
    }
    yield put(setLoading(false));
}

function* logoutClient() : Generator<any> {
    yield api.post(LOGOUT_CLIENT);
    yield put(setSetAccessToken(null));
}

const authSaga = function*(){
    yield all([
        takeLatest(EAuthActions.LOGIN_CLIENT, loginClient),
        takeLatest(EAuthActions.LOGOUT_CLIENT, logoutClient)
    ])
}

export default authSaga; 