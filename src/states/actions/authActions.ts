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

export const setUser = (user:any) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_SET_USER, payload:user});
}

export const setDefaultValidateUsername = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_VALIDATE_USERNAME, payload:{isValidating:false, validateState:ValidityStates.IDLE}});
}

export const setDefaultValidateEmail = () => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:false, validateState:ValidityStates.IDLE}});
}

export const loadUser = (user:any) => (dispatch:Dispatch<Action>) => {
    dispatch({type:ActionTypes.AUTH_LOADING, payload:true});
    axios.post("api/auth/signin",user).then(response => {
        const data = response.data;
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        
        if(data.error === undefined || data.error === null){

            localStorage.setItem("remember-me",user.rememberMe);
            localStorage.setItem("session",btoa(unescape(encodeURIComponent(JSON.stringify(data)))) );
            
            dispatch({type:ActionTypes.AUTH_SET_USER, payload:user});
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
            username:user.username,
            token:user.token,
        }

        axios.post("api/auth/validate",validate).then(response=>{
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

export const signupAuthAction = (form:any) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_LOADING, payload:true});
    axios.post("register/registerUser",form).then(response => {
        const data:any = response.data;
        console.log(data);
        dispatch({type:ActionTypes.AUTH_LOADING, payload:false});
        
        if(data.status){

            localStorage.setItem("remember-me",data.rememberMe);
            localStorage.setItem("session",btoa(unescape(encodeURIComponent(JSON.stringify(data)))) );
            
            dispatch({type:ActionTypes.AUTH_SET_USER, payload:data});
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

export const logoutAction = (user:any) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_LOGOUT, payload:false});
    axios.post("/api/auth/logout",user).then(response=>{
        dispatch({type:ActionTypes.AUTH_LOGOUT, payload:true});
        clearStorage();
        window.location.href="/";
    }).catch(error=>{
        console.log(error.response);
        dispatch({type:ActionTypes.AUTH_LOGOUT, payload:true});
        clearStorage();
        window.location.href="/";
    });
}

export const validateUsernameAuthAction = (username:string) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_VALIDATE_USERNAME, payload:{isValidating:true, validateState:ValidityStates.IDLE}});
    axios.post("/api/auth/validate_username",{username:username}).then(response=>{
        const data = response.data;
        if(data.result)
            dispatch({type:ActionTypes.AUTH_VALIDATE_USERNAME, payload:{isValidating:false,validateState:ValidityStates.VALID}});
        else
        dispatch({type:ActionTypes.AUTH_VALIDATE_USERNAME, payload:{isValidating:false,validateState:ValidityStates.INVALID}});

    }).catch(error=>{
        console.log(error.response);
        dispatch({type:ActionTypes.AUTH_VALIDATE_USERNAME, payload:{isValidating:false,validateState:ValidityStates.IDLE}});
    });
}

export const validateEmailAuthAction = (email:string) => (dispatch:Dispatch<Action>) =>{
    dispatch({type:ActionTypes.AUTH_VALIDATE_EMAIL, payload:{isValidating:true, validateState:ValidityStates.IDLE}});
    axios.post("/api/auth/validate_email",{email:email}).then(response=>{
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

