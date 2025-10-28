import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// 🌐 Verifier Components
import VerifierLanding from './Verifier/VerifierLanding';
import VerifierRegister from './Verifier/VerifierRegister';
import VerifierLogin from './Verifier/VerifierLogin';

// 🧑‍💼 Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminRegister from './admin/AdminRegister'; // ✅ Added Admin Register

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

        {/* 🧑‍💼 Admin Login */}
        <Route path="/Admin/Login" element={<AdminLogin />} />

        {/* 📝 Admin Register */}
        <Route path="/Admin/Register" element={<AdminRegister />} /> {/* ✅ New route added */}
      </Routes>
    </Router>
  );
}

export default App;
