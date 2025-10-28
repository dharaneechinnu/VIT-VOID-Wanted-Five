import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// 🌟 Styled Components
// 🌟 Styled Components (Vibrant Sky Blue + White Professional Theme)
const Wrapper = styled.div`
  background: #f4faff; /* brighter white-blue base */
  color: #1e3a8a;
  min-height: 100vh;
  padding: 40px 50px;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 25px;
  font-size: 28px;
  color: #008cff; /* vibrant blue heading */
  font-weight: 700;
  letter-spacing: 0.4px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 10px;
`;

const Item = styled.div`
  background: #ffffff;
  border: 2px solid #b5e0ff; /* vibrant border */
  padding: 22px 24px;
  border-radius: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 6px 12px rgba(0, 140, 255, 0.08);

  &:hover {
    background: #eaf6ff; /* light hover */
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 140, 255, 0.12);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  color: #6c7a91; /* subtle gray-blue */
  font-size: 13px;
`;

const Value = styled.span`
  color: #0078e7; /* energetic medium blue */
  font-weight: 600;
`;

const Button = styled.button`
  background: #00a2ff;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s ease;
  box-shadow: 0 3px 6px rgba(0, 162, 255, 0.2);

  &:hover {
    background: #0088e0;
    box-shadow: 0 4px 8px rgba(0, 136, 224, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;



const ViewApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ Extract admin ID from localStorage
  const storedAdmin = JSON.parse(localStorage.getItem('adminAuth'));
  const adminId = storedAdmin?.admin?._id;

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching applications for adminId:', adminId);
      const res = await axios.get(`http://localhost:3500/admin/getAllApplications/${adminId}`);
      if (res.status === 200 && res.data) {
        console.log('Applications fetched:', res.data.applications);
        // Hide applications that have been approved by donor (donorDecision === 'approved')
        const raw = res.data.applications || [];
        const visible = raw.filter(a => String(a.donorDecision || '').toLowerCase() !== 'approved');
        setApps(visible);
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const viewApplication = async (applicationId) => {
    if (!applicationId) return;
    try {
      setActionLoading(true);
      const res = await axios.get(`http://localhost:3500/admin/applications/${applicationId}`);
      if (res && (res.status === 200 || res.status === 201) && res.data) {
        const app = res.data.application || res.data.application || null;
        // Do not show details if donorDecision is approved — hide complete details per requirement
        if (app && String(app.donorDecision || '').toLowerCase() === 'approved') {
          // clear any selected details and silently return
          setSelectedApp(null);
          return;
        }
        setSelectedApp(app);
      }
    } catch (err) {
      console.error('Error fetching application detail:', err?.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const approveApplication = async (applicationId) => {
    if (!applicationId) return;
    try {
      setActionLoading(true);
      // documentId in URL is not used by controller, pass a placeholder
      const res = await axios.patch(`http://localhost:3500/admin/applications/${applicationId}/documents/approve`, { status: 'approved' });
      if (res && res.status === 200) {
        // refresh list. Do NOT show details for an approved application (hide complete details)
        await fetchApplications();
        setSelectedApp(null);
      } else {
        console.warn('Unexpected response approving application', res);
      }
    } catch (err) {
      console.error('Error approving application:', err?.response?.data?.message || err.message);
      setError(err?.response?.data?.message || err.message || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    // intentionally run once on mount; fetchApplications is stable for this component
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchApplications();
  }, []);

  return (
    <Wrapper>
      <Title>🎓 Scholarship Applications</Title>

     

      {loading && <div>Loading applications...</div>}
      {error && <div style={{ color: 'salmon' }}>{error}</div>}

      <List>
        {apps.length === 0 && !loading && <div>No applications found</div>}
        {apps.map(app => (
          <Item key={app._id}>
            <Row>
              <div>
                <div style={{ fontWeight: 700, fontSize: '18px', color: '#a8d8ff' }}>
                  {app.studentname || 'Unknown Student'}
                </div>
                <Label>{app.studentemail}</Label>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Label>Status:</Label> <Value>{app.status}</Value>
                <br />
                {/* Hide donorDecision label when already approved as requested */}
                {app.donorDecision !== 'approved' && (
                  <>
                    <Label>Donor Decision:</Label> <Value>{app.donorDecision}</Value>
                  </>
                )}
              </div>
            </Row>

            <Row>
              <div>
                <Label>Gender:</Label> <Value>{app.gender}</Value>
              </div>
              <div>
                <Label>Institution:</Label> <Value>{app.institutionname}</Value>
              </div>
              <div>
                <Label>Class/Year:</Label> <Value>{app.classoryear}</Value>
              </div>
            </Row>

            <Row>
              <div>
                <Label>Family Income:</Label> <Value>₹{app.familyIncome}</Value>
              </div>
              <div>
                <Label>Scholarship:</Label> <Value>{app.scholarshipId?.scholarshipName}</Value>
              </div>
              <div>
                <Label>Amount:</Label> <Value>₹{app.scholarshipId?.scholarshipAmount}</Value>
              </div>
            </Row>

            <Row>
              <div>
                <Label>Verifier Email:</Label> <Value>{app.verifierId?.contactEmail || 'N/A'}</Value>
              </div>
              <div>
                <Label>Created At:</Label> <Value>{new Date(app.createdAt).toLocaleDateString()}</Value>
              </div>
            </Row>
            {app.firstGenGraduate && (
              <div style={{ marginTop: 8, fontSize: 13, color: '#66ff91' }}>
                🌟 First Generation Graduate
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              
              {/* Show Approve only when donorDecision is not approved */}
              {app.donorDecision !== 'approved' && (
                <Button style={{ background: '#16a34a' }} onClick={() => approveApplication(app._id)} disabled={actionLoading}>Approve</Button>
              )}
            </div>
          </Item>
        ))}
      </List>

      {selectedApp && (
        <div style={{ marginTop: 24 }}>
          <Title style={{ color: '#ffd580' }}>Application Details</Title>
          <Item style={{ background: '#081328' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{selectedApp.studentname}</div>
            <div><Label>Scholarship:</Label> <Value>{selectedApp.scholarshipId?.scholarshipName}</Value></div>
            <div><Label>Institution:</Label> <Value>{selectedApp.institutionname}</Value></div>
            <div><Label>Family Income:</Label> <Value>₹{selectedApp.familyIncome}</Value></div>
            <div style={{ marginTop: 8 }}>
              <Label>Status:</Label> <Value>{selectedApp.status}</Value>
            </div>
            <div style={{ marginTop: 12 }}>
              <Button onClick={() => { setSelectedApp(null); }}>Close</Button>
            </div>
          </Item>
        </div>
      )}
    </Wrapper>
  );
};

export default ViewApplications;
