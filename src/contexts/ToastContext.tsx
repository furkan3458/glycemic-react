import React from 'react';

export interface ToastContextProvider{
    toastSuccess:Function;
    toastInfo:Function;
    toastError:Function;
    toastWarn:Function;
}

const emptyFunction = (message:string) =>{console.log("Empty toast function:",message)}

const initialize:ToastContextProvider = {
    toastSuccess:emptyFunction,
    toastInfo:emptyFunction,
    toastError:emptyFunction,
    toastWarn:emptyFunction,
}

const ToastContext = React.createContext<ToastContextProvider>(initialize);

export default ToastContext;