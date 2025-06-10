// src/pages/TesterDashboard.jsx

import React, { useState } from "react";
import "../Styles/TesterDashboard.css"; 
import BugReport from "./BugReport";
import AssignedProjects from "../components/AssignedProjects";
import BugForm from "../components/BugForm";

function TesterDashboard() {
  const [activeTab, setActiveTab] = useState("projects");

  const renderContent = () => {
    switch (activeTab) {
      case "assignproject":
        return <AssignedProjects />;
      case "create":
        return <BugForm />;
      case "bugs":
        return <BugReport userRole="TESTER" />;
      default:
        return <BugReport userRole="TESTER" />;
    }
  };

  return (
    <div className="tester-dashboard">
      <h2>Welcome, Tester 🧪</h2>
      <p className="subtitle">View assigned projects and manage bug reports</p>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("assignproject")}>📁 Assigned Projects</button>
        <button onClick={() => setActiveTab("create")}>➕ Create Bug</button>
        <button onClick={() => setActiveTab("bugs")}>🐞 Bug Reports</button>
      </div>

      <div className="admin-content">{renderContent()}</div>
    </div>
  );
}

export default TesterDashboard;
