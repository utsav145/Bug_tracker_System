// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import ManageProjects from "./ManageProjects";
import ViewDevelopers from "./ViewDevelopers";
import ViewTesters from "./ViewTesters";
import BugReport from "./BugReport";
import Register from "../components/RegisterForm";
import '../Styles/AdminDashboard.css';  

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <ManageProjects />;
      case "viewdevelopers":
        return <ViewDevelopers />;
      case "viewtesters":
        return <ViewTesters />;
      case "register":
        return <Register />;
      case "bugs":
        return <BugReport userRole="ADMIN" />;
      default:
        return <ManageProjects />;
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin 👨‍💼</h2>
      <p className="subtitle">Manage all users, projects, and bug reports</p>

      <div className="admin-tabs">
        <button onClick={() => setActiveTab("projects")}>📁 Projects</button>
        <button onClick={() => setActiveTab("viewdevelopers")}>👨‍💻 Developers</button>
        <button onClick={() => setActiveTab("viewtesters")}>🧪 Testers</button>
        <button onClick={() => setActiveTab("register")}>➕ Add User</button>
        <button onClick={() => setActiveTab("bugs")}>🐞 Bug Reports</button>
      </div>

      <div className="admin-content">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
