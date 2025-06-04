// components/MyStalls_AllStalls/Stall.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as StockAPI from "../../api/stock";
import {
  deleteStall,
  uploadBackground,
  removeBackground,
} from "../../api/stall";
import recycleBin from "../../assets/recycle-bin.png";
import addImg from "../../assets/add-img.png";
import removeImg from "../../assets/remove-img.png";
import "./Stall.css";

function Stall({ stall_id, stall_name, onDelete }) {
  const [stocks, setStocks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bgmExists, setBgmExists] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  // 1) Fetch stocks and check background existence on mount/when stall_id changes
  useEffect(() => {
    StockAPI.getMyStock(stall_id)
      .then((data) => setStocks(data || []))
      .catch((err) => console.error("Error Fetching details.", err));

    const img = new Image();
    img.src = `Backend-fast-api/assets/Stall-Bgm/stall_${stall_id}.png?ts=${Date.now()}`;
    img.onload = () => setBgmExists(true);
    img.onerror = () => setBgmExists(false);
  }, [stall_id]);

  // 2) Handle file selection from <input type="file" />
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // 3) When user clicks “Save” in the popup, upload selectedFile
  const handleImageSave = async () => {
    if (!selectedFile) return;

    try {
      await uploadBackground(stall_id, selectedFile);
      setBgmExists(true);
      setShowImagePopup(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // 4) When user clicks “Remove” icon, delete from backend & local state
  const handleImageRemove = async () => {
    try {
      await removeBackground(stall_id);
      setBgmExists(false);
    } catch (err) {
      console.error("Image removal failed:", err);
    }
  };

  // 5) When user confirms deletion of stall
  const handleDelete = async () => {
    try {
      await deleteStall(stall_id);
      onDelete(stall_id); // tell parent to drop this stall from list
      navigate("/market"); // redirect to /market
    } catch (err) {
      console.error("Failed to delete stall", err);
    }
  };

  return (
    <div className="stall-box">
      <div className="stall-header">
        {/* Background image controls */}
        <div className="bgm-controls">
          {!bgmExists ? (
            <img
              src={addImg}
              alt="Add Background"
              className="bgm-icon"
              onClick={() => setShowImagePopup(true)}
            />
          ) : (
            <img
              src={removeImg}
              alt="Remove Background"
              className="bgm-icon"
              onClick={handleImageRemove}
            />
          )}
        </div>

        {/* Add‐image popup */}
        {showImagePopup && (
          <div className="popup-overlay">
            <div className="popup">
              <p>Choose a background image for your stall:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />

              <div className="popup-buttons">
                <button
                  className="save-confirm"
                  onClick={handleImageSave}
                  disabled={!selectedFile}
                >
                  Save
                </button>
                <button
                  className="cancel-confirm"
                  onClick={() => {
                    setShowImagePopup(false);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stall name and delete icon */}
        <h1 className="stall-title">{stall_name}</h1>
        <img
          src={recycleBin}
          alt="Delete Stall"
          className="delete-icon"
          onClick={() => setShowConfirm(true)}
        />
      </div>

      {/* “Create Stock” button */}
      <div className="stock-create-btn">
        <button>Create Stock</button>
      </div>

      {/* Stock table */}
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

      {/* Delete‐stall confirmation popup */}
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
