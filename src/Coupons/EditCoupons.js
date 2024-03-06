import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCoupons.css";
import "./PopStyles.css";

const EditCoupon = () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [couponData, setCouponData] = useState({
    offerName: "",
    offerAmount: "",
    discountPercentage: "",
    description: "",
    startDate: "",
    expiryDate: "",
    applicableFor: "",
  });

  useEffect(() => {
    const fetchCouponDetails = async () => {
        try {
          const response = await axiosInstance.get(`/getCouponsById/${couponId}`);
          const coupon = response.data.coupons;
          // Parse the dates into Date objects
          const startDate = new Date(coupon.startDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          const expiryDate = new Date(coupon.expiryDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          setCouponData({
            offerName: coupon.offerName,
            offerAmount: coupon.offerAmount,
            discountPercentage: coupon.discountPercentage,
            description: coupon.description,
            startDate: startDate,
            expiryDate: expiryDate,
            applicableFor: coupon.applicableFor,
          });
        } catch (error) {
          console.error("Error fetching coupon details:", error);
          // Handle error
        }
      };
      
  
    fetchCouponDetails();
  }, [couponId]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData({
      ...couponData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/editCoupons/${couponId}`, couponData);
      console.log(response.data.message)
      if (response.status === 200) {
        setMessage(response.data.message); // Access message from response.data
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
    <div className="Add-Coupons">
      <h1 style={{marginLeft:"40px"}}>Edit Coupon</h1>
      <form onSubmit={handleSubmit} className="container Coupons">
      <div className="row">
        <div className="col-md-6">
          <label>Offer Name</label>
          <input
            type="text"
            name="offerName"
            value={couponData.offerName}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        <div className="col-md-6">
          <label>Offer Amount</label>
          <input
            type="text"
            name="offerAmount"
            value={couponData.offerAmount}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label>Discount Percentage</label>
          <input
            type="text"
            name="discountPercentage"
            value={couponData.discountPercentage}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        <div className="col-md-6">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={couponData.description}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        </div>
        <div className="row">
        <div className="col-md-6">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        <div className="col-md-6">
          <label>Expiry Date</label>
          <input
            type="date"
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        </div>
        <div className="Coupons-1">
          <label >Applicable For</label>
          <input
            type="text"
            name="applicableFor"
            value={couponData.applicableFor}
            onChange={handleChange}
            className="form-control fs-4"
          />
        </div>
        <div className="button">
        <button type="submit">Edit Coupon</button>
        </div>
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

export default EditCoupon;