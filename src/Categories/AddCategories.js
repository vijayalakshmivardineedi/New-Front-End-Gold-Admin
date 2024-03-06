import React, { useState } from 'react';
import axiosInstance from '../helpers/axios';
import { useNavigate } from 'react-router-dom';
const AddCategory = () => {
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    uploadImage: false,
    uploadVideo: false,
    image: null,
    video: null,
  });

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
    formDataToSend.append('name', formData.name);

    if (formData.uploadImage) {
      formDataToSend.append('image', formData.image);
    }

    if (formData.uploadVideo) {
      formDataToSend.append('video', formData.video);
    }

    try {
      const response = await axiosInstance.post('/addCategory', formDataToSend);
      if (response.status === 201) {
        setMessage('Category successfully created');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/');
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
    <div className="category-container ">
        <div className="category-header" >
            <h1 className="category-header-text" style={{textAlign:"center"}}>Add Categories</h1>
               </div>
      <div className="row m-4 ">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fs-4">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control fs-4"
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="uploadImage"
                name="uploadImage"
                checked={formData.uploadImage}
                onChange={handleCheckboxChange}
                className="form-check-input fs-5"
              />
              <label htmlFor="uploadImage" className="form-check-label fs-5">Upload Image</label>
            </div>
            {formData.uploadImage && (
              <div className="mb-3">
                <label htmlFor="image" className="form-label fs-5">Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  className="form-control "
                />
              </div>
            )}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="uploadVideo"
                name="uploadVideo"
                checked={formData.uploadVideo}
                onChange={handleCheckboxChange}
                className="form-check-input fs-5"
              />
              <label htmlFor="uploadVideo" className="form-check-label fs-5">Upload Video</label>
            </div>
            {formData.uploadVideo && (
              <div className="mb-3">
                <label htmlFor="video" className="form-label fs-5">Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  id="video"
                  name="video"
                  onChange={handleVideoChange}
                  className="form-control "
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary">Create Reminder</button>
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

export default AddCategory;
