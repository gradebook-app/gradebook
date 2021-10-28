import { all, put, takeLatest } from "@redux-saga/core/effects"
import { LOGIN_CLIENT } from "../../constants/endpoints/auth";
import * as api from "../../utils/api";
import { setLoading } from "../actions";
import { setSetAccessToken } from "../actions/auth.actions";
import { EAuthActions, ILoginClient } from "../constants/auth.constants";

function* loginClient({ payload } : ILoginClient) : Generator<any> {
    yield put(setLoading(true));
    const response:any = yield api.post(LOGIN_CLIENT, payload);
    if (response && response?.access) {
        yield put(setSetAccessToken(response.accessToken));
    }
    yield put(setLoading(false));
}

const authSaga = function*(){
    yield all([
        takeLatest(EAuthActions.LOGIN_CLIENT, loginClient)
    ])
}

export default authSaga; 