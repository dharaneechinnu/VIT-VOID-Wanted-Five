import React, { useState } from "react";
import axios from "axios";
import "./admin.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3500/admin/login", formData);
      alert("Login Successful!");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="form-background">
      <div className="form-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            placeholder="Enter your username"
            onChange={handleChange}
            required 
          />

          <label>Password</label>
          <input 
            type="password" 
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required 
          />

          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
