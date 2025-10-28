import React, { useState } from "react";
import axios from "axios";

const VerifierRegister = () => {
  const [formData, setFormData] = useState({
    Inititutename: "",
    institutionType: "",
    institutionCode: "",
    contactEmail: "",
    contactperson: "",
    requestMessage: "",
    website: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3500/verifier/register",
        formData
      );

      if (res.status === 200 || res.status === 201) {
        setMessage("✅ Verifier request submitted successfully!");
      } else {
        setMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Server error. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline styles right here */}
      <style>
        {`
          .verifier-container {
            max-width: 520px;
            margin: 60px auto;
            padding: 35px;
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            transition: 0.3s ease-in-out;
          }

          .verifier-container:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          .verifier-heading {
            text-align: center;
            font-size: 1.6rem;
            margin-bottom: 25px;
            color: #222;
            font-weight: 600;
          }

          .verifier-form {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .verifier-input,
          .verifier-textarea {
            width: 100%;
            padding: 10px 12px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 8px;
            outline: none;
            transition: 0.2s ease;
          }

          .verifier-input:focus,
          .verifier-textarea:focus {
            border-color: #00b7ff;
            box-shadow: 0 0 5px rgba(0, 183, 255, 0.5);
          }

          .verifier-textarea {
            min-height: 90px;
            resize: vertical;
          }

          .verifier-button {
            background-color: #007bff;
            color: #fff;
            padding: 12px;
            font-size: 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
            margin-top: 5px;
          }

          .verifier-button:hover {
            background-color: #0056b3;
          }

          .verifier-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .verifier-message {
            margin-top: 20px;
            text-align: center;
            font-weight: 500;
            color: #28a745;
          }
        `}
      </style>

      <div className="verifier-container">
        <h2 className="verifier-heading">Verifier Registration Form</h2>
        <form onSubmit={handleSubmit} className="verifier-form">
          <input
            type="text"
            name="Inititutename"
            placeholder="Institution Name"
            value={formData.Inititutename}
            onChange={handleChange}
            required
            className="verifier-input"
          />

          <select
            name="institutionType"
            value={formData.institutionType}
            onChange={handleChange}
            required
            className="verifier-input"
          >
            <option value="">Select Institution Type</option>
            <option value="college">College</option>
            <option value="university">University</option>
            <option value="school">School</option>
          </select>

          <input
            type="text"
            name="institutionCode"
            placeholder="Institution Code"
            value={formData.institutionCode}
            onChange={handleChange}
            required
            className="verifier-input"
          />

          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={formData.contactEmail}
            onChange={handleChange}
            required
            className="verifier-input"
          />

          <input
            type="text"
            name="contactperson"
            placeholder="Contact Person"
            value={formData.contactperson}
            onChange={handleChange}
            required
            className="verifier-input"
          />

          <input
            type="text"
            name="website"
            placeholder="Institution Website"
            value={formData.website}
            onChange={handleChange}
            className="verifier-input"
          />

          <textarea
            name="requestMessage"
            placeholder="Enter your request message..."
            value={formData.requestMessage}
            onChange={handleChange}
            required
            className="verifier-textarea"
          ></textarea>

          <button type="submit" className="verifier-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {message && <p className="verifier-message">{message}</p>}
      </div>
    </>
  );
};

export default VerifierRegister;
