import { createStore, applyMiddleware } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import {createLogger} from 'redux-logger';
import thunk from "redux-thunk";

import reducers from "../reducers";

const initialState = {};
const middleware = [thunk];
const logger = createLogger({
    collapsed: true,
    diff: true
});

const store = createStore(
    reducers,
    initialState,composeWithDevTools(
    applyMiddleware(...middleware, logger)  
));

export default store;