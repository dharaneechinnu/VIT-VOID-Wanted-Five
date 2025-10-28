import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  background: #071029;
  color: #e6f7ff;
  padding: 24px;
  border-radius: 10px;
`;

const Row = styled.div`
  display:flex;
  gap:8px;
  align-items:center;
  margin-bottom:12px;
`;

const Input = styled.input`
  padding:8px 10px;
  border-radius:6px;
  border:1px solid rgba(255,255,255,0.06);
  background:#081329;
  color:#e6f7ff;
  min-width:300px;
`;

const Button = styled.button`
  padding:8px 12px;
  border-radius:6px;
  border:none;
  cursor:pointer;
  font-weight:600;
`;

const Primary = styled(Button)`
  background:linear-gradient(90deg,#00cfff,#3399ff);
  color:#001;
`;

const Danger = styled(Button)`
  background:#ff4d4f;
  color:#fff;
`;

const Info = styled.div`
  margin-top:12px;
  color:#cfefff;
  white-space:pre-wrap;
`;

export default function ReviewVerifier(){
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const callReview = async (status) => {
    if (!id) return setMsg('Please enter verifier id');
    setLoading(true);
    setMsg('');
    try{
      const res = await axios.put(`http://localhost:3500/superadmin/review-verifier/${id}`,{ status });
      setMsg(res.data?.message || 'Done');
    }catch(err){
      setMsg(err.response?.data?.message || err.message);
    }finally{setLoading(false)}
  }

  return (
    <Container>
      <h3>Review Verifier Request</h3>
      <Row>
        <Input placeholder="Enter verifier id (ObjectId)" value={id} onChange={e=>setId(e.target.value)} />
        <Primary onClick={()=>callReview('approved')} disabled={loading}>Approve</Primary>
        <Danger onClick={()=>callReview('rejected')} disabled={loading}>Reject</Danger>
      </Row>
      {msg && <Info>{msg}</Info>}
    </Container>
  )
}
