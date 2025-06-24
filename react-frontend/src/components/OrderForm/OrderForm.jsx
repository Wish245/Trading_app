import React, {useState, useEffect} from "react";
import * as OrderAPI from "../../api/order";
import * as StockAPI from "../../api/stock";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderForm.css";

const OrderForm = () => {
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpenOrder, setOpenOrder] = useState(false);
    const [isOpenPayement, setOpenPayment] = useState(false);
    const navigate = useNavigate();
    const { stock_id } = useParams();

    console.log("stock_id = ", stock_id);
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await OrderAPI.createOrder(stock_id, quantity, 1, 1);
            console.log("Order created:",response.data);
            setOpenOrder(true);
            setTimeout(() => {
                navigate(`/order`);
            },2000)
        } catch (err) {
            console.error(err);
            setError("Error creating order");
        } finally {
            setLoading(false);
            setOpenOrder(false);
        }
    }
    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await OrderAPI.createOrder(stock_id, quantity, 1, 1);
            console.log("Order created:",response.data);
            console.log("Proceeding to payment...");
            setOpenPayment(true);
            setTimeout(() => {
                navigate(`/order`);
            },2000)
        } catch (err) {
            console.error(err);
            setError("Error creating order");
        } finally {
            setLoading(false);
            setOpenPayment(false);
        }
    }

    const onCancel = () => {
        navigate(`/stock/${stock_id}`);
    }
}