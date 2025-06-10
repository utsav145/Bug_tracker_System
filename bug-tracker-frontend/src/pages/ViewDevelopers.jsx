import React, { useEffect, useState } from "react";
import axios from "../services/api";
import '../Styles/ViewDevelopers.css';

const ViewDevelopers = () => {
  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDevelopers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/auth/users?role=DEVELOPER", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevelopers(response.data);
      } catch (error) {
        console.error("Failed to fetch developers", error);
      }
    };
    fetchDevelopers();
  }, []);

  const filteredDevelopers = developers.filter((dev) =>
    dev.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssignProject = async (userId, role) => {
    const projectId = prompt("Enter Project ID to assign:");
    if (!projectId) return;

    const token = localStorage.getItem("token");

    try {
      await axios.put(`/projects/${projectId}/assign`, null, {
        params: { userId, role },
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Project assigned successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to assign project");
    }
  };

  const handleRemove = async (userId, role) => {
    const projectId = prompt("Enter Project ID to remove:");
    if (!projectId) return;

    const token = localStorage.getItem("token");
    try {
      await axios.put(`/projects/${projectId}/unassign`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, role },
      });
      alert("User removed successfully");
    } catch (err) {
      console.error("Error unassigning user:", err);
      alert("Failed to remove user.");
    }
  };

  return (
    <div className="view-developers-container">
      <h2 className="view-developers-title">View Developers</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="developers-table-container">
        <table className="developers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevelopers.map((dev) => (
              <tr key={dev.id}>
                <td>{dev.id}</td>
                <td>{dev.username}</td>
                <td className="action-buttons">
                  <button 
                    className="assign-button"
                    onClick={() => handleAssignProject(dev.id, "DEVELOPER")}
                  >
                    Assign Project
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemove(dev.id, "DEVELOPER")}
                  >
                    Remove Project
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDevelopers;
