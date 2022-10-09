import { all, takeLatest } from "@redux-saga/core/effects";
import { EUserActions, ISetNotificationToken, ISetUserCourseWeight, IUserPurgeCache } from "../constants/user.constants";
import * as api from "../../utils/api";
import { SET_NOTIFICATION_TOKEN } from "../../constants/endpoints/user";
import { setShownAlert, setShownSaveBanner, setUpdatingCourseWeight } from "../actions/user.actions";
import { put } from "redux-saga/effects";
import { SET_COURSE_WEIGHT } from "../../constants/endpoints/grades";

function* setUserPurgeCache({ payload } : IUserPurgeCache) : Generator<any> {
    yield put(setShownAlert(false));
    yield put(setShownSaveBanner(false));
    payload.result?.call(null);
}

function* setUserNotificationToken({ payload } : ISetNotificationToken) : Generator<any> {
    if (!payload) return;
    const body = { notificationToken: payload };
    yield api.post(SET_NOTIFICATION_TOKEN, body);
}

function* setUserCourseWeight({ payload: { resolve, ...payload} } : ISetUserCourseWeight) : Generator<any> {
    yield put(setUpdatingCourseWeight(true));
    const body = { ...payload }
    const response = yield api.post(SET_COURSE_WEIGHT, body)
        .catch(() => null);
    yield put(setUpdatingCourseWeight(false));

    resolve((response as any)?.success || false);
}

const userSaga = function*() {
    yield all([
        takeLatest(EUserActions.USER_PURGE_CACHE, setUserPurgeCache),
        takeLatest(EUserActions.SET_NOTIFICATION_TOKEN, setUserNotificationToken),
        takeLatest(EUserActions.SET_USER_COURSE_WEIGHT, setUserCourseWeight),
    ]);
};

export default userSaga; 