import React, { useEffect, useState } from 'react';
import BugTable from '../components/BugTable';
import axios from '../services/api';
import '../Styles/BugReport.css';

const BugReport = () => {
  const [bugs, setBugs] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [userRole, setUserRole] = useState('ADMIN');
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const username = localStorage.getItem("username"); 

      setUserRole(role);
      setCurrentUsername(username);

      try {
        const bugRes = await axios.get("/bugs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBugs(bugRes.data);

        if (role === "ADMIN") {
          const devRes = await axios.get("auth/users?role=DEVELOPER", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDevelopers(devRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAssignClick = async (bugId, developerId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`/bugs/${bugId}/assign/${developerId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Bug assigned!");
      // Refresh bug list
      const res = await axios.get("/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBugs(res.data);
    } catch (error) {
      alert("Assignment failed");
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

  const groupBugsByStatus = () => {
    let visibleBugs = bugs;

    // Role-based filtering
    if (userRole === "DEVELOPER") {
      visibleBugs = bugs.filter(bug => bug.assignedTo?.username === currentUsername);
    } else if (userRole === "TESTER") {
      visibleBugs = bugs.filter(bug => bug.createdBy?.username === currentUsername);
    }

    const filtered = visibleBugs
      .filter(b => b.title.toLowerCase().includes(titleFilter.toLowerCase()))
      .sort((a, b) => {
        const priorityDiff = getPriorityRank(a.priority) - getPriorityRank(b.priority);
        return priorityDiff !== 0 ? priorityDiff : a.id - b.id;
      });

    const grouped = {
      UNASSIGNED: [],
      ASSIGNED: [],
      IN_PROGRESS: [],
      RESOLVED: [],
    };

    filtered.forEach(bug => {
      const status = bug.status?.toUpperCase() || 'UNASSIGNED';

      if (status === 'OPEN' && !bug.assignedTo) {
        grouped.UNASSIGNED.push(bug);
      } else if (grouped[status]) {
        grouped[status].push(bug);
      }
    });

    return grouped;
  };

  const groupedBugs = groupBugsByStatus();

  return (
    <div className="bug-report">
      <h2>Bug Reports 🐞</h2>
      <input
        type="text"
        className="input"
        placeholder="Search by title..."
        value={titleFilter}
        onChange={(e) => setTitleFilter(e.target.value)}
      />

      {/* Unassigned - Only visible to ADMIN */}
      {(userRole === 'ADMIN' || userRole==="TESTER") && groupedBugs.UNASSIGNED.length > 0 && (
        <div className="bug-list">
          <h3>Unassigned</h3>
          <BugTable
            bugs={groupedBugs.UNASSIGNED}
            userRole={userRole}
            onAssignClick={handleAssignClick}
            developers={developers}
          />
        </div>
      )}

      {/* Assigned, In Progress, Resolved - All roles */}
      {["ASSIGNED", "IN_PROGRESS", "RESOLVED"].map(status => (
        groupedBugs[status]?.length > 0 && (
          <div key={status} className="bug-list">
            <h3>{status.replace('_', ' ')}</h3>
            <BugTable
              bugs={groupedBugs[status]}
              userRole={userRole}
              onAssignClick={handleAssignClick}
              developers={developers}
            />
          </div>
        )
      ))}
    </div>
  );
};

export default BugReport;
