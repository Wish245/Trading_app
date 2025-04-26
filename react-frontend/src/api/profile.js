import axiosInstance from "./axiosInstance";

export const getUserProfile = async () => {
    const {data} = await axiosInstance.get('/profile/me');
    return data;
};

export const updateUsername = async (newUsername) => {
    const {data} = await axiosInstance.put('/profile/username',{
        username: newUsername,
    });

    return data;
    
}