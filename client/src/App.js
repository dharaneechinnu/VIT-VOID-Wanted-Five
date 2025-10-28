import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import VerifierLanding from './Verifier/VerifierLanding';
import VerifierRegister from './Verifier/VerifierRegister';
import VerifierLogin from './Verifier/VerifierLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Verifier Landing Page */}
        <Route path="/Verifier" element={<VerifierLanding />} />

        {/* 🔑 Verifier Login */}
        <Route path="/Verifier/Login" element={<VerifierLogin />} />

        {/* 📝 Verifier Register */}
        <Route path="/Verifier/Register" element={<VerifierRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
