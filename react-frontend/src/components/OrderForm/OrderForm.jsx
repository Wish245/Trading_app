import React, {useState, useEffect} from "react";
import * as OrderAPI from "../../api/order"
import { useNavigate, useParams } from "react-router-dom";
import "./OrderForm.css";

const OrderForm = () => {
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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
            navigate(`/order`);
        } catch (err) {
            console.error(err);
            setError("Error creating order");
        } finally {
            setLoading(false);
        }
    }
}