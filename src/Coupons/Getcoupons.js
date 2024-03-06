import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { BsTrash, BsPencil } from "react-icons/bs";
import ConfirmationDialog from "../confirmation/Confirmation";
import "./PopStyles.css";
import "./GetCoupons.css";
import { useNavigate } from "react-router-dom";

const Getcoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance.get("/getCoupons");
        setCoupons(response.data.coupons);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteCoupons/${couponIdToDelete}`);
      // Remove the deleted coupon from the state
      setCoupons(coupons.filter((coupon) => coupon._id !== couponIdToDelete));
      setConfirmDelete(false);
      setMessage(response.data.message); // Set message from the response
      setShowPopup(true); // Show the popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 2 seconds
        navigate('/getCoupons'); // Navigate to the coupons page
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
  

  const handleEditCoupon = (couponId) => {
    navigate(`/editCoupon/${couponId}`);
  };

  return (
    <div className="Coupons-container">
      <div className="Coupons-header">
        <h1 className="Coupons-header-text">Coupons</h1>
        <button
          className="Coupons-header-button"
          onClick={() => navigate("/addCoupon")}
        >
          Add Coupons
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
      <div className="Coupons-list ">
        <div className="card-wrapper">
         {coupons.map((coupon) => (
          <div className="card m-3" key={coupon._id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="card-title">{coupon.offerName}</h1>
              </div>
              <p className="card-text"><b style={{color:"#000"}}>ID:</b> {coupon._id}</p>
              <p className="card-text"><b style={{color:"#000"}}>Description:</b> {coupon.description}</p>
              <div>
                <p className="card-text">
                <b style={{color:"#000"}}>Offer Available From:</b> {new Date(coupon.startDate).toLocaleDateString()}
                  <br />
                  <b style={{color:"#000"}}>Expiry Date:</b>{new Date(coupon.expiryDate).toLocaleDateString()}
                  <br />
                 <b style={{color:"#000"}}> Available:</b> {coupon.applicableFor}
                </p>
              </div>
              <button
                className="code-button btn-warning ms-2"
                style={{ fontSize: "20px", fontWeight: 600 }}
              >{coupon.couponCode}
              </button>
              <div className="btn-group" role="group">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditCoupon(coupon._id)}
                  >
                    <BsPencil />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setConfirmDelete(true);
                      setCouponIdToDelete(coupon._id);
                    }}
                  >
                    <BsTrash />
                  </button>
                </div>
            </div>
          </div>))}
        </div>

      </div>
      )}
      <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDeleteCoupon}
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

export default Getcoupons;