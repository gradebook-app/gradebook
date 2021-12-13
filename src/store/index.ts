import { 
    createStore, 
    applyMiddleware, 
} from "redux";

import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducers } from "./reducers";
import { persistStore  } from 'redux-persist';

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeWithDevTools(applyMiddleware(sagaMiddleware));

const store = createStore(reducers, enhancer);

const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { persistor };

export default store; 
