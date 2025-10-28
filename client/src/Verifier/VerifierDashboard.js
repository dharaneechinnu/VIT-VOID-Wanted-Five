import React, { useState } from 'react';
import styled from 'styled-components';
import VerifierViewScholarships from './VerifierViewScholarships';
import VerifierApplications from './VerifierApplications';
import VerifierApply from './VerifierApply';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 220;

const DashboardWrapper = styled.div`
  display:flex;
  min-height:100vh;
  background:#071029;
  color:#e6f7ff;
  font-family: 'Poppins', sans-serif;
`;

const Sidebar = styled.aside`
  width: ${drawerWidth}px;
  background:#042033;
  padding:20px;
  box-sizing:border-box;
  border-right:1px solid rgba(255,255,255,0.03);
`;

const Logo = styled.div`
  font-weight:700;
  color:#00cfff;
  margin-bottom:20px;
`;

const Nav = styled.nav`
  display:flex;
  flex-direction:column;
  gap:12px;
`;

const NavButton = styled.button`
  padding:10px 12px;
  border-radius:8px;
  background: ${props => props.active ? 'linear-gradient(90deg,#00cfff,#3399ff)' : 'transparent'};
  color: ${props => props.active ? '#001' : '#e6f7ff'};
  border: ${props => props.active ? 'none' : '1px solid rgba(255,255,255,0.03)'};
  text-align:left;
  cursor:pointer;
  font-weight:600;
`;

const Content = styled.main`
  flex:1;
  padding:28px;
  box-sizing:border-box;
`;

const Header = styled.div`
  margin-bottom:18px;
`;

const Title = styled.h1`
  font-size:20px;
  color:#fff;
  margin:0;
`;

const VerifierDashboard = () => {
  const [active, setActive] = useState('view');
  const navigate = useNavigate();

  // read verifier info
  let stored = null;
  try {
    const raw = localStorage.getItem('verifierAuth');
    if (raw) stored = JSON.parse(raw).verifier || JSON.parse(raw);
  } catch (e) {
    console.warn('could not parse verifierAuth', e);
  }

  const handleLogout = () => {
    try {
      // clear everything stored in localStorage/sessionStorage on logout
      localStorage.clear();
      try { sessionStorage.clear(); } catch (e) {}
    } catch (e) {
      // fall back to removing known key
      try { localStorage.removeItem('verifierAuth'); } catch (err) {}
    }
    // redirect to the verifier login route
    navigate('/Verifier/Login');
  };

  const renderContent = () => {
    switch(active) {
      case 'view': return <VerifierViewScholarships />;
      case 'apply': return <VerifierApply />;
      case 'apps': return <VerifierApplications />;
      default: return <VerifierViewScholarships />;
    }
  };

  return (
    <DashboardWrapper>
      <Sidebar>
        <Logo>{stored ? (stored.Inititutename || stored.institutionName || 'Verifier') : 'Verifier'}</Logo>
        <div style={{marginBottom:12, fontSize:13, color:'#9fb0c8'}}>
          {stored ? (stored.contactEmail || '') : 'Not signed in'}
        </div>
        <Nav>
          <NavButton active={active === 'view'} onClick={() => setActive('view')}>View Scholarships</NavButton>
          {/* <NavButton active={active === 'apply'} onClick={() => setActive('apply')}>Apply for Student</NavButton> */}
          <NavButton active={active === 'apps'} onClick={() => setActive('apps')}>My Applications</NavButton>
        </Nav>

        <div style={{marginTop:20}}>
          <button onClick={handleLogout} style={{padding:'8px 12px', borderRadius:8, background:'#ff4d4f', color:'#fff', border:'none'}}>Logout</button>
        </div>
      </Sidebar>

      <Content>
        <Header>
          <Title>{active === 'view' ? 'Available Scholarships' : active === 'apply' ? 'Apply for Student' : 'My Applications'}</Title>
        </Header>
        {renderContent()}
      </Content>
    </DashboardWrapper>
  );
};

export default VerifierDashboard;
