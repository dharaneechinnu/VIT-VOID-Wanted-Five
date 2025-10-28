import React, { useState } from "react";
import styled from "styled-components";
import MakePayment from "./MakePayment";
import ViewApplications from './ViewApplications';
import CreateScholar from './CreateScholar';
import ViewTransactions from './ViewTransactions';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 220;

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #181818;
  font-family: 'Poppins', sans-serif;
`;

const Sidebar = styled.aside`
  width: ${drawerWidth}px;
  background: #0b1220;
  border-right: 1px solid rgba(255,255,255,0.03);
  padding: 24px;
  box-sizing: border-box;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ffae00;
  margin-bottom: 24px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NavButton = styled.button`
  background: ${props => (props.active ? 'linear-gradient(90deg,#ffae00,#ff8533)' : 'transparent')};
  color: ${props => (props.active ? '#081018' : '#e6eef8')};
  border: ${props => (props.active ? 'none' : '1px solid rgba(255,255,255,0.04)')};
  padding: 12px 16px;
  border-radius: 8px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 28px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  font-size: 22px;
  color: #fff;
  margin: 0;
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
        case 'transactions':
          return <ViewTransactions />;
        default:
          return <ViewApplications />;
      }
    };

    return (
      <DashboardWrapper>
        <Sidebar>
          <Logo>Admin Panel</Logo>
          <div style={{marginBottom:12, color:'#9fb0c8', fontSize:13}}>
            {storedAdmin ? (
              <div>
                <div style={{fontWeight:700, color:'#fff'}}>{storedAdmin.orgName || storedAdmin.name || 'Admin'}</div>
                <div style={{fontSize:12}}>{storedAdmin.contactEmail || storedAdmin.email || ''}</div>
              </div>
            ) : (
              <div style={{fontSize:12}}>Not signed in</div>
            )}
          </div>
          <Nav>
            <NavButton active={active === 'view'} onClick={() => setActive('view')}>View Applications</NavButton>
            <NavButton active={active === 'create'} onClick={() => setActive('create')}>Create Scholar</NavButton>
            <NavButton active={active === 'payment'} onClick={() => setActive('payment')}>Make Payment</NavButton>
            <NavButton active={active === 'transactions'} onClick={() => setActive('transactions')}>View Transactions</NavButton>
          </Nav>

          <div style={{marginTop:24}}>
            <button onClick={handleLogout} style={{padding:'10px 12px', borderRadius:8, background:'#ff4d4f', color:'#fff', border:'none', cursor:'pointer'}}>Logout</button>
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
