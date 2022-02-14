import { combineReducers } from "redux";
import { useSelector,TypedUseSelectorHook } from "react-redux";

import authReducer, { authState } from "./authReducer";
import foodReducer, { foodState } from './foodReducer';
import drawerReducer, { drawerState } from './drawerReducer';
import categoryReducer, { categoryState } from './categoryReducer';
import searchReducer, { searchState } from './searchReducer';
import cityReducer, { cityState } from './cityReducer';

const reducers = combineReducers({
    auth:authReducer,
    food:foodReducer,
    drawer:drawerReducer,
    category:categoryReducer,
    search:searchReducer,
    city:cityReducer,
});

interface RootState{
    auth:authState;
    food:foodState;
    drawer:drawerState;
    category:categoryState;
    search:searchState;
    city:cityState;
}

export default reducers;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export type StateType = ReturnType<typeof reducers>;