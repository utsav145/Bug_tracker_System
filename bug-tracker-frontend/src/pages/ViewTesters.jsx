import React, { useEffect, useState } from "react";
import axios from "../services/api";
import '../Styles/ViewTesters.css';

const ViewTesters = () => {
  const [testers, setTesters] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTesters = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/auth/users?role=TESTER", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTesters(response.data);
      } catch (error) {
        console.error("Failed to fetch testers", error);
      }
    };
   fetchTesters();
  }, []);

  const filteredTesters = testers.filter((tester) =>
    tester.username.toLowerCase().includes(search.toLowerCase())
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
    <div className="view-testers-container">
      <h2 className="view-testers-title">View Testers</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="testers-table-container">
        <table className="testers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {filteredTesters.map((tester) => (
            <tr key={tester.id}>
              <td>{tester.id}</td>
              <td>{tester.username}</td>
                <td className="action-buttons">
                  <button 
                    className="assign-button"
                    onClick={() => handleAssignProject(tester.id, "TESTER")}
                  >
                    Assign Project
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemove(tester.id, "TESTER")}
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

export default ViewTesters;
