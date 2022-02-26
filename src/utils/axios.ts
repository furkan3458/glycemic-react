import Axios,{ AxiosRequestConfig } from 'axios';
import isEmpty from 'is-empty';

const axios = Axios.create({
    baseURL:process.env.REACT_APP_BASE_URL,
});

axios.interceptors.request.use((config:AxiosRequestConfig) => {

    const token:string = localStorage.getItem("jwtKey") || "";
    const fingerprint = localStorage.getItem(process.env.REACT_APP_FINGERPRINT_NAME!) || "";
    console.log("Token:"+token);

    if(!isEmpty(token)){
        config.headers = {
            ...config.headers,
            Authorization: "Bearer "+token,
            Fingerprint:fingerprint
        }
    }
    
    return config;
});

export default axios;