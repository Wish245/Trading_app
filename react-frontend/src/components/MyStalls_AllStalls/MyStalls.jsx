import React, {useState, useEffect} from "react";
import './MyStall.css';
import * as StallAPI from "../../api/stall";
import Stall from "../Stall/Stall";

function MyStall() {
    const [stalls, setStalls] = useState([]);

    useEffect(() => {
        StallAPI.getMyStall()
        .then(setStalls)
        .catch(err => console.error("Error fetching stalls.", err));
    },[]);

    const handleDelete = (deletedStallId) => {
        setStalls(prev => prev.filter(stall => stall.stall_id !== deletedStallId));
    };

    return(
        <div className="my-stall-box">
            <div className="my-stall-name">
                <h1>My Stalls</h1>
            </div>
            <div className="stalls-wrapper">
                {stalls.map(stall => (
                    <Stall key={stall.stall_id} stall_id={stall.stall_id} stall_name={stall.stall_name} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
}

export default MyStall;