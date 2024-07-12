import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LogEntries = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs'); // Adjust the API endpoint as needed
        setLogs(response.data.logs || []); // Ensure logs is an array
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLogs([]); // Set logs to an empty array in case of error
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      {Array.isArray(logs) && logs.length > 0 ? (
        logs.map((log) => (
          <div key={log._id}>{log.message}</div>
        ))
      ) : (
        <div>No logs available</div>
      )}
    </div>
  );
};

export default LogEntries;
