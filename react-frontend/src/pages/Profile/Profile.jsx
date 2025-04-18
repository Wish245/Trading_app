import React,{useState, useEffect} from "react";
import './Profile.css';
import { assets } from '../../assets/assets';


const Profile = () => {

  

  return(
    <div className="main">
      <div className="profile-top">
        <div className="profile-left">
          <h4 className="user-details">user details</h4>
          <div className="avatar-space">
            <img src={assets.Avatar} alt="Avatar" className="avatar-pic" />
            <button className="custom-avatar">customize</button>
          </div>
        </div>
      </div>
    </div>
  );
};