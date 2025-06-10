import React, { useEffect, useState } from "react";
import axios from "../services/api";
import BugStatusUpdateForm from "../components/BugStatusUpdateForm";
import '../Styles/DeveloperDashboard.css';

function DeveloperDashboard() {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("assignedProjects");
  const [titleFilter, setTitleFilter] = useState("");

  const fetchBugs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
    } catch (error) {
      console.error("Failed to fetch assigned bugs:", error);
    }
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/projects/assigned", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch assigned projects:", error);
    }
  };

  const getPriorityRank = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return 1;
      case "MEDIUM": return 2;
      case "LOW": return 3;
      default: return 4;
    }
  };

  useEffect(() => {
    fetchBugs();
    fetchProjects();
  }, []);

  const groupBugsByStatus = () => {
    const filtered = bugs
      .filter(
        (b) =>
          b.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
          b.assignedTo?.username === localStorage.getItem("username") 
      )
      .sort((a, b) => {
        const priorityDiff = getPriorityRank(a.priority) - getPriorityRank(b.priority);
        return priorityDiff !== 0 ? priorityDiff : a.id - b.id;
      });
  
    const grouped = {
      ASSIGNED: [],
      IN_PROGRESS: [],
      RESOLVED: [],
    };
  
    filtered.forEach((bug) => {
      const status = bug.status?.toUpperCase() || "ASSIGNED";
      if (grouped[status]) {
        grouped[status].push(bug);
      }
    });
  
    return grouped;
  };
  
  const groupedBugs = groupBugsByStatus();
  
  return (
    <div className="developer-dashboard">
      <h2>Welcome, Developer 👨‍💻</h2>
      <p className="subtitle">View assigned projects and manage your bugs</p>

      <div className="developer-stats">
        <div className="stat-card">
          <h3>Assigned Projects</h3>
          <div className="value">{projects.length}</div>
        </div>
        <div className="stat-card">
          <h3>Active Bugs</h3>
          <div className="value">{bugs.filter(bug => bug.status !== 'CLOSED').length}</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("assignedProjects")}>📁 Assigned Projects</button>
        <button onClick={() => setActiveTab("bugReports")}>🐞 Bug Reports</button>
      </div>

      <div className="admin-content">
        {activeTab === "assignedProjects" && (
          <div className="bug-list">
            <h3>Assigned Projects</h3>
            {projects.length === 0 ? (
              <div className="no-projects">
                <i className="fas fa-folder-open"></i>
                <p>No projects assigned yet.</p>
              </div>
            ) : (
              <div className="assigned-projects-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-name">
                      <i className="fas fa-project-diagram"></i>
                      {project.name}
                    </div>
                    <div className="project-details">
                      <div className="project-detail">
                        <i className="fas fa-code-branch"></i>
                        <span>Project ID: {project.id}</span>
                      </div>
                    </div>
                    <p className="project-description">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

{activeTab === "bugReports" && (
  <div className="bug-list">
    <h3>Assigned Bugs</h3>
    <input
      type="text"
      className="input"
      placeholder="Filter by title..."
      value={titleFilter}
      onChange={(e) => setTitleFilter(e.target.value)}
    />

    {["ASSIGNED", "IN_PROGRESS", "RESOLVED"].map((status) => (
      groupedBugs[status]?.length > 0 && (
        <div key={status} className="bug-status-section">
          <h4>{status.replace("_", " ")}</h4>
          {groupedBugs[status].map((bug) => (
            <div key={bug.id} className="card">
              <h4>{bug.title}</h4>
              <p><strong>Bug_id:</strong> {bug.id}</p>
              <p><strong>Project:</strong> {bug.project?.name || "N/A"}</p>
              <p><strong>Description:</strong> {bug.description}</p>
              <p><strong>Status:</strong> {bug.status}</p>
              <p><strong>Priority:</strong> {bug.priority}</p>
              <p><strong>Resolution:</strong> {bug.resolution || "Not provided yet."}</p>
              <div className="bug-status-form-container">
                <BugStatusUpdateForm
                  bug={bug}
                  currentStatus={bug.status}
                  onUpdate={fetchBugs}
                />
              </div>
            </div>
          ))}
        </div>
      )
    ))}
  </div>
)}

      </div>
    </div>
  );
}

export default DeveloperDashboard;
