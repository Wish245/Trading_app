import React from "react";
import './Profile.css';
// import { assets } from '../../assets/assets';
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft";


const Profile = () => {

  return(
    <div className="profile-container">
      <div className="profile-top">
        <ProfileLeft></ProfileLeft>
      </div>
    </div>
  );
};

export default Profile;