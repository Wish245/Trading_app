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

export const createStock = async (stall_id, file, data) => {
    const formData = new FormData();
    formData.append("stall_id", stall_id);
   if(file) {
    formData.append("image", file);
   }
   formData.append("item_name", data.item_name);
   formData.append("price", data.price);
   formData.append("quantity", data.quantity);

   const response = await axiosInstance.post("/stock/create", formData, {
    headers: {
        "Content-type" : "multipart/form-data",
    },
   });

   return response;
};

export const getStockById = async (stock_id) => {
  const response = await axiosInstance.get(`/stock/${stock_id}`);
  return response.data;
};
