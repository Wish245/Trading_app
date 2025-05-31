import axiosInstance from "./axiosInstance";

export const createStall = async (stallname) => {
    
        const response = await axiosInstance.post('/stall/create');
        return response;
    
};

export const getStall = async () => {
    const response = await axiosInstance.get('/stall/all');
    return response.data;
};

export const getMyStall = async (user_id) => {
    const response = await axiosInstance.get('/stall/me');
    return response.data;
};