import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// 🔹 Styled Components
const Container = styled.div`
  padding: 40px;
  background: #f9fbff; /* light white-blue background */
  min-height: 100vh;
  color: #1e3a8a;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif;
`;

/* ---- Card Grid Layout ---- */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1100px;
`;

/* ---- Individual Card ---- */
const Card = styled.div`
  background: #ffffff;
  border: 2px solid #bde0ff;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 6px 14px rgba(0, 162, 255, 0.1);
  transition: all 0.25s ease;
  text-align: left;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 162, 255, 0.18);
    background: #f4faff;
  }
`;

/* ---- Title ---- */
const Title = styled.h2`
  font-size: 20px;
  color: #00a2ff; /* vibrant sky blue */
  margin-bottom: 8px;
  font-weight: 700;
`;

/* ---- Provider ---- */
const Provider = styled.h4`
  font-size: 14px;
  color: #007bff;
  margin-bottom: 16px;
  font-weight: 600;
`;

/* ---- Field ---- */
const Field = styled.div`
  margin-bottom: 8px;
  font-size: 15px;
  color: #1e3a8a;
`;

/* ---- Label ---- */
const Label = styled.span`
  color: #5c6b80; /* subtle gray-blue */
  font-weight: 600;
`;

/* ---- Value ---- */
const Value = styled.span`
  color: #007bff;
  margin-left: 6px;
  font-weight: 500;
`;

/* ---- Button ---- */
const Button = styled.button`
  margin-top: 14px;
  background: linear-gradient(90deg, #00a2ff, #4db8ff);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 162, 255, 0.2);

  &:hover {
    background: linear-gradient(90deg, #0092e5, #33b1ff);
    transform: translateY(-2px);
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
