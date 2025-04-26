import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { getUserProfile, updateUsername } from "../../api/profile";
import useUsernameAvailability from "../../hooks/usernameAvailability";
import "./ProfileLeft.css";

export default function ProfileLeft() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ username: "", national_id: "" });
  const [tempUsername, setTempUsername] = useState("");
  const { available, checkUsername } = useUsernameAvailability();

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        setTempUsername(data.username);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleEditToggle = () => setEditing(!editing);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setTempUsername(value);
    checkUsername(value);
  };

  const handleSave = async () => {
    try {
      await updateUsername(tempUsername);
      setProfile((prev) => ({ ...prev, username: tempUsername }));
      setEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="whole-block">
      <img src={assets.Avatar} alt="User Avatar" className="avatar-image" />
      <div className="details">
        {!editing ? (
          <>
            <h2 className="username">{profile.username}</h2>
            <p className="nic">National ID: {profile.national_id}</p>
            <button className="edit-btn" onClick={handleEditToggle}>
              Edit
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={tempUsername}
              onChange={handleUsernameChange}
              className="edit-username"
            />
            <div className="availability-stat">
              {available === null ? (
                ""
              ) : available ? (
                <span className="available">username is available</span>
              ) : (
                <span className="unavailable">username is taken</span>
              )}
            </div>
            <div className="scbtn">
              <button className="savebtn" onClick={handleSave}>
                Save
              </button>
              <button className="cancelbtn" onClick={handleEditToggle}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
