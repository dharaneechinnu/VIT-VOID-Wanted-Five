import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div style={{fontFamily: 'Poppins, sans-serif', minHeight: '100vh', background: 'linear-gradient(180deg,#001a35,#000817)', color: '#e6f7ff', padding: '40px'}}>
      <div style={{maxWidth: 1000, margin: '0 auto'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1 style={{margin: 0}}>Student Dashboard</h1>
          <div>
            {token ? (
              <button
                onClick={() => { localStorage.removeItem('token'); navigate('/Student/Login'); }}
                style={{padding: '8px 12px', borderRadius: 8, border: 'none', background: '#007bff', color: '#fff'}}
              >
                Logout
              </button>
            ) : (
              <button onClick={() => navigate('/Student/Login')} style={{padding: '8px 12px', borderRadius: 8, border: 'none', background: '#007bff', color: '#fff'}}>Logout</button>
            )}
          </div>
        </header>

        <section style={{marginTop: 28}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18}}>
            <div style={{background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 20}}>
              <h3 style={{marginTop:0}}>Browse Scholarships</h3>
              <p style={{color: '#cfeefc'}}>Find scholarships you can apply for. Carefully review eligibility & deadlines.</p>
              <button onClick={() => navigate('/Student/ViewScholarships')} style={{marginTop:12, padding:'10px 14px', borderRadius:10, border: 'none', background: 'linear-gradient(90deg,#00cfff,#007bff)', color:'#fff'}}>View Scholarships</button>
            </div>

            <div style={{background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: 20}}>
              <h3 style={{marginTop:0}}>Check Application Status</h3>
              <p style={{color: '#cfeefc'}}>Enter your application number to see status and donor decision.</p>
              <ApplicationStatusChecker />
            </div>

           
          </div>
        </section>

      </div>
    </div>
  );
};

const ApplicationStatusChecker = () => {
  const [applicationNo, setApplicationNo] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const checkStatus = async () => {
    if (!applicationNo) return setResult({ error: 'Please provide an application number' });
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`http://localhost:3500/student/applicationstatus/${encodeURIComponent(applicationNo)}`);
      const data = await res.json();
      if (!res.ok) return setResult({ error: data.message || 'Unable to fetch' });
      setResult({ success: data });
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input value={applicationNo} onChange={(e) => setApplicationNo(e.target.value)} placeholder="Application No (e.g. APP-123)" style={{width: '100%', padding: '8px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'#fff'}} />
      <div style={{display:'flex', gap:8, marginTop:10}}>
        <button onClick={checkStatus} disabled={loading} style={{padding:'8px 12px', borderRadius:8, border:'none', background:'#00cfff', color:'#001'}}>{loading ? 'Checking...' : 'Check'}</button>
      </div>

      {result && (
        <div style={{marginTop:12, background:'rgba(255,255,255,0.03)', padding:12, borderRadius:8}}>
          {result.error ? (
            <div style={{color:'#ffd6d6'}}>{result.error}</div>
          ) : (
            <div>
              <div><strong>Application:</strong> {result.success.applicationNo}</div>
              <div><strong>Status:</strong> {result.success.status}</div>
              <div><strong>Donor Decision:</strong> {result.success.donorDecision}</div>
              {result.success.donorRemarks && <div><strong>Donor Remarks:</strong> {result.success.donorRemarks}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
