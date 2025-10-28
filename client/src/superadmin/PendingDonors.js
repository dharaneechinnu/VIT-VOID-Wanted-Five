import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`padding:12px; background:#071029; color:#e6f7ff; border-radius:8px;`;
const Row = styled.div`display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.03);`;
const Info = styled.div`font-size:14px; color:#cfefff;`;
const Actions = styled.div`display:flex; gap:8px;`;
const Button = styled.button`padding:6px 10px; border-radius:6px; border:none; cursor:pointer;`;
const Approve = styled(Button)`background:#16a34a; color:#fff;`;
const Reject = styled(Button)`background:#ef4444; color:#fff;`;

export default function PendingDonors(){
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState(''); // 'success' | 'error' | ''

  const fetchList = async(p=1)=>{
    setLoading(true);
    try{
      const res = await axios.get(`http://localhost:3500/superadmin/pending-donors?page=${p}&limit=25`);
      setList(res.data.donors || []);
      setMsg(''); setMsgType('');
    }catch(err){
      setMsg(err.response?.data?.message || err.message);
      setMsgType('error');
    }finally{setLoading(false)}
  }

  useEffect(()=>{fetchList(page)},[page]);

  const review = async(id,status)=>{
    try{
      await axios.put(`http://localhost:3500/superadmin/review-donor/${id}`,{ status });
      // remove from list
      setList(prev=>prev.filter(d=>d._id!==id));
      const successMsg = status === 'approved' ? 'Donor approved successfully' : 'Donor rejected';
      setMsg(successMsg);
      setMsgType('success');
      try { window.alert(successMsg); } catch(e){}
    }catch(err){
      setMsg(err.response?.data?.message || err.message);
      setMsgType('error');
    }
  }

  return (
    <Container>
      <h3>Pending Donors</h3>
  {msg && <div style={{color: msgType === 'success' ? '#00e676' : 'salmon'}}>{msg}</div>}
      {loading && <div>Loading...</div>}
      {list.length===0 && !loading && <div>No pending donors</div>}
      {list.map(d=> (
        <Row key={d._id}>
          <Info>
            <div style={{fontWeight:700}}>{d.orgName || d.name}</div>
            <div style={{fontSize:13}}>{d.contactEmail}</div>
          </Info>
          <Actions>
            <Approve onClick={()=>review(d._id,'approved')}>Approve</Approve>
            <Reject onClick={()=>review(d._id,'rejected')}>Reject</Reject>
          </Actions>
        </Row>
      ))}
    </Container>
  )
}
