import Axios from 'axios';
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import {ICity} from '../../models/ICity';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
    headers:{
        Fingerprint:localStorage.getItem(process.env.REACT_APP_FINGERPRINT_NAME!)!,
    }
});

export const setCityLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CITY_LOADING, payload:state});
}

export const setCity = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.CITY_LOADING, payload:true});
    axios.get("city/list").then(response=>{
        const data:ICity = response.data;
        
        if(data.status){
            dispatch({type:ActionTypes.CITY_SET, payload:data.result});
        }
        dispatch({type:ActionTypes.CITY_LOADING, payload:false});
    }).catch(error=>{
        dispatch({type:ActionTypes.CITY_LOADING, payload:false});
    })

}