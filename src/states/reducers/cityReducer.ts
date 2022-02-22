import action from '../../utils/action';
import ActionTypes from '../../utils/types';

import { ResultCity } from '../../models/ICity';

export interface cityState {
    isLoading: boolean;
    city: ResultCity[];
}

const initialState: cityState = {
    isLoading: false,
    city: []
}

const cityReducer = (state: cityState = initialState, action: action) => {
    switch (action.type) {

        case ActionTypes.CITY_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case ActionTypes.CITY_SET:
            return {
                ...state,
                city:action.payload
            }

        default:
            return state;
    }
}

export default cityReducer;