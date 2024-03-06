import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import "./Getproduct.css";

import ConfirmationDialog from "../confirmation/Confirmation";

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams(); // Extracting category from URL params
  const navigate = useNavigate();
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    fetchData();
  }, [category]); // Fetch data when category changes

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/getProductByCategory/${category}`); // Fetch products by category
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteProduct/${productToDelete}`);
      setProducts(products.filter(product => product._id !== productToDelete));
      console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleEdit = (productId) => {
    // Navigate to the edit product page passing the productId
    navigate(`/editProduct/${productId}`);
  };
  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-header-text">Products</h1>
        <button className="products-header-button" onClick={() => navigate("/AddProduct")}> Add Product</button>
      </div>
      <ul className="products-list">
        {products.map((product) => (
          <li key={product._id} className="product-item">
            {/* Render your product item content here */}
              <div className="card">
                <div className="card-body p-2" style={{cursor:"pointer"}}>
                  
                  <div className="product-images" onClick={()=>navigate(`/detailedProduct/${product._id}`)}>
                  {product.productPictures.length > 0 && (
  <img
    key={product.productPictures[0]._id}
    className="card-img-top"
    src={`http://localhost:2000${product.productPictures[0].img}`}
    alt="Product"
  />
)}
                  </div>
                  <h2 className="card-title">{product.name}</h2>
                  <p className="card-text">Quantity: {product.quantity}</p>
                  <div className="product-icons-container">
                <button className="icon-button" onClick={() => handleEdit(product._id)}><MdEdit /></button>
                <button className="icon-button" onClick={() => handleDeleteClick(product._id)}><MdDelete /></button>
              </div>
                </div>
              </div>
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
};

export default GetProducts;
