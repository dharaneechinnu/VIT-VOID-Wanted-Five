import React, { useState } from "react";
import axios from "axios";
import "./admin.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    orgName: "",
    donorType: "",
    contactPerson: "",
    contactEmail: "",
    website: "",
    requestMessage: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3500/admin/register", formData);
      alert(res.data.message || "Registration Successful!");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="form-background">
      <div className="form-box">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Organization Name</label>
          <input
            type="text"
            name="orgName"
            placeholder="Enter your organization name"
            onChange={handleChange}
            required
          />

          <label>Type of Donor</label>
          <select name="donorType" onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Individual">Individual</option>
            <option value="NGO">NGO</option>
            <option value="CSR">CSR</option>
          </select>

          <label>Contact Person / Phone Number</label>
          <input
            type="text"
            name="contactPerson"
            placeholder="Enter contact person or phone number"
            onChange={handleChange}
            required
          />

          <label>Official Email Address</label>
          <input
            type="email"
            name="contactEmail"
            placeholder="Enter your official email"
            onChange={handleChange}
            required
          />

          <label>Organization Website (optional)</label>
          <input
            type="text"
            name="website"
            placeholder="Enter organization website"
            onChange={handleChange}
          />

          <label>Reason / Message for Registration</label>
          <textarea
            name="requestMessage"
            placeholder="Explain your reason for registration"
            onChange={handleChange}
            required
          />

          <label>Create Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;

