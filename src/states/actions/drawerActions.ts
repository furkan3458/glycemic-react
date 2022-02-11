import Axios from "axios";
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import {DrawerFoods} from '../reducers/drawerReducer';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
    headers: {"Access-Control-Allow-Origin": "*"}
});

export const setDrawerLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    return dispatch({type:ActionTypes.DRAWER_LOADING, payload:state});
}

export const setDrawerInitialize = (state:boolean) => (dispatch:Dispatch<Action>) => {
    return dispatch({type:ActionTypes.DRAWER_INITIALIZE, payload:state});
}

export const setDrawer = () => (dispatch:Dispatch<Action>) => {
    const drawer = JSON.parse(localStorage.getItem("drawer")!);
    const drawerCount = parseInt(localStorage.getItem("drawer-count")!);

    if(drawer !== undefined && drawer !== null){
        //axios.post("/foods/checkFoodList").then(response => {}).catch(error => {console.log(error.response)});
        dispatch({type:ActionTypes.DRAWER_SET, payload:drawer});
    }
    else{
        localStorage.setItem("drawer", JSON.stringify([]));
        localStorage.setItem("drawer-count",Number(0).toString());
    }

    dispatch({type:ActionTypes.DRAWER_INITIALIZE, payload:true});
}

export const setDrawerAdd = (item:DrawerFoods) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.DRAWER_LOADING, payload:true});

    axios.post("foods/checkFood",{},{
        params:{gid:item.detail.gid}
    }).then(response=> {
        const data = response.data;
        if(data.status)
            dispatch({type:ActionTypes.DRAWER_ADD, payload:item});
        else
            dispatch({type:ActionTypes.DRAWER_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.DRAWER_ADD, payload:item});
    });
    
}

export const setDrawerUpdate = (item:DrawerFoods, index:number) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.DRAWER_LOADING, payload:true});
    axios.post("foods/checkFood",{},{
        params:{gid:item.detail.gid}
    }).then(response=> {
        const data = response.data;
        if(data.status)
            dispatch({type:ActionTypes.DRAWER_UPDATE, payload:{item:item, index:index}});
        else
            dispatch({type:ActionTypes.DRAWER_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.DRAWER_UPDATE, payload:{item:item, index:index}});
    });
}

export const setShoppingCartRemove = (item:DrawerFoods, index:number) =>(dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.DRAWER_LOADING, payload:true});
    axios.post("foods/checkFood",{},{
        params:{gid:item.detail.gid}
    }).then(response=> {
        const data = response.data;
        if(data.status)
            dispatch({type:ActionTypes.DRAWER_REMOVE, payload:index});
        else
            dispatch({type:ActionTypes.DRAWER_LOADING, payload:false});
    }).catch(error=> {
        dispatch({type:ActionTypes.DRAWER_REMOVE, payload:index});
    });
}