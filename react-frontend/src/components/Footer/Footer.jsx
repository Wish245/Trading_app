import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur, deserunt maxime. Temporibus numquam fuga, fugiat eos tempore tenetur commodi ipsum corporis illo provident enim doloribus quas tempora non inventore quaerat!</p>
                <div className="footer-social-icon">
                    <img src={assets.Facebook} alt="" />
                    <img src={assets.Instagram} alt="" />
                    <img src={assets.Twitter} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+94792305617</li>
                    <li>contact@flowMKT.lk</li>
                </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">© 2024 flowmkt.com. All Right Reserved.</p>
    </div>
  )
}

export default Footer