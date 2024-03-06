import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import "./GetCategories.css"; 
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import ConfirmationDialog from "../confirmation/Confirmation";

const GetCategories = () => {
  const [data, setData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getCategory");
      setData(response.data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = (categoryId) => {
    navigate(`/editCategory/${categoryId}`);
  };

  const handleDeleteClick = (categoryId) => {
    setCategoryToDelete(categoryId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Make DELETE request to delete category
      const response = await axiosInstance.delete(`/deleteCategory/${categoryToDelete}`);
      // Remove the deleted category from state
      setData(data.filter((category) => category._id !== categoryToDelete));
      setMessage(response.data.message); // Set message from the response
      setShowPopup(true); // Show the popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 2 seconds
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      console.error('Error deleting category:', error);
    } finally {
      setConfirmDelete(false);
    }
  };

    return (
        <div className="category-container">
          <div className="category-header">
            <h1 className="category-header-text">Categories</h1>
            <button className="category-header-button" onClick={() => navigate("/AddCategory")}> Add Category</button>
          </div>
          <ul className="category-list">
            {data.map((category) => (
              <li key={category._id} className="category-item">
                {category.categoryImage && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="image-container">
                      <img
                        src={`http://localhost:2000${category.categoryImage}`}
                        alt={`${category.name} Image`}
                        onClick={() => navigate(`/getProducts/${category._id}`)}
                      />
                    </div>
                    <div className="category-item-details">
                      <h2>{category.name}</h2>
                      <p style={{ marginTop: "10px" }}>Number of Items</p>
                      <div className="category-icons-container">
                    <button className="icon-button" onClick={() => handleEditClick(category._id)}> <MdEdit /></button>
                    <button className="icon-button" onClick={() => handleDeleteClick(category._id)}>  <MdDelete /></button>
                  </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <ConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
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
}  
    export default GetCategories;