import React, { useState } from 'react';
import axios from '../services/api';
import '../Styles/BugStatusUpdateForm.css';

const BugStatusUpdateForm = ({ bug, currentStatus, onUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [resolution, setResolution] = useState(bug.resolution || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const payload = { status };
      if (status === "RESOLVED") {
        if (!resolution.trim()) {
          setMessage("Resolution is required when resolving a bug.");
          return;
        }
        payload.resolution = resolution;
      }

      await axios.put(`/bugs/${bug.id}/status`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Status updated successfully!");
      onUpdate();
    } catch (err) {
      setMessage("Error updating status");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="status-update-form">
      <h4>Update Status</h4>
      <select 
        value={status} 
        onChange={e => setStatus(e.target.value)}
        className="status-select"
      >
         <option value="Assigned">Assigned</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      {status === "RESOLVED" && (
        <div className="resolution-container">
          <textarea
            placeholder="Enter resolution..."
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="resolution-textarea"
          />
        </div>
      )}

      <button type="submit" className="update-button">
        Update Status
      </button>

      {message && (
        <p className={`status-message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </form>
  );
};

export default BugStatusUpdateForm;
