import React, { useState } from "react";
import styled from "styled-components";
import MakePayment from "./MakePayment";
import ViewApplications from './ViewApplications';
import CreateScholar from './CreateScholar';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 250;

/* ---- WRAPPER ---- */
const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f9fbff; /* soft white-blue background */
  font-family: 'Poppins', sans-serif;
`;

/* ---- SIDEBAR ---- */
const Sidebar = styled.aside`
  width: ${drawerWidth}px;
  background: #ffffff;
  border-right: 2px solid #dceeff;
  padding: 24px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* align to left */
  justify-content: flex-start; /* push everything to top */
  gap: 18px; /* neat spacing between boxes */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;

/* ---- LOGO ---- */
const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #00a2ff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  width: 100%;
  text-align: left;
`;

/* ---- NAVIGATION ---- */
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const NavButton = styled.button`
  background: ${(props) => (props.active ? "#00a2ff" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#00a2ff")};
  border: 2px solid #00a2ff;
  padding: 10px 14px;
  border-radius: 8px;
  width: 100%;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${(props) =>
    props.active ? "0 3px 6px rgba(0, 162, 255, 0.2)" : "none"};

  &:hover {
    background: ${(props) => (props.active ? "#0092e5" : "#eaf5ff")};
  }
`;

/* ---- MAIN CONTENT ---- */
const Content = styled.main`
  flex: 1;
  background: #ffffff;
  padding: 40px;
  box-sizing: border-box;
  border-left: 2px solid #eaf3ff;
  display: flex;
  flex-direction: column;
`;

/* ---- HEADER ---- */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #eaf3ff;
  padding-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #00a2ff;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.4px;
`;





  const AdminDashboard = () => {
    const [active, setActive] = useState('view');
    const navigate = useNavigate();

    // read admin info from localStorage
    let storedAdmin = null;
    try {
      const raw = localStorage.getItem('adminAuth');
      if (raw) storedAdmin = JSON.parse(raw).admin || JSON.parse(raw);
    } catch (e) {
      console.warn('Could not parse adminAuth from localStorage', e);
    }

    const handleLogout = () => {
      try {
        // clear all local/session storage on logout
        localStorage.clear();
        try { sessionStorage.clear(); } catch (err) {}
      } catch (e) {
        console.warn('Error clearing localStorage during logout', e);
        try { localStorage.removeItem('adminAuth'); } catch (err) {}
      }
      // redirect to admin login
      navigate('/admin/login');
    };

    const renderContent = () => {
      switch (active) {
        case 'view':
          return <ViewApplications />;
        case 'create':
          return <CreateScholar />;
        case 'payment':
          return <MakePayment onBack={() => setActive('view')} />;
        default:
          return <ViewApplications />;
      }
    };

    return (
      <DashboardWrapper>
        <Sidebar>
  <Logo>Admin Panel</Logo>

  {/* 👇 ADD EMAIL BOX HERE */}
  <div
    style={{
      background: '#f4faff',
      border: '2px solid #bde0ff',
      borderRadius: '10px',
      padding: '12px 14px',
      marginBottom: '24px',
      textAlign: 'left',
      boxShadow: '0 2px 6px rgba(0, 162, 255, 0.1)',
    }}
  >
    {storedAdmin ? (
      <div>
        <div
          style={{
            fontWeight: 700,
            color: '#00a2ff',
            fontSize: '14px',
            marginBottom: '4px',
          }}
        >
          {storedAdmin.orgName || storedAdmin.name || 'Admin'}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#1e40af',
            wordBreak: 'break-word',
          }}
        >
          {storedAdmin.contactEmail || storedAdmin.email || 'No Email Available'}
        </div>
      </div>
    ) : (
      <div style={{ fontSize: '13px', color: '#64748b' }}>Not signed in</div>
    )}
  </div>
  

  <Nav>
    <NavButton active={active === 'view'} onClick={() => setActive('view')}>
      View Applications
    </NavButton>
    <NavButton active={active === 'create'} onClick={() => setActive('create')}>
      Create Scholar
    </NavButton>
    <NavButton active={active === 'payment'} onClick={() => setActive('payment')}>
      Make Payment
    </NavButton>
  </Nav>

  <div style={{ marginTop: 24 }}>
    <button
      onClick={handleLogout}
      style={{
        padding: '10px 12px',
        borderRadius: 8,
        background: '#00a2ff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 600,
      }}
    >
      Logout
    </button>
  </div>
</Sidebar>


        <Content>
          <Header>
            <Title>{active === 'view' ? 'View Applications' : active === 'create' ? 'Create Scholarship' : 'Make Payment'}</Title>
          </Header>

          {renderContent()}
        </Content>
      </DashboardWrapper>
    );
  };

  export default AdminDashboard;
