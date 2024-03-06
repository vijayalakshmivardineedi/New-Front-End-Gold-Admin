import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Token = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleBeforeUnload = () => {
    if (performance.navigation.type === 1) {
      // Page is being refreshed, do nothing with local storage
    } else {
      // Page is being closed, clear local storage
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      localStorage.clear();
    }
  };

  const handleUserActivity = () => {
    // Reset the timer when there is user activity
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    // Start a new timer for 5 minutes
    setLogoutTimer(
      setTimeout(() => {
        setShowModal(true);
      }, 300000) // 5 minutes (300,000 milliseconds)
    );
  };

  const handleLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    localStorage.clear();
    setShowModal(false);
    navigate('/');
  };

  const handleClose = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setShowModal(false);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const handleUserActivityWrapper = () => {
      handleUserActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivityWrapper);
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivityWrapper);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [logoutTimer]);

  return (
    <div>
      {/* Your route component content */}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Session expired</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Token;
