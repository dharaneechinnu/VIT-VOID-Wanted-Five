import React, { useState } from 'react';
import styled from 'styled-components';
import ReviewDonor from './ReviewDonor';
import ReviewVerifier from './ReviewVerifier';
import PendingDonors from './PendingDonors';
import PendingVerifiers from './PendingVerifiers';

const Wrapper = styled.div`
  min-height:100vh;
  background:#071029;
  color:#e6f7ff;
  padding:28px;
  box-sizing:border-box;
`;

const Nav = styled.div`
  display:flex;
  gap:12px;
  margin-bottom:18px;
`;

const Tab = styled.button`
  padding:8px 12px;
  border-radius:8px;
  border: ${p=>p.active?'none':'1px solid rgba(255,255,255,0.06)'};
  background: ${p=>p.active?'linear-gradient(90deg,#00cfff,#3399ff)':'transparent'};
  color: ${p=>p.active?'#001':'#e6f7ff'};
  cursor:pointer;
`;

export default function SuperAdminDashboard(){
  const [tab, setTab] = useState('pending');
  return (
    <Wrapper>
      <h2>Super Admin Panel</h2>
      <Nav>
        <Tab active={tab==='pending'} onClick={()=>setTab('pending')}>Pending Requests</Tab>
        <Tab active={tab==='review'} onClick={()=>setTab('review')}>Manual Review</Tab>
      </Nav>

      {tab==='pending' ? (
        <div style={{display:'flex', gap:12}}>
          <div style={{flex:1}}><PendingDonors /></div>
          <div style={{flex:1}}><PendingVerifiers /></div>
        </div>
      ) : (
        <div style={{display:'flex', gap:12}}>
          <div style={{flex:1}}><ReviewDonor /></div>
          <div style={{flex:1}}><ReviewVerifier /></div>
        </div>
      )}
    </Wrapper>
  )
}
