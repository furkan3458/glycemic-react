import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import { ResultFoods } from '../../models/IFoods';
import { IPageInfo } from '../../models/IPageInfo';

export interface foodState {
  isLoading: boolean;
  foods: ResultFoods[];
  pages: IPageInfo;
}


const initialState: foodState = {
  isLoading: false,
  foods: [],
  pages: {
    total: 1,
    totalPage: 1,
    page: 1,
  }
};

const foodReducer = (state: foodState = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.FOOD_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.FOOD_SET:
      return {
        ...state,
        foods: action.payload
      }

    case ActionTypes.FOOD_SET_PAGEABLE:
      return {
        ...state,
        pages:action.payload
      }
    default:
      return state;
  }
};

export default foodReducer;