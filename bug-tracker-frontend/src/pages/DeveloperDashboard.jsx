import React, { useEffect, useState } from "react";
import axios from "../services/api";
import BugStatusUpdateForm from "../components/BugStatusUpdateForm";
import "../Styles/DeveloperDashboard.css";

function DeveloperDashboard() {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("assignedProjects");
  const [titleFilter, setTitleFilter] = useState("");
  const [statusVisibility, setStatusVisibility] = useState({
    ASSIGNED: true,
    IN_PROGRESS: true,
    RESOLVED: true,
  });
  const [timeFilters, setTimeFilters] = useState({
    ASSIGNED: "1",
    IN_PROGRESS: "1",
    RESOLVED: "1",
  });

  const fetchBugs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
    } catch (error) {
      console.error("Failed to fetch bugs:", error);
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
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchBugs();
    fetchProjects();
  }, []);

  const getPriorityRank = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return 1;
      case "MEDIUM":
        return 2;
      case "LOW":
        return 3;
      default:
        return 4;
    }
  };

  const filterByTime = (bugs, timeFilter) => {
    if (timeFilter === "all") return bugs;

    const now = new Date();
    return bugs.filter((bug) => {
      const created = new Date(bug.createdAt);
      const diffInMs = now - created;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (timeFilter === "1") return diffInDays <= 1;
      if (timeFilter === "7") return diffInDays <= 7;
      if (timeFilter === "30") return diffInDays <= 30;
      return true;
    });
  };

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
      if (grouped[status]) grouped[status].push(bug);
    });

    return grouped;
  };

  const handleToggleStatus = (status) => {
    setStatusVisibility((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleTimeChange = (status, value) => {
    setTimeFilters((prev) => ({
      ...prev,
      [status]: value,
    }));
  };

  const groupedBugs = groupBugsByStatus();

  const renderSection = (statusLabel, bugsForStatus) => {
    const filteredBugs = filterByTime(bugsForStatus, timeFilters[statusLabel]);

    return (
      <div key={statusLabel} className="bug-status-section">
        <div className="bug-status-header">
          <h4>
            {statusLabel.replace("_", " ")} ({filteredBugs.length})
          </h4>
          <div>
            <label>Filter by time: </label>
            <select
              value={timeFilters[statusLabel]}
              onChange={(e) => handleTimeChange(statusLabel, e.target.value)}
            >            
              <option value="1">Last 1 Day</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="all">All</option>
            </select>
            <button onClick={() => handleToggleStatus(statusLabel)}>
              {statusVisibility[statusLabel] ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {statusVisibility[statusLabel] && (
          <div className="bug-cards">
            {filteredBugs.length === 0 ? (
              <div className="no-bugs-message">
                No bugs found for the selected time filter.
              </div>
            ) : (
              filteredBugs.map((bug) => (
                <div key={bug.id} className="card">
                  <h4>{bug.title}</h4>
                  <p><strong>Bug ID:</strong> {bug.id}</p>
                  <p><strong>Project:</strong> {bug.project?.name || "N/A"}</p>
                  <p><strong>Description:</strong> {bug.description}</p>
                  <p><strong>Status:</strong> {bug.status}</p>
                  <p><strong>Priority:</strong> {bug.priority}</p>
                  <p><strong>Created_At:</strong> {bug.createdAt}</p>
                  <p><strong>Resolution:</strong> {bug.resolution || "Not provided yet."}</p>
              
                  <div className="bug-status-form-container">
                    <BugStatusUpdateForm
                      bug={bug}
                      currentStatus={bug.status}
                      onUpdate={fetchBugs}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

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
          <div className="value">{bugs.filter((bug) => bug.status !== "CLOSED").length}</div>
        </div>
      </div>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("assignedProjects")}>
          📁 Assigned Projects
        </button>
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
            {["ASSIGNED", "IN_PROGRESS", "RESOLVED"].map((status) =>
              renderSection(status, groupedBugs[status])
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeveloperDashboard;
