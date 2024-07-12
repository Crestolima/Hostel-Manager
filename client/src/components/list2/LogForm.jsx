// LogForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LogForm = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [reason, setReason] = useState('');

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/log-out', {
        regNo: 'studentRegNo', // Replace with actual regNo from context or state
        roomNo: 'studentRoomNo', // Replace with actual roomNo from context or state
        remarks: reason,
      });
      console.log(response.data);
      setIsLoggingOut(false);
    } catch (error) {
      console.error('Error logging out:', error.response.data);
    }
  };

  const handleLogIn = async () => {
    try {
      const response = await axios.post('/api/log-in', {
        regNo: 'studentRegNo', // Replace with actual regNo from context or state
        roomNo: 'studentRoomNo', // Replace with actual roomNo from context or state
      });
      console.log(response.data);
      setIsLoggingOut(true);
    } catch (error) {
      console.error('Error logging in:', error.response.data);
    }
  };

  return (
    <div>
      {isLoggingOut ? (
        <div>
          <h1>STUDENT LOG-OUT ENTRY</h1>
          <form onSubmit={handleLogOut}>
            <label>
              Reason:
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>
            <button type="submit">I'll be back</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>STUDENT LOG-IN ENTRY</h1>
          <button onClick={handleLogIn}>I'm back</button>
        </div>
      )}
    </div>
  );
};

export default LogForm;
