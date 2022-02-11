import React from "react";

export interface AuthContextProvider{
    authType: "guest" | "user" | string,
    authenticatedUser:AuthUser
}

interface AuthUser{
    id:number,
    fullname:string,
    username:string,
    email:string,
    roles:string[]
}

const initAuthUser:AuthUser = {
    id:0,
    fullname:"",
    username:"",
    email:"",
    roles:[]
}

const initialize:AuthContextProvider = {
    authType:"guest",
    authenticatedUser:initAuthUser
}

const AuthContext = React.createContext(initialize);

export default AuthContext;