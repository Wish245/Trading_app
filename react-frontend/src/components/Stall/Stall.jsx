// components/MyStalls_AllStalls/Stall.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as StockAPI from "../../api/stock";
import { deleteStall } from "../../api/stall";
import recycleBin from "../../assets/recycle-bin.png";
import "./Stall.css";

function Stall({ stall_id, stall_name, onDelete }) {
  const [stocks, setStocks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    StockAPI.getMyStock(stall_id)
      .then((data) => setStocks(data || []))
      .catch((err) => console.error("Error Fetching details.", err));
  }, [stall_id]);

  const handleDelete = async () => {
    try {
      await deleteStall(stall_id);
      onDelete(stall_id);       // notify parent so it can remove from list
      navigate("/market");      // redirect to /market after deletion
    } catch (err) {
      console.error("Failed to delete stall", err);
      // optionally show an error toast
    }
  };

  return (
    <div className="stall-box">
      <div className="stall-header">
        <h1>{stall_name}</h1>
        <img
          src={recycleBin}
          alt="Delete Stall"
          className="delete-icon"
          onClick={() => setShowConfirm(true)}
        />
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
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.stock_id} className="st-t-body">
                <td className="head">{stock.item_name}</td>
                <td className="head">
                  <button>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirm && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Are you sure you want to delete this stall?</p>
            <div className="popup-buttons">
              <button className="delete-confirm" onClick={handleDelete}>
                Delete
              </button>
              <button
                className="cancel-confirm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stall;
