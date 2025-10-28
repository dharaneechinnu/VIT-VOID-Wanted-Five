import React from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const AdminLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="nav-buttons">
        <button className="login-btn" onClick={() => navigate("/admin/login")}>Login</button>
        <button className="register-btn" onClick={() => navigate("/admin/register")}>Register</button>
      </div>

      <div className="content">
        <div className="logo-icon">🎓</div>
        <h1 className="title">FAST SCHOLAR</h1>
        <p className="tagline">
          "Empowering education through seamless scholarship management <br />
          and transparent donor connections"
        </p>
      </div>
    </div>
  );
};

export default AdminLandingPage;
