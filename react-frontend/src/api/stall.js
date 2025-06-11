import axiosInstance from "./axiosInstance";

export const createStall = async (stallname) => {
    
        const response = await axiosInstance.post('/stall/create', {
            stall_name: stallname
        });
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

export const deleteStall = async(stall_id) => {
    const response = await axiosInstance.delete('/stall/delete', {
        params: {stall_id},
    });
    return response;
}

export const uploadBackground = async (stall_id, file) => {
  const formData = new FormData();
  formData.append("stall_id", stall_id);
  formData.append("image", file);
  const response = await axiosInstance.post('/stall/upload-background', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};


export const removeBackground = async (stall_id) => {
  const response = await axiosInstance.delete('/stall/remove-background', {
    params: { stall_id }
  });

  return response.data;
};