import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #0a1120;
  color: #e6eef8;
  padding: 30px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #ffae00;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const Card = styled.div`
  background: #101a2b;
  border-radius: 12px;
  padding: 20px;
  width: 340px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s;
  &:hover {
    transform: translateY(-4px);
    background: #15223a;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Label = styled.span`
  color: #9fb0c8;
  font-size: 13px;
`;

const Value = styled.span`
  color: #e6eef8;
  font-weight: 500;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #ffae00, #ff6600);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
  transition: 0.3s;
  &:hover {
    background: linear-gradient(90deg, #ffc233, #ff8533);
  }
`;

const Message = styled.div`
  color: ${props => props.type === "error" ? "#ff1744" : "#00e676"};
  background: ${props => props.type === "error" ? "rgba(255,23,68,0.1)" : "rgba(0,230,118,0.1)"};
  padding: 10px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
`;

const MakePayment = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const storedAdmin = JSON.parse(localStorage.getItem("adminAuth"));
  const adminId = storedAdmin?.admin?._id;

  // ✅ Fetch all approved applications
  const fetchApprovedApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3500/admin/getAllApplications/${adminId}`);
      const allApps = res.data.applications || [];
      const approvedApps = allApps.filter(app => String(app.donorDecision).toLowerCase() === "approved");
      setApplications(approvedApps);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  // ✅ Handle payment for each application
  const handlePayment = async (applicationId) => {
    setMessage("");
    try {
      const orderRes = await axios.post(
        `http://localhost:3500/admin/applications/${applicationId}/create-order`
      );

      if (!orderRes || orderRes.status !== 201) {
        setMessage("❌ Failed to create payment order");
        return;
      }

      const { order, key } = orderRes.data;

      const options = {
        key: key || process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_your_key_here",
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Scholarship Payment",
        description: `Payment for Application ${applicationId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await axios.post(
              `http://localhost:3500/admin/applications/${applicationId}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.status !== 200) {
              setMessage("⚠️ Payment verification failed");
              return;
            }

            setMessage("✅ Payment verified successfully! Processing payout...");

            // Trigger payout
            const payoutRes = await axios.patch(
              `http://localhost:3500/admin/applications/${applicationId}/makepayout`
            );

            if (payoutRes.status === 200) {
              setMessage("✅ Payment and payout completed successfully!");
              fetchApprovedApplications();
            } else {
              setMessage("⚠️ Payout failed. Please check logs.");
            }
          } catch (verifyErr) {
            setMessage(`⚠️ Error verifying payment: ${verifyErr.message}`);
          }
        },
        prefill: {
          name: "Admin",
          email: "admin@example.com",
        },
        theme: { color: "#ffae00" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setMessage("⚠️ Razorpay SDK not loaded. Add checkout.js script.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setMessage(`⚠️ ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Wrapper>
      <Title>💳 Approved Applications - Make Payment</Title>

      {loading && <div>Loading approved applications...</div>}
      {!loading && applications.length === 0 && <div>No approved applications found</div>}

      <List>
        {applications.map((app) => (
          <Card key={app._id}>
            <Row>
              <Label>Student:</Label> <Value>{app.studentname}</Value>
            </Row>
            <Row>
              <Label>Email:</Label> <Value>{app.studentemail}</Value>
            </Row>
            <Row>
              <Label>Institution:</Label> <Value>{app.institutionname}</Value>
            </Row>
            <Row>
              <Label>Scholarship:</Label> <Value>{app.scholarshipId?.scholarshipName}</Value>
            </Row>
            <Row>
              <Label>FundedAmount:</Label> <Value>₹{app.fundedraised}</Value>
            </Row>
            <Row>
              <Label>Created:</Label>{" "}
              <Value>{new Date(app.createdAt).toLocaleDateString()}</Value>
            </Row>

            <Button onClick={() => handlePayment(app._id)}>Make Payment</Button>
          </Card>
        ))}
      </List>

      {message && <Message type={message.startsWith("❌") || message.startsWith("⚠️") ? "error" : "success"}>{message}</Message>}
    </Wrapper>
  );
};

export default MakePayment;
