import { all, takeLatest } from "@redux-saga/core/effects";
import { EUserActions, ISetNotificationToken, IUserPurgeCache } from "../constants/user.constants";
import * as api from "../../utils/api";
import { SET_NOTIFICATION_TOKEN } from "../../constants/endpoints/user";
import { setShownAlert, setShownSaveBanner } from "../actions/user.actions";
import { put } from "redux-saga/effects";

function* setUserPurgeCache({ payload } : IUserPurgeCache) : Generator<any> {
    yield put(setShownAlert(false));
    yield put(setShownSaveBanner(false));
    payload.result?.call(null);
}

function* setUserNotificationToken({ payload  } : ISetNotificationToken) : Generator<any> {
    if (!payload) return;
    const body = { notificationToken: payload };
    yield api.post(SET_NOTIFICATION_TOKEN, body);
}

const userSaga = function*() {
    yield all([
        takeLatest(EUserActions.USER_PURGE_CACHE, setUserPurgeCache),
        takeLatest(EUserActions.SET_NOTIFICATION_TOKEN, setUserNotificationToken)
    ]);
};

export default userSaga; 