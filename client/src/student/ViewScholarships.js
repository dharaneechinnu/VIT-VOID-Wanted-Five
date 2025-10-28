import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ s }) => {
  const navigate = useNavigate();
  const deadline = s.applicationDeadline ? new Date(s.applicationDeadline).toLocaleDateString() : 'N/A';
  return (
    <div style={{background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', borderRadius:12, padding:18, boxShadow: '0 6px 18px rgba(0,0,0,0.45)'}}>
      <h3 style={{margin:0, color:'#e6f7ff'}}>{s.scholarshipName}</h3>
      <div style={{color:'#9feffc', fontSize:13, marginTop:6}}>{s.providerName}</div>
      <p style={{color:'#cfeefc', marginTop:12, lineHeight:1.5, maxHeight: '6em', overflow: 'hidden'}}>{s.description}</p>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14}}>
        <div style={{color:'#bff6ff'}}>
          <div><strong>Amount:</strong> ₹{s.scholarshipAmount}</div>
          <div style={{fontSize:13}}><strong>Deadline:</strong> {deadline}</div>
        </div>
       
      </div>
    </div>
  );
};

const ViewScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3500/student/scholarships');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch');
        setScholarships(data.scholarships || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{minHeight:'100vh', padding:30, background: 'linear-gradient(180deg,#001a35,#000817)', color:'#e6f7ff'}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <h2 style={{marginBottom:16}}>Available Scholarships</h2>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{color:'#ffd6d6'}}>{error}</div>
        ) : scholarships.length === 0 ? (
          <div style={{color:'#cfeefc'}}>No scholarships available right now.</div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:18}}>
            {scholarships.map((s) => (
              <Card key={s._id} s={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewScholarships;
