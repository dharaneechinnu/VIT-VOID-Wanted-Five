import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// 🌟 Styled Components
const Container = styled.div`
  padding: 30px;
  background: #0a1120;
  min-height: 100vh;
  color: #e6eef8;
`;

const Card = styled.div`
  background: #101a2b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

const Title = styled.h2`
  color: #4fc3f7;
  margin-bottom: 6px;
`;

const Label = styled.span`
  color: #9fb0c8;
  font-weight: 600;
`;

const Value = styled.span`
  color: #ffffff;
  margin-left: 5px;
`;

const Status = styled.div`
  padding: 6px 14px;
  border-radius: 8px;
  display: inline-block;
  font-weight: 700;
  text-transform: capitalize;
  color: white;
  background: ${({ status }) =>
    status === 'approved' ? '#4CAF50'
    : status === 'funded' ? '#2196F3'
    : status === 'rejected' ? '#F44336'
    : status === 'submitted' ? '#FFB300'
    : '#607D8B'};
`;

const VerifierApplications = () => {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      // try to read verifier id from localStorage (login response)
      let verifierId = null;
      try {
        const raw = localStorage.getItem('verifierAuth');
        if (raw) {
          const parsed = JSON.parse(raw);
          verifierId = (parsed.verifier && parsed.verifier._id) || parsed._id || parsed.verifierId || null;
        }
      } catch (e) {
        console.warn('Could not parse verifierAuth from localStorage', e);
      }

      if (!verifierId) {
        setError('Verifier not logged in (verifierId missing)');
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:3500/verifier/getapplicationstatus', {
        params: { verifierId },
      });
      // controller returns { applications } for verifierId
      setApps(res.data.applications || res.data.applications || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching applications');
      setLoading(false);
    }
  };

  // ✅ Fetch one specific application by ID
  const viewApplication = async (id) => {
    try {
      console.log(`Fetching details for application ID: ${id}`);
      const res = await axios.get(`http://localhost:3500/verifier/viewapplicationbyid`, {
        params: { applicationId: id },
      });
      if (res && res.status === 200) {
        setSelectedApp(res.data.application);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // ✅ useEffect – fetch all apps first, then view the first one automatically
  useEffect(() => {
    const loadData = async () => {
      await fetchApplications();
    };
    loadData();
  }, []);

  // ✅ Once apps are fetched, automatically view first application
  useEffect(() => {
    if (apps.length > 0) {
      viewApplication(apps[0]._id);
    }
  }, [apps]);

  if (loading) return <Container>Loading applications...</Container>;
  if (error) return <Container style={{ color: 'salmon' }}>{error}</Container>;

  return (
    <Container>
      <h1 style={{ marginBottom: '20px', color: '#4fc3f7' }}>My Applications</h1>

      {apps.length === 0 ? (
        <div>No applications found</div>
      ) : (
        apps.map((a) => (
          <Card key={a._id}>
            <Title>{a.studentname}</Title>
            <div>
              <Label>Scholarship:</Label>
              <Value>{a.scholarshipId?.scholarshipName || 'N/A'}</Value>
            </div>
            <div>
              <Label>Email:</Label>
              <Value>{a.studentemail}</Value>
            </div>
            <div>
              <Label>Institution:</Label>
              <Value>{a.institutionname}</Value>
            </div>
            <div>
              <Label>Family Income:</Label>
              <Value>₹{a.familyIncome}</Value>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Label>Status:</Label> <Status status={a.status}>{a.status}</Status>
            </div>
            {/* <button
              onClick={() => viewApplication(a._id)}
              style={{
                marginTop: '12px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#4fc3f7',
                border: 'none',
                color: '#0a1120',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View Full Details
            </button> */}
          </Card>
        ))
      )}

      {selectedApp && (
        <Card style={{ border: '1px solid #4fc3f7' }}>
          <h2 style={{ color: '#03a9f4' }}>Application Details</h2>
          <div>
            <Label>Scholarship:</Label>
            <Value>{selectedApp.scholarshipId?.scholarshipName}</Value>
          </div>
          <div>
            <Label>Provider:</Label>
            <Value>{selectedApp.scholarshipId?.providerName}</Value>
          </div>
          <div>
            <Label>Amount:</Label>
            <Value>₹{selectedApp.scholarshipId?.scholarshipAmount}</Value>
          </div>
          <div>
            <Label>Deadline:</Label>
            <Value>
              {new Date(selectedApp.scholarshipId?.applicationDeadline).toLocaleDateString()}
            </Value>
          </div>
          <div>
            <Label>10th Marks:</Label>
            <Value>{selectedApp.tenthMarks}</Value>
          </div>
          <div>
            <Label>12th Marks:</Label>
            <Value>{selectedApp.twelfthMarks}</Value>
          </div>
          <div>
            <Label>CGPA:</Label>
            <Value>
              {selectedApp.semesterCgpa?.map((s) => `${s.semester}: ${s.cgpa}`).join(', ')}
            </Value>
          </div>
          <div>
            <Label>Remarks:</Label>
            <Value>{selectedApp.remarks || 'No remarks'}</Value>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Label>Status:</Label>{' '}
            <Status status={selectedApp.status}>{selectedApp.status}</Status>
          </div>
        </Card>
      )}
    </Container>
  );
};

export default VerifierApplications;
