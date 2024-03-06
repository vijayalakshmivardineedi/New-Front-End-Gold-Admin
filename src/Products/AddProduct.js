import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import { useNavigate } from "react-router-dom";
import "./PopStyles.css";

const CreateProduct = () => {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    quantity: "",
    height: "",
    width: "",
    length: "",
    size: ["2.2", "2.4", "2.6", "2.8", "2.10", "2.12", "6.0", "6.5", 
    "7.0", "7.5", "8.0", "6", "7", "8", "9", "10", "11", "12", "13", "14", 
    "15", "16", "17", "18", "19", "20", "21", "22", "23",
    "24", "25", "26", "27", "28", "29", "30"],
    totalProductWeight: "",
    goldType: ["Yellow Gold", "White Gold", "Rose Gold"],
    goldKt: ["14 Kt", "18 Kt", "22 Kt", "24 Kt"],
    diamondType: ["SI IJ", "SI GH", "VS GH", "VVS EF"],
    diamondSize: "",
    diamondShape: "",
    diamondKt: "",
    diamondColour: "",
    diamondCount: "",
    diamondWeight: "",
    diamondClarity: "",
    diamondSettingType: "",
    stone: "",
    stoneSize: "",
    stoneShape: "",
    stonesCount: "",
    stoneColour: "",
    stoneWeight: "",
    stoneSettingtype: "",
    diamondprice: "",
    goldprice: "",
    stoneprice: "",
    makingCharges: "",
    gst: "",
    offer: "",
    total: "0",
    images: [],
    video: null,
  });


  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getCategory");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, options, value } = e.target;
  
    if (name === "category") {
      if (value === "65ca1b8d0d0fd270c281a205") {
        setAvailableSizes([
          "2.2", "2.4", "2.6", "2.8", "2.10", "2.12", "6.0", "6.5", "7.0", "7.5", "8.0"
        ]);
        
      } else if (value === "65cc8cdc7a00a0bcd537f873") {
        setAvailableSizes([
          "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23",
          "24", "25", "26", "27", "28", "29", "30",
        ]);
      } else {
        setAvailableSizes([]);
      }
    }
  
    if (name === "size" || name === "goldKt" || name === "goldType" || name === "diamondType") {
        const selectedOptions = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
    
        setFormData((prevState) => ({
          ...prevState,
          [name]: selectedOptions,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
  };
  

  useEffect(() => {
    calculateTotal();
  }, [formData]);

  const calculateTotal = () => {
    const { diamondprice, goldprice, stoneprice, makingCharges, gst, offer } =
      formData;

    const diamondPrice = parseFloat(diamondprice || 0);
    const goldPrice = parseFloat(goldprice || 0);
    const stonePrice = parseFloat(stoneprice || 0);
    const charges = parseFloat(makingCharges || 0);
    const gstAmount = parseFloat(gst || 0);
    const offerPrice = parseFloat(offer || 0);

    const subtotal =
      diamondPrice + goldPrice + stonePrice + charges + gstAmount;
    const mintotal = subtotal - offerPrice;
    const total = mintotal;

    if (total !== parseFloat(formData.total)) {
      setFormData((prevState) => ({
        ...prevState,
        total: total.toString(),
      }));
    }
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files,
    });
  };

  const handleVideoChange = (e) => {
    setFormData({
      ...formData,
      video: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Function to convert number to Indian currency format
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

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Clone formData and format prices to Indian currency
    const formDataIndianPrices = {
        ...formData,
        diamondprice: convertToIndianFormat(formData.diamondprice),
        goldprice: convertToIndianFormat(formData.goldprice),
        stoneprice: convertToIndianFormat(formData.stoneprice),
        makingCharges: convertToIndianFormat(formData.makingCharges),
        gst: convertToIndianFormat(formData.gst),
        offer: convertToIndianFormat(formData.offer),
        total: convertToIndianFormat(formData.total)
    };

    // Iterate over the formData object
    for (let key in formDataIndianPrices) {
        // Check if the key needs to be formatted into an array
        if (
            ["size", "goldType", "goldKt", "diamondType"].includes(key) &&
            Array.isArray(formDataIndianPrices[key])
        ) {
            // If it's an array, iterate over its elements and append each element to the FormData object
            formDataIndianPrices[key].forEach((value) => {
                formDataToSend.append(key, value);
            });
        } else if (key === "images") {
            // If it's the images field, iterate over the array of images and append each image to the FormData object
            Array.from(formDataIndianPrices[key]).forEach((image) => {
                formDataToSend.append("images", image);
            });
        } else {
            // For other fields, append them to the FormData object
            formDataToSend.append(key, formDataIndianPrices[key]);
        }
    }

    try {
        // Send the FormData object to the backend
        const response = await axiosInstance.post("/createProduct", formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (response.status === 201) {
            setMessage(response.data.message);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate("/getCategories");
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



console.log(availableSizes)
  return (
    <div className="container">
      <div className="row ">
        <div className="col-md-12">
          <h2>Create Product</h2>
          <form onSubmit={handleSubmit} className="add-category-form">
            <div className="row mb-3">
              <div className="col-md-3">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity" className="form-control"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Width"  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  placeholder="Length"  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Size"  className="form-control"
                  multiple 
                >
                  <option value="">Select size</option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="totalProductWeight"
                  value={formData.totalProductWeight}
                  onChange={handleChange}  className="form-control"
                  placeholder="Total Product Weight"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <select
                  name="goldType"
                  value={formData.goldType}
                  onChange={handleChange}
                  placeholder="Gold Type"  className="form-control"
                  multiple
                >
                     <option value="">Select Gold </option>
                  <option value="Yellow Gold">Yellow Gold</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="goldWeight"
                  value={formData.goldWeight}
                  onChange={handleChange}  className="form-control"
                  placeholder="Gold Weight"
                />
              </div>
              <div className="col-md-3">
                <select
                  name="goldKt"
                  value={formData.goldKt}
                  onChange={handleChange}  className="form-control"
                  placeholder="Gold Kt"
                  multiple
                >
                     <option value="">Select Gold Kt</option>
                  <option value="14 Kt">14 Kt</option>
                  <option value="18 Kt">18 Kt</option>
                  <option value="22 Kt">22 Kt</option>
                  <option value="24 Kt">24 Kt</option>
                </select>
              </div>
              <div className="col-md-3">
                <select
                  name="diamondType"
                  value={formData.diamondType}
                  onChange={handleChange}  className="form-control"
                  placeholder="Diamond Type"
                  multiple
                >
                     <option value="">Select Diamond Type</option>
                  <option value="SI IJ">SI IJ</option>
                  <option value="SI GH">SI GH</option>
                  <option value="VS GH">VS GH</option>
                  <option value="VVS EF">VVS EF</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondSize"  className="form-control"
                  value={formData.diamondSize}
                  onChange={handleChange}
                  placeholder="Diamond Size"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondShape"  className="form-control"
                  value={formData.diamondShape}
                  onChange={handleChange}
                  placeholder="Diamond Shape"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="text"  className="form-control"
                  name="diamondKt"
                  value={formData.diamondKt}
                  onChange={handleChange}
                  placeholder="Diamond Kt"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="text"  className="form-control"
                  name="diamondColour"
                  value={formData.diamondColour}
                  onChange={handleChange}
                  placeholder="Diamond Colour"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondCount"  className="form-control"
                  value={formData.diamondCount}
                  onChange={handleChange}
                  placeholder="Diamond Count"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondWeight"  className="form-control"
                  value={formData.diamondWeight}
                  onChange={handleChange}
                  placeholder="Diamond Weight"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondClarity"  className="form-control"
                  value={formData.diamondClarity}
                  onChange={handleChange}
                  placeholder="Diamond Clarity"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="diamondSettingType"  className="form-control"
                  value={formData.diamondSettingType}
                  onChange={handleChange}
                  placeholder="Diamond Setting Type"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"  className="form-control"
                  name="stone"
                  value={formData.stone}
                  onChange={handleChange}
                  placeholder="Stone"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="text"  className="form-control"
                  name="stoneSize"
                  value={formData.stoneSize}
                  onChange={handleChange}
                  placeholder="stone Size"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"  className="form-control"
                  name="stoneShape"
                  value={formData.stoneShape}
                  onChange={handleChange}
                  placeholder="stone Shape"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  name="stonesCount"  className="form-control"
                  value={formData.stonesCount}
                  onChange={handleChange}
                  placeholder="Stones Count"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                {" "}
                <input
                  type="text"
                  name="stoneColour"  className="form-control"
                  value={formData.stoneColour}
                  onChange={handleChange}
                  placeholder="Stone Colour"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="text"
                  name="stoneWeight"  className="form-control"
                  value={formData.stoneWeight}
                  onChange={handleChange}
                  placeholder="Stone Weight"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="text"  className="form-control"
                  name="stoneSettingtype"
                  value={formData.stoneSettingtype}
                  onChange={handleChange}
                  placeholder="Stone Setting Type"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"  className="form-control"
                  name="diamondprice"
                  value={formData.diamondprice}
                  onChange={handleChange}
                  placeholder="Diamond Price"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">
                {" "}
                <input
                  type="number"  className="form-control"
                  name="goldprice"
                  value={formData.goldprice}
                  onChange={handleChange}
                  placeholder="Gold Price"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"  className="form-control"
                  name="stoneprice"
                  value={formData.stoneprice}
                  onChange={handleChange}
                  placeholder="Stone Price"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"  className="form-control"
                  name="makingCharges"
                  value={formData.makingCharges}
                  onChange={handleChange}
                  placeholder="Making Charges"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"  className="form-control"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="GST"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3">
                {" "}
                <input
                  type="number"
                  name="offer"  className="form-control"
                  value={formData.offer}
                  onChange={handleChange}
                  placeholder="Offer"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="number"
                  name="total"  className="form-control"
                  value={formData.total}
                  placeholder="Total"
                />
              </div>
              <div className="col-md-3">
                {" "}
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                />
                
              </div>
              <div className="row">
              {formData.images.length > 0 && (
                  <div className="col-md-8">
                    <h5>Selected Images</h5>
                    {Array.from(formData.images).map((image, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Selected Image ${index + 1}`}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          margin: "5px",
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* Display selected video */}
                {formData.video && (
                  <div className="col-md-3">
                    <h5>Selected Video</h5>
                    <video controls style={{ maxWidth: "100px" }}>
                      <source
                        src={URL.createObjectURL(formData.video)}
                        type="video/mp4"

                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <button type="submit">Create Product</button>
              </div>
            </div>
          </form>
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
      </div>
    </div>
  );
};

export default CreateProduct;