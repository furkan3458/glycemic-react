import Axios from "axios";
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import {ListFoods} from '../reducers/listReducer';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
});

export const setListLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    return dispatch({type:ActionTypes.LIST_LOADING, payload:state});
}

export const setListInitialize = (state:boolean) => (dispatch:Dispatch<Action>) => {
    return dispatch({type:ActionTypes.LIST_INITIALIZE, payload:state});
}

export const setList = () => (dispatch:Dispatch<Action>) => {

    try{
        const list = JSON.parse(localStorage.getItem("list")!);
        const libraryCount = parseInt(localStorage.getItem("list-count")!);

        if(list !== undefined && list !== null){
            //axios.post("/foods/checkFoodList").then(response => {}).catch(error => {console.log(error.response)});
            dispatch({type:ActionTypes.LIST_SET, payload:list});
        }
        else{
            localStorage.setItem("list", JSON.stringify([]));
            localStorage.setItem("list-count",Number(0).toString());
        }
    }
    catch(exception){
        localStorage.setItem("library", JSON.stringify([]));
        localStorage.setItem("library-count",Number(0).toString());
    }

    dispatch({type:ActionTypes.LIST_INITIALIZE, payload:true});
}

export const setListAdd = (item:ListFoods) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.LIST_LOADING, payload:true});

    axios.post("food/check",{},{
        params:{id:item.detail.id}
    }).then(response=> {
        const data = response.data;
        if(data.status){
            item.detail = data.result[0];
            dispatch({type:ActionTypes.LIST_ADD, payload:item});
        }
        else
            dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    });
    
}

export const setListUpdate = (item:ListFoods, index:number) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.LIST_LOADING, payload:true});
    axios.post("food/check",{},{
        params:{id:item.detail.id}
    }).then(response=> {
        const data = response.data;
        if(data.status){
            item.detail = data.result[0];
            dispatch({type:ActionTypes.LIST_UPDATE, payload:{item:item, index:index}});
        }
            
        else
            dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    });
}

export const setListRemove = (item:ListFoods, index:number) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.LIST_LOADING, payload:true});
    axios.post("food/check",{},{
        params:{id:item.detail.id}
    }).then(response=> {
        const data = response.data;
        if(data.status)
            dispatch({type:ActionTypes.LIST_REMOVE, payload:index});
        else
            dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.LIST_LOADING, payload:false});
    });
}