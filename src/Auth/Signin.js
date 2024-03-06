import React, { useState, useEffect } from 'react';
import './Auth.css'; // Import the CSS file for styling
import { Api } from '../helpers/axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './PopStyles.css'; // Import CSS file for popup styling
import LogoImage from "../assets/logo/Logo.png"
const Signin = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/signin', formData);
            if (response.status === 200) {
                setMessage(response.data.message);
                setShowPopup(true); // Show popup on successful sign-in
                // Store the signed-in user data in localStorage as an Admin
                localStorage.setItem('AdminToken', response.data.token);
                localStorage.setItem('Admin', JSON.stringify(response.data.admin));
                // Delay navigation by 2 seconds (2000 milliseconds)
                setTimeout(() => {
                    setShowPopup(false); // Hide the popup after 2 seconds
                    navigate('/GetCategories'); // Navigate to Dashboard
                }, 1000);
            }
        } catch (error) {
            setMessage(error.response.data.message || error.response.data.error);
            setShowPopup(true); // Show popup on failed sign-in
            // Delay hiding the popup and navigation by 2 seconds (2000 milliseconds)
            setTimeout(() => {
                setShowPopup(false); // Hide the popup after 2 seconds
                // navigate('/Login'); // Navigate back to Login page
            }, 1000);
            console.error('Signin Error:', error);
        }
    };

    return (
        <div className="auth-container">
            <img src={LogoImage} alt='logo' style={{width: "200px"}}/>
            <h2>Sign In </h2>
            <form onSubmit={handleSubmit} style={{ maxWidth: "300px", margin: "0 auto" }}>
                <div className="signin-text" style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        style={{
                            padding: "10px",
                            width: "350px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                        className='form-control'
                    />
                </div>
                <div className="signin-text" style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className='form-control'
                        style={{
                            padding: "10px",
                            width: "350px",
                            borderRadius: "5px",
                            border: "1px solid #ccc"
                        }}
                        required
                    />
                    <div className="form-group">
                <Link to="/Forgotpassword" className="btn btn-link">Forgot Password ?</Link>
            </div>
                </div>
                
                <div className="form-group button-style">
                    <button type="submit">Sign In</button>
                </div>
            </form>
          
            <div className="form-group">
                <Link to="/signup" className="btn btn-link">Create New Account</Link>
            </div>
            {showPopup && ( // Display popup only if showPopup is true
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

export default Signin;