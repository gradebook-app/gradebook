import AsyncStorage from "@react-native-async-storage/async-storage";
import { all, put, takeLatest } from "@redux-saga/core/effects"
import { LOGIN_CLIENT } from "../../constants/endpoints/auth";
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
        yield AsyncStorage.setItem("@credentials", JSON.stringify(payload))
    } else if (response && response?.access === false) {
        yield put(setAccessDenied(true));
        yield AsyncStorage.removeItem("@credentials")
    }
    yield put(setLoading(false));
}

const authSaga = function*(){
    yield all([
        takeLatest(EAuthActions.LOGIN_CLIENT, loginClient)
    ])
}

export default authSaga; 