import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../helpers/axios";
import { useNavigate } from "react-router-dom";
import "./PopStyles.css";

const AddCoupon = () => {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const [couponData, setCouponData] = useState({
    offerAmount: "",
    offerName: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    expiryDate: "",
    applicableFor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const convertToIndianFormat = (value) => {
    if (value === "") return value;

    const number = parseFloat(value);
    if (isNaN(number)) return value;

    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });

    return formatter.format(number).replace("₹", ""); // Removing the currency symbol
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithIndianFormat = {
        ...couponData,
        offerAmount: convertToIndianFormat(couponData.offerAmount),
      };

      const response = await axiosInstance.post("/addCoupon", formDataWithIndianFormat);
      
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/getCoupons');
        }, 2000);
      }
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
    <div>
      <h1>Add Coupon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Offer Name:</label>
          <input
            type="text"
            name="offerName"
            value={couponData.offerName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Offer Amount:</label>
          <input
            type="text"
            name="offerAmount"
            value={couponData.offerAmount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Discount Percentage:</label>
          <input
            type="text"
            name="discountPercentage"
            value={couponData.discountPercentage}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={couponData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Expiry Date:</label>
          <input
            type="date"
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Applicable For:</label>
          <input
            type="text"
            name="applicableFor"
            value={couponData.applicableFor}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add Coupon</button>
      </form>
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

export default AddCoupon;
