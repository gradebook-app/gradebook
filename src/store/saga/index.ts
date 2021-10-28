import { all } from "redux-saga/effects";
import authSaga from "./auth.saga";

const rootSaga = function*() {
    yield all([
        authSaga(),
    ])
}

export default rootSaga; 