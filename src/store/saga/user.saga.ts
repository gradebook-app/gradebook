import { all, takeLatest } from "@redux-saga/core/effects";
import { EUserActions, ISetNotificationToken } from "../constants/user.constants";
import * as api from "../../utils/api";
import { SET_NOTIFICATION_TOKEN } from "../../constants/endpoints/user";

function* setUserNotificationToken({ payload  } : ISetNotificationToken) : Generator<any> {
    if (!payload) return;
    const body = { notificationToken: payload };
    yield api.post(SET_NOTIFICATION_TOKEN, body);
}

const userSaga = function*() {
    yield all([
        takeLatest(EUserActions.SET_NOTIFICATION_TOKEN, setUserNotificationToken)
    ]);
};

export default userSaga; 