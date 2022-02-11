import axios from "axios";


const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})


// All Foods List
export const allFoodsList = () => {
    return axiosConfig.get("foods/list");
}
