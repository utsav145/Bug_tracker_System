import React, { useState } from "react";
import axios from "../services/api";
import '../Styles/ProjectForm.css';

function ProjectForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('/projects', {
        name: form.name,
        description: form.description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onCreated();
      setForm({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <div className="create-project-container">
      <form onSubmit={handleSubmit} className="create-project-form">
        <h3 className="create-project-title">Create Project</h3>
        
        <div className="create-project-row">
          <div className="create-project-group">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={form.name}
              onChange={handleChange}
              required
              className="create-project-input"
            />
          </div>

          <div className="create-project-group">
            <textarea
              name="description"
              placeholder="Project Description"
              value={form.description}
              onChange={handleChange}
              required
              className="create-project-textarea"
            />
          </div>
        </div>

        <button type="submit" className="create-project-button">Create</button>
      </form>
    </div>
  );
}

export default ProjectForm;
