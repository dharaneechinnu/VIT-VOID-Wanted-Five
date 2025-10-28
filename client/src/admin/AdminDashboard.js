import React, { useState } from "react";
import styled from "styled-components";
import MakePayment from "./MakePayment";

const drawerWidth = 220;

const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #181818;
  font-family: 'Poppins', sans-serif;
`;

const Drawer = styled.div`
  width: ${drawerWidth}px;
  background: #222;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 40px;
  box-shadow: 2px 0 10px rgba(0,0,0,0.2);
  position: relative;
`;

const DrawerHeader = styled.div`
  width: 100%;
  padding: 0 0 30px 32px;
`;

const DrawerTitle = styled.h2`
  color: #ffae00;
  font-weight: 700;
  font-size: 1.7rem;
  margin: 0;
`;

const DrawerButton = styled.button`
  margin-left: 32px;
  margin-bottom: 16px;
  padding: 12px 28px;
  background: linear-gradient(90deg, #ffae00, #ff6600);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255,174,0,0.15);
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(90deg, #ffc233, #ff8533);
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: #ffae00;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 24px;
`;

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");

  const handleMakePayment = () => {
    setCurrentView("payment");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  if (currentView === "payment") {
    return <MakePayment onBack={handleBackToDashboard} />;
  }

  return (
    <DashboardWrapper>
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Admin</DrawerTitle>
        </DrawerHeader>
        <DrawerButton onClick={handleMakePayment}>
          Make Payment
        </DrawerButton>
        {/* Add more drawer items here */}
      </Drawer>
      <MainContent>
        <Title>Welcome, Admin!</Title>
        <Subtitle>This is your dashboard. Use the drawer to access features.</Subtitle>
      </MainContent>
    </DashboardWrapper>
  );
};

export default AdminDashboard;
