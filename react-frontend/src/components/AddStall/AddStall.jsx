import React, { useState } from "react";
import { createStall } from "../../api/stall";
import "./AddStall.css";
import { useNavigate } from "react-router-dom";

const AddStall = () => {
    const [stallName, setStallName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        console.log("Stall adding process initiated");

        try {
            const response = await createStall(stallName);
            console.log("createStall:", response);

            if (response.status === 201) {
                console.log("Stall creation successful");
                navigate("/market");
            } else {
                setError(response?.data?.detail || "Failed to create stall.");
            }
        } catch (err) {
            console.error("Error", err.message);
            setError(err.response?.data?.detail || "Stall name is already existing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stall-form-container">
            <h2>Create Stall</h2>
            <form onSubmit={handleSubmit}>
                <div className="detail-stall">
                    <label>Stall name:</label>
                    <input 
                        type="text"
                        value={stallName}
                        onChange={(e) => setStallName(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="button-div">
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStall;
