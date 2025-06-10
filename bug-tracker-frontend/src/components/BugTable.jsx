import React, { useState } from "react";
import "../Styles/BugTable.css";

function BugTable({ bugs, userRole = "ADMIN", onEdit, onAssignClick, developers = [] }) {
  const [selectedDevelopers, setSelectedDevelopers] = useState({});

  const handleDeveloperChange = (bugId, developerId) => {
    setSelectedDevelopers(prev => ({ ...prev, [bugId]: developerId }));
  };

  return (
    <div className="bug-table-container">
      <table className="bug-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Project</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Created By</th>
            
            {userRole === "ADMIN" && <th>Assign Developer</th>}
            {(userRole === "ADMIN" ) && <th>Actions</th>}
            <th>Resolution</th>
          </tr>
        </thead>
        <tbody>
          {bugs.map(bug => (
            <tr key={bug.id}>
              <td>{bug.title}</td>
              <td>{bug.project?.name || "N/A"}</td>
              <td data-priority={bug.priority}>{bug.priority}</td>
              <td data-status={bug.status}>{bug.status}</td>
              <td>{bug.assignedTo?.username || "Unassigned"}</td>
              <td>{bug.createdBy?.username || "Unknown"}</td>

            
              {userRole === "ADMIN" && (
                <td>
                  <select
                    value={selectedDevelopers[bug.id] || ""}
                    onChange={(e) => handleDeveloperChange(bug.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    {developers
                      .filter(dev => dev.assignedAsDeveloper?.some(p => p.id === bug.project?.id))
                      .map(dev => (
                        <option key={dev.id} value={dev.id}>{dev.username}</option>
                      ))}
                  </select>
                </td>
              )}

              {(userRole === "ADMIN") && (
                <td>
                  {userRole === "ADMIN" && (
                    <button
                      onClick={() => {
                        const devId = selectedDevelopers[bug.id];
                        if (!devId) {
                          alert("Please select a developer.");
                          return;
                        }
                        onAssignClick(bug.id, devId);
                      }}
                    >
                      Assign
                    </button>
                  )}
                  {userRole === "DEVELOPER" && (
                    <button
                      onClick={() => {
                        if (!bug.id) {
                          alert("Bug ID is undefined. Cannot update status.");
                          return;
                        }
                        onEdit?.(bug);
                      }}
                    >
                      Update
                    </button>
                  )}
                </td>
              )}
              <td>
                {userRole === "DEVELOPER" && bug.status === "IN_PROGRESS" ? (
                  <input
                    type="text"
                    value={bug.resolution || ""}
                    onChange={(e) => onEdit?.({ ...bug, resolution: e.target.value })}
                    placeholder="Enter resolution"
                  />
                ) : (
                  bug.resolution || "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BugTable;