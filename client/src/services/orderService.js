import api from "./api"

export const createOrder = async (orderData) =>{
    const response = await api.post("/orders", orderData)
    return response.data
}
export const getMyOrders = async () => {
    const response = await api.get("/orders/my");
    return response.data;
  };

export const getAllOrders = async () => {
const response = await api.get("/orders");
return response.data;
};

export const markOrderDelivered = async (id) => {
  const response = await api.put(`/orders/${id}/deliver`);
  return response.data;
};