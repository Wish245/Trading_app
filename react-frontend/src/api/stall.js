import axiosInstance from "./axiosInstance";

export const createStall = async (stallname) => {
    
        const response = await axiosInstance.post('/stall/create',{
            stall_name: stallname,
        });
        return response;
    
};

export const getStall = async () => {
    const response = await axiosInstance.get('/stall');
    return response.data;
};

export const getMyStall = async (user_id) => {
    const response = await axiosInstance.get('/me',{
        user_id: user_id,
    });
    return response.data;
};