import axiosInstance from "./axiosInstance";

export const createOrder = async (stock_id, quantity, order_status_id, payment_status_id) => {
    const response = await axiosInstance.post('/order/create', {
        stock_id: stock_id,
        quantity: quantity,
        order_status_id: order_status_id,
        payment_status_id: payment_status_id,
    });

    return response;
}