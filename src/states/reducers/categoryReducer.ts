import action from '../../utils/action';
import ActionTypes from '../../utils/types';

import { ResultCategory } from '../../models/ICategory';
import { IPageInfo } from '../../models/IPageInfo';

export interface categoryState {
    isLoading:boolean;
    isInitialize:boolean;
    categories:ResultCategory[];
    single:ResultCategory | {};
    pages:IPageInfo;
}

const initialState:categoryState = {
    isLoading:false,
    isInitialize:false,
    categories:[],
    single:{},
    pages:{
        total:1,
        totalPage:1,
        page:1,
    }
}

const categoryReducer = (state:categoryState = initialState, action: action) => {
    switch (action.type) {

        case ActionTypes.CATEGORY_INITIALIZE:
            return { 
                ...state,
                isInitialize:action.payload,
            }

        case ActionTypes.CATEGORY_LOADING:
            return {
                ...state,
                isLoading:action.payload,
            }
        case ActionTypes.CATEGORY_SET:
            return{
                ...state,
                isLoading:false,
                categories:action.payload,
            }
        case ActionTypes.CATEGORY_SINGLE:
            return{
                ...state,
                isLoading:false,
                single:action.payload,
            }
        case ActionTypes.CATEGORY_SET_PAGEABLE:
            return{
                ...state,
                pages:action.payload
            }
        default:
            return state
    }
}

export default categoryReducer;
