import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar/NavBar'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Profile from './pages/Profile/Profile'
import OrderPage from './pages/OrderPage/OrderPage'
import PaymentPage from './pages/PaymentPage/PaymentPage'
import Market from './pages/Market/Market'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'

const App = () => {
  return (
    <>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path='/order' element={<OrderPage/>}/>
          <Route path='/payment' element={<PaymentPage/>}/>
          <Route path='/market' element={<Market/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App
