import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import VerifierLanding from './Verifier/VerifierLanding';
import VerifierRegister from './Verifier/VerifierRegister';
import VerifierLogin from './Verifier/VerifierLogin';
import StudentLogin from './student/StudentLogin';
import StudentRegister from './student/StudentRegister';


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

        {/* 🎓 Student Login */}
        <Route path="/Student/Login" element={<StudentLogin />} />

        {/* Student Register*/}
        <Route path="/Student/Register" element={<StudentRegister />} />

      </Routes>
    </Router>
  );
}

export default App;
