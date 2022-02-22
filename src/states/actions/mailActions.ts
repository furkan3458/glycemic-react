import Axios from 'axios';
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';

import { MailResultStates } from '../reducers/mailReducer';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
});

export const setMailLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.MAIL_LOADING, payload:state});
}

export const setMailClear = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.MAIL_CLEAR, payload:[]});
}

export const setResetMail = (email:string) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.MAIL_LOADING, payload:true});
    axios.post("mail/forget",{},{
        params:{
            email:email
        }
    }).then(response=>{
        const data = response.data;

        dispatch({type:ActionTypes.MAIL_SET_STATE, payload:data.result});
    }).catch(error=>{
        dispatch({type:ActionTypes.MAIL_SET_STATE, payload:MailResultStates.ERROR});
    })
}