import React, { useState, useEffect } from 'react';
import './Auth.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate from React Router
import { Api } from '../helpers/axios';
import './PopStyles.css'; // Import CSS file for popup styling
import LogoImage from "../assets/logo/Logo.png"
const Signup = () => {
const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        contactNumber: '',
    });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await Api.post('/signup', formData);
          if (response.status === 201) {
            setMessage(response.data.message);
            setShowPopup(true);
            // Clear form fields after successful signup
            setFormData({
              firstName: '',
              secondName: '',
              email: '',
              password: '',
              contactNumber: '',
            });
            // Delay hiding the popup and navigation by 2 seconds
            setTimeout(() => {
              setShowPopup(false); // Hide the popup after 2 seconds
              navigate('/'); // Navigate to Dashboard
            }, 2000); // Delay in milliseconds
          }
        } catch (error) {
          setMessage(error.response.data.message || error.response.data.error);
          setShowPopup(true);
          console.error('Signup Error:', error);
          // Delay hiding the popup and navigation by 2 seconds
          setTimeout(() => {
            setShowPopup(false); // Hide the popup after 2 seconds
            // navigate('/Deshboard'); // Navigate to Dashboard
          }, 2000); // Delay in milliseconds
        }
      };
    


    return (
        <div className="auth-container">
              <img src={LogoImage} alt='logo' style={{width: "200px"}}/>
            <h2 style={{fontWeight:"600" , marginBottom:"20px"}}>Sign Up</h2>
            <form className="section" onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required style={{ marginRight: "10px" }} className='form-control'/>
                        <input type="text" name="secondName" value={formData.secondName} onChange={handleChange} placeholder="Second Name" required  className='form-control'/>
                    </div>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required style={{ marginBottom: "10px" }}  className='form-control'/>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={{ marginBottom: "10px" }}  className='form-control'/>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required style={{ marginBottom: "10px" }}  className='form-control'/>
                    <div className="form-group button-style">
                        <button type="submit">Sign Up</button>
                    </div>
                </div>

            </form>
            {showPopup && ( // Display popup only if showPopup is true
                <div className="popup">
                    <div className="popup-content-big">
                        <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                        <p>{message}</p>
                    </div>
                </div>
            )}
             <div className="form-group ">
            <p className="already-have-account fs-5">Already have an account?
                    <Link to="/" className="btn btn-link ">Sign In</Link>
            </p>
            </div>
        </div>
    );
};
export default Signup;