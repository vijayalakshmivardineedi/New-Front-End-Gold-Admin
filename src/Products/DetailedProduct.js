import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";
import './DetailedProduct.css'
const DetailedProduct = () => {
  const [product, setProduct] = useState(null); // Initialize product state as null
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/getDetailsByProductId/${productId}`);
      setProduct(response.data.product); // Assuming the response contains a single product
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="detail-header">
        <h1 className="detail-header-text">Product Details </h1>
      </div>
      <div className="detail-details">
        {product && (
          <div className="detail-item-details row">
            <div className="col-md-4">
              <div className="detail-images">
                {product.productPictures.map(picture => (
                  <img key={picture._id} 
                    src={`http://localhost:2000${picture.img}`}              
                    alt="Product" 
                    className="img-fluid mb-3"
                  />
                ))}
              </div>
              <div className="detail-video">
              {product.videoProduct && (
    <video controls className="img-fluid mb-3">
      <source src={`http://localhost:2000${product.videoProduct}`} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )}
              </div>
            </div>
            <div className="col-md-8">
              <div className="detail-info">
              <div className="row " style={{marginTop:"-6px"}}>
                  <div className="col" >
                  <h2>{product.name}</h2>
                  </div>
                  <div className="col ">
                  <p>Quantity: {product.quantity}</p>
                  </div>
                </div>
                <h4> Product Details</h4>
                <div className="row ">
                  <div className="col">
                    <p>_id: {product._id}</p>
                    <p>category: {product.category}</p>
                    <p>Product Code: {product.productCode}</p>
                  </div>
                  <div className="col">
                    <p>Product description: {product.description}</p>
                    <p>height: {product.height}</p>
                    <p>width: {product.width}</p>
                  </div>
                  <div className="col">
                  <p>size: {product.size.map(item => item.size).join(', ')}</p>

                    
            <p>totalProductWeight: {product.totalProductWeight}</p>
                  </div>
                </div>
            <h4>Gold</h4>
            <div className="row ">
                  <div className="col">
                  <p>goldWeight: {product.goldWeight}</p>
                  </div>
                  <div className="col">
                  <p>goldKt: {product.goldKt.join(', ')}</p>
                  </div>
                  <div className="col">
                  <p>goldType: {product.goldType.join(', ')}</p>
                  </div>
                </div>
            <h4> Diamond</h4>
            <div className="row ">
                  <div className="col">
                  <p>diamondType: {product.diamondType.join(', ')}</p>
            <p>diamondSize: {product.diamondSize}</p>
            <p>diamondShape: {product.diamondShape}</p>

                  </div>
                  <div className="col">
                  <p>diamondKt: {product.diamondKt}</p>
            <p>diamondColor: {product.diamondColor}</p>
            <p>diamondWeight: {product.diamondWeight}</p>

                  </div>
                  <div className="col">
                  <p>diamondCount: {product.diamondCount}</p>
                  <p>diamondClarity: {product.diamondClarity}</p>
                  <p>diamondSettingType: {product.diamondSettingType}</p>
                  </div>
                </div>
            <h4>Stone</h4>
            <div className="row ">
                  <div className="col">
                  <p>stone: {product.stone}</p>
            <p>stonesCount: {product.stonesCount}</p>
            <p>stoneSettingType: {product.stoneSettingType}</p>

                  </div>
                  <div className="col">
                  <p>stonesColour: {product.stonesColour}</p>
            <p>stonesWeight: {product.stonesWeight}</p>
                  </div>
                  <div className="col">
                  <p>stoneSize: {product.stoneSize}</p>
            <p>stoneShape: {product.stoneShape}</p>
                  </div>
                 
                </div>
           
            <h4>Price</h4>
            <div className="row ">
                  <div className="col">
                  <p>diamondprice: {product.diamondprice}</p>
            <p>goldprice: {product.goldprice}</p>
            <p>stoneprice: {product.stoneprice}</p>
                  </div>
                  <div className="col">
                  <p>makingCharges: {product.makingCharges}</p>
            <p>gst: {product.gst}</p>
                  </div>
                 
                </div>
            
            
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedProduct;
