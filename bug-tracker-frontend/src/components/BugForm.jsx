import React, { useEffect, useState } from "react";
import axios from "../services/api";
import "../Styles/BugForm.css"


function BugForm({ onSubmitSuccess = () => {} }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "LOW",
    projectId: "",
  });
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/projects/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (error) {
        setError("Failed to load projects. Please try again.");
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignedProjects();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/bugs",
        {
          title: form.title,
          description: form.description,
          priority: form.priority,
          project: { id: form.projectId },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Bug submitted:", res.data);
      onSubmitSuccess();
      setForm({ title: "", description: "", priority: "LOW", projectId: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit bug. Please try again.");
      console.error("Bug submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bug-form-container">
      <form className="bug-form" onSubmit={handleSubmit}>
        <h3>Report Bug</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="title"
          placeholder="Bug Title"
          value={form.title}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
        
        <select 
          name="priority" 
          value={form.priority} 
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        
        <select 
          name="projectId" 
          value={form.projectId} 
          onChange={handleChange} 
          required
          disabled={isLoading || isSubmitting}
        >
          <option value="">Select Project</option>
          {projects.map(proj => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
        
        <button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Submitting..." : "Submit Bug"}
        </button>
      </form>
    </div>
  );
}

export default BugForm;