import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// 🔹 Styled Components
const Container = styled.div`
  padding: 30px;
  background: #0a1120;
  min-height: 100vh;
  color: #e6eef8;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1100px;
`;

const Card = styled.div`
  background: #101a2b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  }
`;

const Title = styled.h2`
  font-size: 20px;
  color: #4fc3f7;
  margin-bottom: 8px;
`;

const Provider = styled.h4`
  font-size: 14px;
  color: #a7b9d4;
  margin-bottom: 16px;
`;

const Field = styled.div`
  margin-bottom: 6px;
  font-size: 15px;
`;

const Label = styled.span`
  color: #9fb0c8;
  font-weight: 600;
`;

const Value = styled.span`
  color: #ffffff;
  margin-left: 5px;
`;

const Button = styled.button`
  margin-top: 14px;
  background: #4fc3f7;
  color: #0a1120;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
  &:hover {
    background: #03a9f4;
  }
`;

const VerifierViewScholarships = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:3500/verifier/getallscholarships');
      if (res && res.status === 200) setList(res.data.scholarships || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <Container>Loading scholarships...</Container>;
  if (error) return <Container style={{ color: 'salmon' }}>{error}</Container>;

  return (
    <Container>
      <h1 style={{ marginBottom: '20px', color: '#4fc3f7' }}>Available Scholarships</h1>

      {list.length === 0 ? (
        <div>No scholarships found</div>
      ) : (
        <CardGrid>
          {list.map(s => (
            <Card key={s._id}>
              <Title>{s.scholarshipName || s.title}</Title>
              <Provider>Provided by: {s.providerName || 'N/A'}</Provider>

              <Field>
                <Label>Amount:</Label>
                <Value>₹{s.scholarshipAmount}</Value>
              </Field>
              <Field>
                <Label>Deadline:</Label>
                <Value>{new Date(s.applicationDeadline).toLocaleDateString()}</Value>
              </Field>
              <Field>
                <Label>Required 10th Marks:</Label>
                <Value>{s.eligibilityCriteria?.tenthMarks}%</Value>
              </Field>
              <Field>
                <Label>Required 12th Marks:</Label>
                <Value>{s.eligibilityCriteria?.twelfthMarks}%</Value>
              </Field>
              <Field>
                <Label>College CGPA:</Label>
                <Value>{s.eligibilityCriteria?.collegeCGPA}</Value>
              </Field>
              <Field>
                <Label>Max Parent Income:</Label>
                <Value>₹{s.eligibilityCriteria?.maxParentIncome}</Value>
              </Field>
              <Field>
                <Label>Women Preference:</Label>
                <Value>{s.eligibilityCriteria?.womenPreference ? 'Yes' : 'No'}</Value>
              </Field>
              <Field>
                <Label>First Gen Graduate:</Label>
                <Value>{s.eligibilityCriteria?.firstGenGraduate ? 'Yes' : 'No'}</Value>
              </Field>

              <Field style={{ marginTop: '10px' }}>
                <Label>Description:</Label>
                <Value>{s.description}</Value>
              </Field>

              <Button onClick={() => {
                const donorid = s.createdBy && s.createdBy._id ? s.createdBy._id : s.createdBy;
                navigate('/Verifier/Apply', { state: { scholarshipId: s._id, scholarshipName: s.scholarshipName || s.title, donorid } });
              }}>
                Apply Now
              </Button>
            </Card>
          ))}
        </CardGrid>
      )}
    </Container>
  );
};

export default VerifierViewScholarships;
