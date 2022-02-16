import action from '../../utils/action';
import ActionTypes from '../../utils/types';

import {ResultFoods} from '../../models/IFoods';

export interface listState {
    isInitialize: boolean;
    isLoading: boolean;
    foodCount: number;
    foods: ListFoods[];
}

export interface ListFoods{
    detail:ResultFoods;
    amount:number
}

const initialState: listState = {
    isLoading: false,
    isInitialize: false,
    foodCount: 0,
    foods: []
};

const drawerReducer = (state: listState = initialState, action: action) => {
    switch (action.type) {
        case ActionTypes.LIST_INITIALIZE:
            return {
                ...state,
                isInitialize: action.payload
            }
        case ActionTypes.LIST_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case ActionTypes.LIST_SET:
            return {
                ...state,
                isLoading: false,
                foodCount: action.payload.length,
                foods: action.payload
            }
        case ActionTypes.LIST_ADD: {
            let temp: ListFoods[] = state.foods;
            temp.push(action.payload);
            return {
                ...state,
                isLoading: false,
                foodCount: state.foodCount + 1,
                foods: temp
            }
        }
        case ActionTypes.LIST_UPDATE:{
            let temp: ListFoods[] = state.foods;
            let updateItem:ListFoods = action.payload.item;
            let updateIndex:number = action.payload.index;

            temp[updateIndex] = updateItem;
            return{
                ...state,
                isLoading: false,
                foods: temp,
            }
        }
        case ActionTypes.LIST_REMOVE:{
            let temp: ListFoods[] = state.foods;
            let removeIndex:number = action.payload;

            temp.splice(removeIndex,1);

            return{
                ...state,
                isLoading: false,
                foodCount: state.foodCount - 1,
                foods: temp
            }
        }
        default:
            return state;
    }
};

export default drawerReducer;
