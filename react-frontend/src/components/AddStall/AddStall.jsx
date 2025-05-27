import React,{useState} from "react";
import { createStall } from "../../api/stall";
import "./AddStall.css";

const AddStall = () => {
    const [stallName, setStallName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Stall adding process initiated");

        try {
            const response = await createStall(stallName);
            console.log("createStall:", response);

            if (response.status === 201) {
                console.log("Stall creation successful");
                setTimeout(() => {
                    window.location.href = "/market";
                },2000);
            } else {
                console.error("Error creating stall", response.message);
            }
        } catch (error) {
            console.error("Error", error.message);
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
                <div className="button-div">
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddStall;