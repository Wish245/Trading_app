import React, {useState, useEffect} from "react";
import './Stall.css';
// import * as StallAPI from "../../api/stall";
import * as StockAPI from "../../api/stock";

function Stall({stall_id, stall_name}) {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        StockAPI.getMyStock(stall_id)
        .then(setStocks)
        .catch(err => console.error("Error Fetching details.", err));
    },[stall_id]);

    return (
        <div className="stall-box">
            <div className="stall-name">
                <h1>{stall_name}</h1>
            </div>
            <div className="stock-create-btn">
                <button>Create Stock</button>
            </div>
            <div className="stock-table-space">
                <table className="stock-table">
                    <thead>
                        <tr className="st-t-head">
                            <th className="head">Stock name</th>
                            <th className="head">Details</th>
                        </tr>
                        <tbody>
                            {stocks.map(stock =>(
                                <tr key={stock.stock_id} className="st-t-body">
                                    <td className="head">{stock.stock_name}</td>
                                    <td className="head">
                                        <button>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </thead>
                </table>
            </div>
        </div>
    );   
}

export default Stall;