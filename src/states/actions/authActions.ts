import Axios from 'axios';
import { Dispatch } from 'redux';

import Action from '../../utils/action';
import ActionTypes from '../../utils/types';
import {ValidityStates} from '../reducers/authReducer';
const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
});

export const setAuthLoading = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_LOADING, payload:state});
}

export const setAuthenticated = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_AUTHENTICATION, payload:state});
}

export const setAuthFail = (state:boolean) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_FAIL, payload:state});
}

export const setAuthReset = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_RESET, payload:null});
}

export const setDefaultValidateEmail = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:false, validateState:ValidityStates.IDLE}});
}

export const authLogin = (user:any) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_LOADING, payload:true});
    axios.post("auth/login",user).then(response => {
        const data = response.data;
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        
        if(data.status !== undefined && data.status){

            localStorage.setItem("remember-me",user.rememberMe);
            localStorage.setItem("token",data.result.token);
            localStorage.setItem("session",btoa(unescape(encodeURIComponent(JSON.stringify(data.result)))));
            
            dispatch({type:ActionTypes.AUTH_AUTHENTICATION, payload:true});
            dispatch({type:ActionTypes.AUTH_RESET, payload:true});
        }
        else{
            dispatch({type:ActionTypes.AUTH_FAIL, payload:true});
        } 
    })
    .catch(error=>{
        console.log(error.response);
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        dispatch({type:ActionTypes.AUTH_FAIL, payload:true});
    });
}

export const validateUser = () => (dispatch:Dispatch<Action>) => {
    let userStore = localStorage.getItem("session")! ? localStorage.getItem("session")! : "";
    let userStr = decodeURIComponent(escape(window.atob(userStore)));
    const user = userStr !== "" ? JSON.parse(userStr) : null;

    if(user){
        const validate:any = {
            email:user.email,
            token:user.token,
        }

        axios.post("auth/validate",validate).then(response=>{
            const data = response.data;
            if(data.result){
                dispatch({type:ActionTypes.AUTH_VALIDATE, payload:user});
            }
            else{
                clearStorage();
                dispatch({type:ActionTypes.AUTH_VALIDATE, payload:null});
            }
        }).catch(error=>{
            console.log(error.response);
            clearStorage();
            dispatch({type:ActionTypes.AUTH_VALIDATE, payload:null});
        });
    }
    else{
        dispatch({type:ActionTypes.AUTH_VALIDATE, payload:null});
    }
}

export const authSignup = (form:any) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_LOADING, payload:true});
    axios.post("auth/signup",form).then(response => {
        const data:any = response.data;
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        
        if(data.status){

            localStorage.setItem("remember-me",data.rememberMe);
            localStorage.setItem("token",data.result.token);
            localStorage.setItem("session",btoa(unescape(encodeURIComponent(JSON.stringify(data.result)))));
            
            dispatch({type:ActionTypes.AUTH_AUTHENTICATION, payload:true});
            dispatch({type:ActionTypes.AUTH_RESET, payload:true});
        }
        else{
            dispatch({type:ActionTypes.AUTH_FAIL, payload:true});
        } 
    })
    .catch((error)=>{
        console.log(error.response);
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        dispatch({type:ActionTypes.AUTH_FAIL, payload:true});
    });
}

export const authLogout = (form:any) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_LOGOUT, payload:false});
    axios.post("auth/logout",form,{
        headers:{
            Authorization:"Bearer "+form.token
        }
    }).then(response=>{
        clearStorage();
        window.location.href="/";
    }).catch(error=>{
        clearStorage();
        window.location.href="/";
        
    });
}

export const validateEmail = (email:string) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:true, validateState:ValidityStates.IDLE}});
    axios.post("auth/validate_email",{email:email}).then(response=>{
        const data = response.data;
        if(data.result)
            dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:false,validateState:ValidityStates.VALID}});
        else
        dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:false,validateState:ValidityStates.INVALID}});

    }).catch(error=>{
        console.log(error.response);
        dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:false,validateState:ValidityStates.IDLE}});
    });
}

const clearStorage = () =>{
    localStorage.removeItem("jwtKey");
    localStorage.removeItem("session");
    localStorage.removeItem("remember-me");
} 

