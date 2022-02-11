import Axios from 'axios';
import { Dispatch } from 'redux';
import { ICategory } from '../../models/ICategory';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const setCategoryLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CATEGORY_LOADING, payload:state});
}

export const setCategoryInitialize = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CATEGORY_INITIALIZE, payload:state});
}

export const getCategoryList = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CATEGORY_LOADING, payload:true});
    axios.get("categories/all").then(response=> {
        const data:ICategory = response.data;

        if(data.status){
            dispatch({type:ActionTypes.CATEGORY_SET, payload:data.result});
        }   
        else
            dispatch({type:ActionTypes.CATEGORY_LOADING, payload:false});

        dispatch({type:ActionTypes.CATEGORY_INITIALIZE, payload:true});
    }).catch(error => {
        console.log(error.response);
        dispatch({type:ActionTypes.CATEGORY_LOADING, payload:false});
    });
}

export const getCategoryByUrl = (url:string) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CATEGORY_LOADING, payload:true});
    axios.get("categories/find",{
        params:{
            name:url
        }
    }).then(response=> {
        const data:ICategory = response.data;
        if(data.status){
            dispatch({type:ActionTypes.CATEGORY_SINGLE, payload:data.result![0]});
            dispatch({
                type:ActionTypes.CATEGORY_SET_PAGEABLE, 
                payload:{
                    total:data.total, 
                    totalPage:data.totalPage,
                    page:data.page
                }
            });
        } 
        else{
            dispatch({type:ActionTypes.CATEGORY_SINGLE, payload:{}});
        }
    }).catch(error => {
        console.log(error.response);
        dispatch({type:ActionTypes.CATEGORY_LOADING, payload:false});
    });
}

export const getCategoryById = (id:number) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CATEGORY_LOADING, payload:true});
    axios.get("categories/find",{
        params:{
            id:id
        }
    }).then(response=> {
        const data:ICategory = response.data;

        if(data.status)
            dispatch({type:ActionTypes.CATEGORY_SINGLE, payload:data.result![0]});
        else{
            dispatch({type:ActionTypes.CATEGORY_SINGLE, payload:{}});
        }

    }).catch(error => {
        console.log(error.response);
        dispatch({type:ActionTypes.CATEGORY_LOADING, payload:false});
    });
}