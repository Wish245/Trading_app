import React, {useState, useEffect} from "react";
import './Stall.css';
import * as StallAPI from "../../api/stall";
import * as StockAPI from "../../api/stock";

function Stall({stall_id, stall_name}) {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        StockAPI.getMyStock(stall_id)
        .then(setStocks)
        .catch(err => console.error("Error Fetching details.", err));
    },[stall_id]);

    
};