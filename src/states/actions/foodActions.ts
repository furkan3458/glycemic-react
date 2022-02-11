import Axios from 'axios';
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import { IFoods } from '../../models/IFoods';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const setFoodLoading = (state: boolean) => (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.FOOD_LOADING, payload: state });
}

export const getFoodList = () => (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.FOOD_LOADING, payload: true });

    axios.get("foods/list").then(response => {
        const data: IFoods = response.data;
        if (data.status) {
            dispatch({ type: ActionTypes.FOOD_SET, payload: data.result });
            dispatch({
                type: ActionTypes.FOOD_SET_PAGEABLE,
                payload: {
                    total: data.total,
                    totalPage: data.totalPage,
                    page: data.page,
                }
            });
        }
        dispatch({ type: ActionTypes.FOOD_LOADING, payload: false });
    }).catch(error => {
        dispatch({ type: ActionTypes.FOOD_LOADING, payload: false });
        console.log(error.response);
    });
}

export const getFood = (name: string) => (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.FOOD_LOADING, payload: true });

    axios.get("foods/foodGet", {
        params: {
            name: name
        }
    }).then(response => {
        const data: IFoods = response.data;
        if (data.status) {
            dispatch({ type: ActionTypes.FOOD_SET, payload: data.result });
        } else {
            dispatch({ type: ActionTypes.FOOD_SET, payload: [] });
        }
        dispatch({ type: ActionTypes.FOOD_LOADING, payload: false });
    }).catch(error => {
        dispatch({ type: ActionTypes.FOOD_LOADING, payload: false });
        console.log(error.response);
    });
}