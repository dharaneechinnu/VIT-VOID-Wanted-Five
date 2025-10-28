import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🌐 Verifier Components
import VerifierLanding from "./Verifier/VerifierLanding";
import VerifierRegister from "./Verifier/VerifierRegister";
import VerifierLogin from "./Verifier/VerifierLogin";
import VerifierDashboard from "./Verifier/VerifierDashboard";
import VerifierViewScholarships from "./Verifier/VerifierViewScholarships";
import VerifierApply from "./Verifier/VerifierApply";


// 🎓 Student Components
import StudentLogin from "./student/StudentLogin";
import StudentRegister from "./student/StudentRegister";

// 🧑‍💼 Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminRegister from './admin/AdminRegister'; // ✅ Added Admin Register
import AdminDashboard from './admin/AdminDashboard';

// Superadmin
import SuperAdminDashboard from './superadmin/SuperAdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Verifier Landing Page */}
        <Route path="/" element={<VerifierLanding />} />

        {/* 🔑 Verifier Login */}
        <Route path="/Verifier/Login" element={<VerifierLogin />} />

        {/* 📝 Verifier Register */}
        <Route path="/Verifier/Register" element={<VerifierRegister />} />

  {/* 📝 Verifier Dashboard */}
  <Route path="/Verifier/Dashboard" element={<VerifierDashboard />} />
    {/* 📚 Verifier - View Scholarships */}
    <Route path="/Verifier/ViewScholarships" element={<VerifierViewScholarships />} />
    {/* 📝 Verifier - Apply for a scholarship (prefill via state or query) */}
    <Route path="/Verifier/Apply" element={<VerifierApply />} />
        
        {/* 🎓 Student Login */}
        <Route path="/Student/Login" element={<StudentLogin />} />

        {/* 📝 Student Register */}
        <Route path="/Student/Register" element={<StudentRegister />} />

        {/* 🧑‍💼 Admin Login */}
        <Route path="/Admin/Login" element={<AdminLogin />} />

  {/* 📝 Admin Register */}
  <Route path="/Admin/Register" element={<AdminRegister />} />
  {/* 🏠 Admin Dashboard */}
  <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
  {/* 🛡 Super Admin Dashboard */}
  <Route path="/SuperAdmin/Dashboard" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
