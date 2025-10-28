import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// 🌐 Verifier Components
import VerifierLanding from "./Verifier/VerifierLanding";
import VerifierRegister from "./Verifier/VerifierRegister";
import VerifierLogin from "./Verifier/VerifierLogin";
import VerifierLoginDash from "./Verifier/VerifierLoginDash";


// 🎓 Student Components
import StudentLogin from "./student/StudentLogin";
import StudentRegister from "./student/StudentRegister";

// 🧑‍💼 Admin Components
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";

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
        <Route path="/Verifier/Dashboard" element={<VerifierLoginDash />} />
        
        {/* 🎓 Student Login */}
        <Route path="/Student/Login" element={<StudentLogin />} />

        {/* 📝 Student Register */}
        <Route path="/Student/Register" element={<StudentRegister />} />

        {/* 🧑‍💼 Admin Login */}
        <Route path="/Admin/Login" element={<AdminLogin />} />

        {/* 📝 Admin Register */}
        <Route path="/Admin/Register" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
