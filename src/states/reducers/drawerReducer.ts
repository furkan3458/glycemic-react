import action from '../../utils/action';
import ActionTypes from '../../utils/types';

import {ResultFoods} from '../../models/IFoods';

export interface drawerState {
    isInitialize: boolean;
    isLoading: boolean;
    foodCount: number;
    foods: DrawerFoods[];
}

export interface DrawerFoods{
    detail:ResultFoods;
    amount:number
}

const initialState: drawerState = {
    isLoading: false,
    isInitialize: false,
    foodCount: 0,
    foods: []
};

const drawerReducer = (state: drawerState = initialState, action: action) => {
    switch (action.type) {
        case ActionTypes.DRAWER_INITIALIZE:
            return {
                ...state,
                isInitialize: action.payload
            }
        case ActionTypes.DRAWER_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case ActionTypes.DRAWER_SET:
            return {
                ...state,
                isLoading: false,
                foodCount: action.payload.length,
                foods: action.payload
            }
        case ActionTypes.DRAWER_ADD: {
            let temp: DrawerFoods[] = state.foods;
            temp.push(action.payload);
            return {
                ...state,
                isLoading: false,
                foodCount: state.foodCount + 1,
                foods: temp
            }
        }
        case ActionTypes.DRAWER_UPDATE:{
            let temp: DrawerFoods[] = state.foods;
            let updateItem:DrawerFoods = action.payload.item;
            let updateIndex:number = action.payload.index;

            temp[updateIndex] = updateItem;
            return{
                ...state,
                isLoading: false,
                foods: temp,
            }
        }
        case ActionTypes.DRAWER_UPDATE:{
            let temp: DrawerFoods[] = state.foods;
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
