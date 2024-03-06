import React, { useState, useEffect } from 'react';
import './Auth.css'; // Import the CSS file for styling
import { Api } from '../helpers/axios';
import { useNavigate ,Link} from 'react-router-dom'; // Import useNavigate hook

import LogoImage from "../assets/logo/Logo.png"
const ForgotPassword = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false); // Hide the popup after 2 seconds
            }, 1500);

            return () => clearTimeout(timer); // Clear the timer when component unmounts
        }
    }, [showPopup]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'code') setCode(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/forgotPassword', { email });
            if (response.status === 200) {
                setStep(2); // Move to the next step
                setShowPopup(true); // Show the popup
                setMessage('Verification code sent to your email');
            }
        } catch (error) {
            setMessage('Error: Unable to send verification code');
            console.error('Send Verification Code Error:', error);
            setShowPopup(true); // Show the popup
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setShowPopup(true); // Show the popup
            return;
        }
        try {
            const response = await Api.post('/verifyCodeAndResetPassword', { email, code, newPassword: password });
            if (response.status === 200) {
                setMessage('Password reset successfully');
                setShowPopup(true); // Show the popup
                setTimeout(() => {
                    setShowPopup(false); // Hide the popup after 2 seconds
                    navigate('/'); // Navigate to Dashboard
                }, 1000);
            }
        } catch (error) {
            setMessage('Error: Unable to reset password');
            console.error('Reset Password Error:', error);
            setShowPopup(true); // Show the popup
        }
    };

    return (
        <div className="auth-container">
              <img src={LogoImage} alt='logo' style={{width: "200px"}}/>
            {step === 1 ? (
                <>
                    <h2>Forgot Password</h2>
                    <div className='section-2'>
                        <form onSubmit={handleSendVerificationCode}>
                            <div>
                                <input className="form-control box-1" type="email" name="email" value={email} onChange={handleChange} placeholder="Enter your email" required />
                            </div>
                            <div className='send-button'>
                                <button type="submit">Send Verification Code</button>
                               
                            </div>
                            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                <Link to="/" className="btn btn-link">Back to Sign In</Link>
                                </div>
                        </form>
                    </div>
                </>
            ) : (
                <>
                    <h3>Enter Verification Code and Reset Password</h3>
                    <form onSubmit={handleResetPassword}>
                        <div className="input-row">
                            <input type="text" name="code" value={code} onChange={handleChange} className=" form-control input-field" placeholder="Enter verification code" required />
                        </div>
                        <div className="input-row">
                            <input type="password" name="password" value={password} onChange={handleChange} className="form-control input-field" placeholder="Enter new password" required />
                        </div>
                        <div className="input-row">
                            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} className= " form-control input-field" placeholder="Re-enter new password" required />
                        </div>
                        <div className="button-row">
                            <button type="submit" className="reset-button">Reset Password</button>
                        </div>
                    </form>

                </>
            )}
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

export default ForgotPassword;
