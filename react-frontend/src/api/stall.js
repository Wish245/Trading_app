import axiosInstance from "./axiosInstance";

export const createStall = async (stallname) => {
    
        const response = await axiosInstance.post('/stall/create',{
            stall_name: stallname,
        });
        return response.data;
    
};