import React, {useState, useEffect} from "react";
import * as OrderAPI from "../../api/order";
import * as StockAPI from "../../api/stock";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderForm.css";

const OrderForm = () => {
    const [stallId, setStallId] = useState("");
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpenOrder, setOpenOrder] = useState(false);
    const [isOpenPayement, setOpenPayment] = useState(false);
    const navigate = useNavigate();
    const { stock_id } = useParams();

    console.log("stock_id = ", stock_id);

    useEffect(() => {
        (async () => {
            try{
                const response = await StockAPI.getStockById(stock_id);
                setStallId(response.stall_id);
                setItemName(response.item_name);
            } catch (err) {
                console.error(err);
            }
        })(); 
    }, [stock_id]);

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

    return(
        <div className="order-form">
            <div className="form-order-title">
                <h2>Order Form</h2>
            </div>
            <div className="fixed-comtent">
                <p className="fixed-comtent-left">Stall number: </p><p className="fixed-comtent-right">{stallId}</p>
            </div>
            <div className="fixed-comtent">
                <p className="fixed-comtent-left">Stock number: </p><p className="fixed-comtent-right">{stock_id}</p>
            </div>
            <div className="fixed-comtent">
                <p className="fixed-comtent-left">Item name: </p><p className="fixed-comtent-right">{itemName}</p>
            </div>
            <div className="form-fill">
                <label htmlFor="quantity">Quantity</label>
                <input type="text" className="quantity" value={quantity}/>
            </div>
            <div className="btn-field">
                <button className="cart-btn" onClick={handleSave}>Add-to-Cart</button>
                <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                <button className="payment-btn" onClick={handlePayment}>Payment</button>
            </div>
        </div>
    )
}

export default OrderForm;