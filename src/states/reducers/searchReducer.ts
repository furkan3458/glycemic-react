import { ResultFoods } from '../../models/IFoods';
import action from '../../utils/action';
import ActionTypes from '../../utils/types';

export interface searchState {
    isLoading: boolean;
    info: SearchInfo;
    isResulted: boolean;
    results:ResultFoods[];
    searchDB:'user' | 'guest';
}

export interface SearchInfo {
    text: string;
    category: string;
    page: number;
    totalPage: number;
}

const initialState: searchState = {
    isLoading: false,
    isResulted: false,
    info: {
        text: "",
        category: "",
        page: 1,
        totalPage: 1
    },
    results:[],
    searchDB:'guest'
}

const searchReducer = (state: searchState = initialState, action: action) => {
    switch (action.type) {
        case ActionTypes.SEARCH_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                isResulted:false,
            }
        case ActionTypes.SEARCH_RESULTED:
            return {
                ...state,
                isResulted: action.payload,
                isLoading:false
            }
        case ActionTypes.SEARCH_SET_CATEGORY: {
            state.info.category = action.payload;
            return {
                ...state
            }
        }

        case ActionTypes.SEARCH_SET_TEXT: {
            state.info.text = action.payload;
            return {
                ...state
            }
        }

        case ActionTypes.SEARCH_SET_PAGE: {
            state.info.page = action.payload;
            return {
                ...state
            }
        }

        case ActionTypes.SEARCH_SET_TOTAL: {
            state.info.totalPage = action.payload
            return {
                ...state
            }
        }

        case ActionTypes.SEARCH_SET_RESULTS:{
            return {
                ...state,
                results:action.payload
            }
        }

        case ActionTypes.SEARCH_RESULT_CLEAR:{
            return {
                ...state,
                results:action.payload,
                info: {
                    ...state.info,
                    page: 1,
                    totalPage: 1
                },
            }
        }
        
        case ActionTypes.SEARCH_SET_DB:{
            return {
                ...state,
                searchDB:action.payload
            }
        }

        default:
            return state
    }
}

export default searchReducer;
