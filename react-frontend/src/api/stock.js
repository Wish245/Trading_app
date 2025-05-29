import axiosInstance from "./axiosInstance";

export const getStock = async () => {
    const response = await axiosInstance.get('/stock');
    return response.data;
};