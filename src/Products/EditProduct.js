import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PopStyles.css";

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([
    "2.2", "2.4", "2.6", "2.8", "2.10", "2.12", "6.0", "6.5", "7.0", "7.5", "8.0",
    "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18",
    "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"
  ]);
  const [totalProductWeight, setTotalProductWeight] = useState("");
  const [goldType, setGoldType] = useState(["Yellow Gold", "White Gold", "Rose Gold"]);
  const [goldKt, setGoldKt] = useState(["14 Kt", "18 Kt", "22 Kt", "24 Kt"]);
  const [diamondType, setDiamondType] = useState(["SI IJ", "SI GH", "VS GH", "VVS EF"]);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pricesChanged, setPricesChanged] = useState(false); // Track if price fields have changed

  // Function to calculate total
  const calculateTotal = () => {
    if (!editedProduct) return;

    if (pricesChanged) {
      const { diamondprice = 0, goldprice = 0, stoneprice = 0, makingCharges = 0, gst = 0, offer = 0 } = editedProduct;
      const diamondPrice = parseFloat(diamondprice) || 0;
      const goldPrice = parseFloat(goldprice) || 0;
      const stonePrice = parseFloat(stoneprice) || 0;
      const charges = parseFloat(makingCharges) || 0;
      const gstAmount = parseFloat(gst) || 0;
      const offerPrice = parseFloat(offer) || 0;
      const subtotal = diamondPrice + goldPrice + stonePrice + charges + gstAmount;
      const mintotal = subtotal - offerPrice;
      const total = mintotal;

      if (!isNaN(total)) {
        setEditedProduct(prevState => ({
          ...prevState,
          total: total.toString(),
        }));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  useEffect(() => {
    if (editedProduct && !editedProduct.size) {
      setEditedProduct(prevState => ({
        ...prevState,
        size: selectedSizes
      }));
    }
  }, [editedProduct, selectedSizes]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/getDetailsByProductId/${productId}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const [categorySizes, setCategorySizes] = useState([]);

  useEffect(() => {
    if (editedProduct && editedProduct.category) {
      fetchAvailableSizes(editedProduct.category);
    }
  }, [editedProduct]);

  const fetchAvailableSizes = async (categoryId) => {
    try {
      let sizes = [];
      if (categoryId === "65ca1b8d0d0fd270c281a205") {
        sizes = [
          "2.2", "2.4", "2.6", "2.8", "2.10", "2.12", "6.0", "6.5", "7.0", "7.5", "8.0"
        ];
      } else if (categoryId === "65cc8cdc7a00a0bcd537f873") {
        sizes = [
          "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
          "24", "25", "26", "27", "28", "29", "30",
        ];
      }
      setCategorySizes(sizes);
    } catch (error) {
      console.error("Error fetching available sizes:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === 'videoProduct') {
      setVideoFile(files[0]); // Update videoFile state
    } 

    if (name === 'productPictures') {
      setImageFiles(Array.from(files));
    } else if (name === 'videoProduct') {
      setVideoFile(files[0]);
    } else if (type === 'select-multiple') {
      if (name === 'size') {
        const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
        setEditedProduct(prevState => ({
          ...prevState,
          [name]: selectedValues,
        }));
      } else {
        const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
        setEditedProduct(prevState => ({
          ...prevState,
          [name]: selectedValues,
        }));
      }
    } else {
      setEditedProduct(prevState => ({
        ...prevState,
        [name]: value,
      }));
      if (['diamondprice', 'goldprice', 'stoneprice', 'makingCharges', 'gst', 'offer'].includes(name)) {
        setPricesChanged(true); // Set flag if price fields are changed
      }
    }
  };

  const handleSave = async () => {
    try {
      const editedProductClone = { ...editedProduct };

      const convertToIndianFormat = (value) => {
        if (value === "") return value;

        const number = parseFloat(value);
        if (isNaN(number)) return value;

        const formatter = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        });

        return formatter.format(number).replace("₹", "");
      };

      if (pricesChanged) {
        editedProductClone.diamondprice = convertToIndianFormat(editedProductClone.diamondprice);
        editedProductClone.goldprice = convertToIndianFormat(editedProductClone.goldprice);
        editedProductClone.stoneprice = convertToIndianFormat(editedProductClone.stoneprice);
        editedProductClone.makingCharges = convertToIndianFormat(editedProductClone.makingCharges);
        editedProductClone.gst = convertToIndianFormat(editedProductClone.gst);
        editedProductClone.offer = convertToIndianFormat(editedProductClone.offer);
        editedProductClone.total = convertToIndianFormat(editedProductClone.total);
      } else {
        delete editedProductClone.diamondprice;
        delete editedProductClone.goldprice;
        delete editedProductClone.stoneprice;
        delete editedProductClone.makingCharges;
        delete editedProductClone.gst;
        delete editedProductClone.offer;
        delete editedProductClone.total;
      }

      const formDataToSend = new FormData();

        Object.keys(editedProductClone).forEach((key) => {
        if (key === 'productPictures') {
          imageFiles.forEach(file => formDataToSend.append('images', file));
        } else if (key === 'videoProduct') {
          formDataToSend.append('video', videoFile); // Append video file to FormData
        } else if (Array.isArray(editedProductClone[key])) {
          editedProductClone[key].forEach(value => formDataToSend.append(key, value));
        } else {
          formDataToSend.append(key, editedProductClone[key]);
        }
      });

      selectedSizes.forEach(size => formDataToSend.append('sizes', size));

      const response = await axiosInstance.put(`/editProduct/${productId}`, formDataToSend);
      if (response.status === 200) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          fetchData();
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [pricesChanged]);

  return (
    <div className="container">
      {editedProduct && (
        <div className="detail-details">
          <h1>Edit Product</h1>
          <div className="detail-info">
            <div className="row">
              <div className="col">
                <label>Category:</label>
                <span>{editedProduct.category}</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Product Code:</label>
                <span>{editedProduct.productCode}</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Select Sizes:</label>
                <select
                  multiple
                  name="size"
                  value={editedProduct.size}
                  onChange={handleChange}
                >
                  {categorySizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Gold Type:</label>
                <select
                  name="goldType"
                  value={editedProduct.goldType}
                  onChange={handleChange}
                  multiple
                >
                  {goldType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Gold Karat:</label>
                <select
                  name="goldKt"
                  value={editedProduct.goldKt}
                  onChange={handleChange}
                  multiple
                >
                  {goldKt.map((kt) => (
                    <option key={kt} value={kt}>
                      {kt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label>Diamond Type:</label>
                <select
                  name="diamondType"
                  value={editedProduct.diamondType}
                  onChange={handleChange}
                  multiple
                >
                  {diamondType.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              {Object.keys(editedProduct).map((key) => (
                typeof editedProduct[key] === 'string' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'videoProduct' && key !== 'productPictures' && key !== 'category' && key !== 'productCode' &&
                <div className="col" key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    name={key}
                    value={editedProduct[key]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div className="row">
              <div className="col">
                <label>Images:</label>
                <input
                  type="file"
                  name="productPictures"
                  onChange={handleChange}
                  multiple
                  accept="image/*"
                />
                {editedProduct.productPictures && editedProduct.productPictures.map((picture, index) => (
                  <img key={index} src={`http://localhost:2000${picture.img}`} alt={`Product Image ${index}`} className="img-fluid mb-3" />
                ))}
                {imageFiles.map((file, index) => (
                  <img key={index} src={URL.createObjectURL(file)} alt={`New Image ${index}`} className="img-fluid mb-3" />
                ))}
              </div>
            </div>
            <div className="row">
            {editedProduct.videoProduct ? (
  <div className="row">
    <div className="col">
      <label>Video:</label>
      <input
        type="file"
        name="videoProduct"
        onChange={handleChange}
        accept="video/*"
      />
      {editedProduct.videoProduct && (
        <video controls className="video-player">
          <source src={`http://localhost:2000${editedProduct.videoProduct}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {videoFile && (
        <video controls className="video-player">
          <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  </div>
) : (
  <div className="add-video">
    <label>Add Video:</label>
    <input
      type="file"
      name="videoProduct"
      onChange={handleChange}
      accept="video/*"
    />
    {videoFile && (
      <video controls className="video-player">
        <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )}
  </div>
)}

            </div>
          </div>
          <button onClick={handleSave}>Save</button>
        </div>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content-big">
            <span className="close" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProduct;