import React, { useState } from "react";
import axios from "axios";

const VerifierLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      // ⚙️ Replace with your actual backend login route
      const res = await axios.post("http://localhost:3500/verifier/login", formData);

      if (res.status === 200) {
        setMessage("✅ Login successful!");
        console.log("Verifier Logged In:", res.data);
        // Example redirect after login (optional)
        // window.location.href = "/verifier/dashboard";
      } else {
        setMessage("❌ Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Login failed. Please check your credentials or server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .verifier-login-container {
            max-width: 420px;
            margin: 80px auto;
            padding: 35px;
            background-color: #ffffff;
            border-radius: 15px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          }

          .verifier-login-title {
            text-align: center;
            font-size: 1.8rem;
            font-weight: 600;
            color: #222;
            margin-bottom: 25px;
          }

          .verifier-login-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .verifier-login-input {
            padding: 12px;
            font-size: 14px;
            border-radius: 8px;
            border: 1px solid #ccc;
            outline: none;
            transition: 0.3s ease;
          }

          .verifier-login-input:focus {
            border-color: #007bff;
            box-shadow: 0 0 6px rgba(0, 123, 255, 0.3);
          }

          .verifier-login-button {
            background-color: #007bff;
            color: white;
            padding: 12px;
            font-size: 15px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
            font-weight: 500;
          }

          .verifier-login-button:hover {
            background-color: #0056b3;
          }

          .verifier-login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .verifier-message {
            text-align: center;
            margin-top: 20px;
            color: #28a745;
            font-weight: 500;
          }
        `}
      </style>

      <div className="verifier-login-container">
        <h2 className="verifier-login-title">Verifier Login</h2>

        <form className="verifier-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="verifier-login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="verifier-login-input"
          />

          <button
            type="submit"
            className="verifier-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="verifier-message">{message}</p>}
      </div>
    </>
  );
};

export default VerifierLogin;
