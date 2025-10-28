import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const PaymentWrapper = styled.div`
  min-height: 100vh;
  background: #181818;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const PaymentContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: #222;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const Title = styled.h1`
  color: #ffae00;
  font-size: 2.2rem;
  margin-bottom: 30px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #333;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #ffae00;
  }
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(90deg, #ffae00, #ff6600);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${props => (props.disabled ? 0.7 : 1)};
  transition: all 0.3s;
  margin-top: 20px;

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #ffc233, #ff8533);
    box-shadow: 0 5px 15px rgba(255,174,0,0.3);
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid #ffae00;
  color: #ffae00;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s;

  &:hover {
    background: #ffae00;
    color: #000;
  }
`;

const Message = styled.div`
  color: ${props =>
    props.type === "success" ? "#00e676" :
    props.type === "error" ? "#ff1744" : "#ffe066"};
  background: ${props =>
    props.type === "success" ? "rgba(0,230,118,0.1)" :
    props.type === "error" ? "rgba(255,23,68,0.1)" : "rgba(255,224,102,0.1)"};
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  font-weight: 500;
  text-align: center;
`;

const MakePayment = ({ onBack }) => {
  const [formData, setFormData] = useState({
    applicationId: "",
    amount: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.applicationId) {
      setMessage("❌ Please enter an application ID");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // 1) Create an order for this application on the backend
      const orderRes = await axios.post(
        `http://localhost:3500/admin/applications/${formData.applicationId}/create-order`
      );

      if (!orderRes || orderRes.status !== 201) {
        setMessage('❌ Failed to create order on server');
        setLoading(false);
        return;
      }

  const { order, key } = orderRes.data;

      const options = {
        key: key || process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Scholarship Payment',
        description: `Payment for Application ${formData.applicationId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 2) Verify the payment on the backend
            const verifyRes = await axios.post(
              `http://localhost:3500/admin/applications/${formData.applicationId}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (!verifyRes || verifyRes.status !== 200) {
              setMessage('⚠️ Payment verification failed on server');
              return;
            }

            setMessage(`✅ Payment verified. Transaction: ${verifyRes.data.transaction?._id || verifyRes.data.transaction?.orderId || ''}`);

            // 3) Trigger payout to verifier (existing backend endpoint)
            try {
              const payoutRes = await axios.patch(
                `http://localhost:3500/admin/applications/${formData.applicationId}/makepayout`
              );

              if (payoutRes && payoutRes.status === 200) {
                setMessage(prev => prev + `\n✅ Payout initiated. Payout transfer id: ${payoutRes.data.payoutResponse?.id || payoutRes.data.transaction?._id}`);
              } else {
                setMessage(prev => prev + `\n⚠️ Payout failed or returned non-200 status`);
              }
            } catch (payoutErr) {
              console.error('Payout error:', payoutErr);
              setMessage(prev => prev + `\n⚠️ Payout error: ${payoutErr.response?.data?.message || payoutErr.message}`);
            }
          } catch (verifyErr) {
            console.error('Verify error:', verifyErr);
            setMessage(`⚠️ Verification error: ${verifyErr.response?.data?.message || verifyErr.message}`);
          }
        },
        prefill: {
          name: 'Admin',
          email: 'admin@example.com',
        },
        theme: { color: '#ffae00' },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setMessage('⚠️ Razorpay SDK not available. Add <script src="https://checkout.razorpay.com/v1/checkout.js"></script> to your index.html');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage(`⚠️ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  let msgType = "info";
  if (message.startsWith("✅")) msgType = "success";
  else if (message.startsWith("❌")) msgType = "error";

  return (
    <PaymentWrapper>
      <BackButton onClick={onBack}>← Back to Dashboard</BackButton>
      
      <PaymentContainer>
        <Title>Make Payment</Title>
        
        <form onSubmit={handlePayment}>
          <FormGroup>
            <Label htmlFor="applicationId">Application ID</Label>
            <Input
              type="text"
              id="applicationId"
              name="applicationId"
              value={formData.applicationId}
              onChange={handleChange}
              placeholder="Enter application ID"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="amount">Amount (INR) - Optional</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount will be fetched from scholarship"
              disabled
            />
          </FormGroup>

          <PaymentButton type="submit" disabled={loading}>
            {loading ? "Processing Payment..." : "Initiate Payment"}
          </PaymentButton>
        </form>

        {message && <Message type={msgType}>{message}</Message>}
      </PaymentContainer>
    </PaymentWrapper>
  );
};

export default MakePayment;