
import axios from '../services/api';
import "../Styles/Register.css"


import { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'developer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", formData, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
      setMessage('User registered successfully');
    } catch (err) {
      setMessage('Error during registration');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register User</h2>
      <input name="username" value={formData.username} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />

      <div style={{ position: 'relative' }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '8px',
            cursor: 'pointer'
          }}
        >
          {showPassword ? '🙈' : '👁️'}
        </span>
      </div>

      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="developer">Developer</option>
        <option value="tester">Tester</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default RegisterForm;
