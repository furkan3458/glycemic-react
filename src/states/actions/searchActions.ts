import Axios from 'axios';
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';
import { ICategory } from '../../models/ICategory';
import { SearchInfo } from '../reducers/searchReducer';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
});

export const setSearchLoading = (state:boolean) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_LOADING, payload:state});
}

export const setSearchResulted = (state:boolean) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_RESULTED, payload:state});
}

export const setSearchText = (text:string) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_SET_TEXT, payload:text});
}

export const setSearchCategory = (category:string) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_SET_CATEGORY, payload:category});
}

export const setSearchPage = (page:number) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_SET_PAGE, payload:page});
}

export const setSearchTotal = (total:number) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_SET_TOTAL, payload:total});
}

export const startSearch = (search:SearchInfo) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.SEARCH_LOADING, payload:true});
    axios.get("search/search",{
        params:{
            q:search.text,
            category:search.category,
            page:search.page,
        }
    }).then(response => {
        const data:ICategory = response.data;
        console.log(data);
        if(data.status){
            dispatch({type:ActionTypes.SEARCH_SET_RESULTS, payload:data.result});
            dispatch({type:ActionTypes.SEARCH_SET_PAGE, payload:data.page});
            dispatch({type:ActionTypes.SEARCH_SET_TOTAL, payload:data.totalPage});
        }else{
            dispatch({type:ActionTypes.SEARCH_RESULT_CLEAR, payload:[]});
        }
        dispatch({type:ActionTypes.SEARCH_RESULTED, payload:true});
    }).catch(error=> {
        dispatch({type:ActionTypes.SEARCH_RESULTED, payload:true});
        console.log(error.response);
    });
}