import React, { useState, useEffect } from 'react';
import axiosInstance from '../helpers/axios';
import { useNavigate, useParams } from 'react-router-dom';
import './PopStyles.css';
const EditCategory = () => {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    uploadImage: false,
    uploadVideo: false,
    image: null,
    video: null,
    categoryImage: null,
    newImage: null,
  });

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/getCategoryById/${categoryId}`);
        const category = response.data.category;
        setFormData({
          name: category.name,
          uploadImage: !!category.categoryImage,
          uploadVideo: !!category.categoryVideo,
          image: null,
          video: null,
          categoryImage: category.categoryImage,
        });
      } catch (error) {
        console.error('Error fetching category details:', error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
      newImage: URL.createObjectURL(e.target.files[0]),
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

    const formDataToSend = new FormData();
    formDataToSend.append('categoryId', categoryId); // Include categoryId in form data
    formDataToSend.append('name', formData.name);
    formDataToSend.append('uploadImage', formData.uploadImage);
    formDataToSend.append('uploadVideo', formData.uploadVideo);
    formDataToSend.append('categoryImage', formData.categoryImage);

    if (formData.uploadImage && formData.image) {
      formDataToSend.append('image', formData.image);
    }

    if (formData.uploadVideo && formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axiosInstance.put(`/editCategory/${categoryId}`, formDataToSend);
      if (response.status === 200) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/getCategories');
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

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      categoryImage: null,
    });
  };

  return (
    <div className="container">
       <div className="category-header" >
            <h1 className="category-header-text" style={{textAlign:"center"}}>Edit Categories</h1>
               </div>
      <div className="row ">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            {formData.categoryImage && (
              <div className="mb-3">
                <label htmlFor="existingImage" className="form-label">Existing Image:</label>
                <img 
                  src={`http://localhost:2000${formData.categoryImage}`} 
                  alt={`${formData.name} Image`}
                  style={{width:"200px"}}
                />
              </div>
            )}
            {formData.newImage && (
              <div className="mb-3">
                <label htmlFor="newImage" className="form-label">New Image:</label>
                <img 
                  src={formData.newImage} 
                  alt="New Image"
                  style={{width:"200px"}}
                />
              </div>
            )}
            </div>
            <div style={{display:"flex", justifyContent:"start", alignItems:"center"}}>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="uploadImage"
                name="uploadImage"
                checked={formData.uploadImage}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label htmlFor="uploadImage" className="form-check-label">Change Image</label>
            </div>
            {formData.categoryImage && (
              <div className="mb-3 form-check" style={{marginLeft:"20px"}}>
                <input
                  type="checkbox"
                  id="removeImage"
                  name="removeImage"
                  onChange={handleRemoveImage}
                  className="form-check-input"
                />
                <label htmlFor="removeImage" className="form-check-label">Remove Image</label>
              </div>
            )}
            <div className="mb-3 form-check" style={{marginLeft:"20px"}}>
              <input
                type="checkbox"
                id="uploadVideo"
                name="uploadVideo"
                checked={formData.uploadVideo}
                onChange={handleCheckboxChange}
                className="form-check-input"
              />
              <label htmlFor="uploadVideo" className="form-check-label">Upload Video</label>
            </div>
            </div>
            {formData.uploadImage && (
              <div className="mb-3">
                <label htmlFor="image" className="form-label">New Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>
            )}
            
            
            {formData.uploadVideo && (
              <div className="mb-3">
                <label htmlFor="video" className="form-label">Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  id="video"
                  name="video"
                  onChange={handleVideoChange}
                  className="form-control"
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary">Update Category</button>
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
      </div>
    </div>
  );
};

export default EditCategory;
