import axios from "axios";

export const $instance = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`}
})
