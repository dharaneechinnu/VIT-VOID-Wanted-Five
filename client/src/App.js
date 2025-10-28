import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLandingPage from "./admin/AdminLandingPage";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (blue background with FastScholar title + buttons) */}
        <Route path="/" element={<AdminLandingPage />} />

        {/* Admin Login Page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Registration Page */}
        <Route path="/admin/register" element={<AdminRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
