import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import * as ProfileAPI from "../../api/profile";
import useUsernameAvailability from "../../hooks/usernameAvailability";
import "./ProfileLeft.css";

const ProfileLeft = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ username: "", national_id: "", email: "", phone: ""});
  const [tempUsername, setTempUsername] = useState("");
  const { available, checkUsername } = useUsernameAvailability();
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await ProfileAPI.getUserProfile();
        setProfile(data);
        setTempUsername(data.username);
        setTempEmail(data.email);
        setTempPhone(data.phone);
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
      await ProfileAPI.validateProfileInput(tempUsername,tempEmail,tempPhone);
      await ProfileAPI.updateUsername(tempUsername);
      await ProfileAPI.updateEmail(tempEmail);
      await ProfileAPI.updatePhone(tempPhone);
      setProfile((prev) => ({ ...prev, username: tempUsername, email: tempEmail, phone: tempPhone }));
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
            <p className="nic">Email: {profile.email}</p>
            <p className="nic">Phone: {profile.phone}</p>
            <button className="edit-btn" onClick={handleEditToggle}>
              Edit
            </button>
          </>
        ) : (
          <>
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              value={tempUsername}
              onChange={handleUsernameChange}
              className="edit-username"
              id="username"
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
            <p className="nic">National ID: {profile.national_id}</p>
            <label htmlFor="email">Email: </label>
            <input
              type="text"
              value={tempEmail}
              className="edit-username"
              id="email"
            />
            <label htmlFor="phone">Phone: </label>
            <input
              type="text"
              value={tempPhone}
              className="edit-username"
              id="phone"
            />
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

export default ProfileLeft;