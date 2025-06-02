import axiosInstance from "./axiosInstance";

export const getStock = async () => {
    const response = await axiosInstance.get('/stock/all');
    return response.data;
};

export const getMyStock = async (stall_id) => {
    const response = await axiosInstance.get('/stock/me',{
        params : {
            stall_id: stall_id,
        },
    });
    return response.data;
};