import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";
import userSaga from "./user.saga";

const rootSaga = function*() {
    yield all([
        userSaga(),
        authSaga(),
    ]);
};

export default rootSaga; 