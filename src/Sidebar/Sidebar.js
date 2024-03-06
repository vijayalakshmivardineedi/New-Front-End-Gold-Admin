import React, { useState } from 'react';
import {
    FaBars,
    FaUsers,
}from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import axiosInstance from "../helpers/axios";
import { MdSpaceDashboard ,MdCategory ,MdDiscount  } from "react-icons/md";
import { NavLink,useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import LogoImage from "../assets/logo/Logo.png";
import { FaBasketShopping } from "react-icons/fa6";
import ConfirmationDialog from "../confirmation/Confirmation";
const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const [ConfirmSignout, setConfirmSignout] = useState(false);
    const menuItem = [
      {
        path: "/dashboard",
        name: "Dashboard",
        icon: <MdSpaceDashboard />,
      },
      
      {
        path: "/GetCategories",
        name: "Categories",
        icon: <MdCategory  />,
      },
      {
        path: "/getCoupons",
        name: "Coupons",
        icon: <MdDiscount  />,
      },
      {
        path: "/customers",
        name: "Customers",
        icon: <FaUsers />,
      },
      {
        path: "/orders",
        name: "Orders",
        icon: <FaBasketShopping  />,
      },
    ];
    const handleSignOutClick = async () => {
      try {
          const response = await axiosInstance.post(`/signout`);
          localStorage.clear(); // Clear local storage
          setMessage(response.data.message); // Set message from the response
          setShowPopup(true); // Show the popup
          setTimeout(() => {
              setShowPopup(false); // Hide the popup after 2 seconds
              navigate('/'); // Navigate to the home page
          }, 2000);
      } catch (error) {
          setMessage(error.response.data.message || error.response.data.error);
          setShowPopup(true);
          setTimeout(() => {
              setShowPopup(false);
          }, 2000);
          console.error('Error:', error);
      }
  };

    return (
      <div className="sidebar-container row">
        <div className=' col-md-2'>
        <div style={{ width:  "280px"  }} className="sidebar">
          <div className="top_section">
          <div className="logo-container">
          <img className="Logo" src={LogoImage} alt="logo" />
              <h1 style={{ display: "block" }} className="logo-text">
                Chatoyer
              </h1>
            </div>
            {/* <div
              style={{ marginLeft: !isOpen ? "100px" : "0px" }}
              className="bars"
            >
              <FaBars onClick={toggle} style={{cursor:"pointer"}} />
            </div> */}
          </div>
          <div className="menu_items">
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
                activeClassName="active"
              >
                <div className="icon">{item.icon}</div>
                <div
                  style={{ display: "block" }}
                  className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
          <div className="sidebar-footer">
                    <div onClick={() => setConfirmSignout(true)} className="link" activeClassName="active">
                        <div className="icon">
                            <FaSignOutAlt />
                        </div>
                        <div
                            style={{ display: isOpen ? "block" : "none" }}
                            className="link_text"
                        >
                            SignOut
                        </div>
                    </div>
                </div>
        </div>
</div>
<div className='main-container col-md-10'>
        <main>{children}</main>
        </div>
        <ConfirmationDialog
                isOpen={ConfirmSignout}
                onClose={() => setConfirmSignout(false)}
                onConfirm={() => {
                    handleSignOutClick();
                    setConfirmSignout(false);
                }}
                message="Are you sure you want to sign out?"
            />
            {showPopup && (
                <div className="popup">
                    <div className="popup-content-big">
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                        <p>{message}</p>
                    </div>
                </div>
            )}
      </div>
    );
  };
  
  export default Sidebar;
  