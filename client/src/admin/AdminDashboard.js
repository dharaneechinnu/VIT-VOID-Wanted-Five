import React, { useState } from "react";
import styled from "styled-components";
import MakePayment from "./MakePayment";
import ViewApplications from "./ViewApplications";
import CreateScholar from "./CreateScholar";
import ViewTransactions from "./ViewTransactions";
import { useNavigate } from "react-router-dom";

const drawerWidth = 250;

/* ---- WRAPPER ---- */
const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9fbff;
  font-family: 'Poppins', sans-serif;
`;

/* ---- TOP BAR ---- */
const TopBar = styled.div`
  width: 100%;
  background: #ffffff;
  border-bottom: 2px solid #dceeff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 28px;
  box-shadow: 0 2px 6px rgba(0, 162, 255, 0.08);
`;

/* ---- LOGOUT BUTTON ---- */
const LogoutButton = styled.button`
  background: #00a2ff;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 162, 255, 0.15);

  &:hover {
    background: #0092e5;
    box-shadow: 0 3px 6px rgba(0, 136, 224, 0.25);
  }
`;

/* ---- MAIN BODY ---- */
const BodyContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
`;

/* ---- SIDEBAR ---- */
const Sidebar = styled.aside`
  width: ${drawerWidth}px;
  background: #ffffff;
  border-right: 2px solid #dceeff;
  padding: 24px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
`;

/* ---- LOGO ---- */
const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #00a2ff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  width: 100%;
  text-align: left;
`;

/* ---- NAVIGATION ---- */
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const NavButton = styled.button`
  background: ${(props) => (props.active ? "#00a2ff" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#00a2ff")};
  border: 2px solid #00a2ff;
  padding: 10px 14px;
  border-radius: 8px;
  width: 100%;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => (props.active ? "#0092e5" : "#eaf5ff")};
  }
`;

/* ---- MAIN CONTENT ---- */
const Content = styled.main`
  flex: 1;
  background: #ffffff;
  padding: 40px;
  box-sizing: border-box;
  border-left: 2px solid #eaf3ff;
  display: flex;
  flex-direction: column;
`;

/* ---- HEADER ---- */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid #eaf3ff;
  padding-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #00a2ff;
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.4px;
`;

const AdminDashboard = () => {
  const [active, setActive] = useState("view");
  const navigate = useNavigate();

  // ✅ Read admin info safely
  let storedAdmin = null;
  try {
    const raw = localStorage.getItem("adminAuth");
    if (raw && raw !== "undefined" && raw !== "null") {
      const parsed = JSON.parse(raw);
      storedAdmin = parsed.admin || parsed;
    }
  } catch (e) {
    console.warn("Invalid adminAuth format:", e);
    storedAdmin = null;
  }

  // ✅ Logout function
  const handleLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Error clearing localStorage during logout", e);
    }
    navigate("/admin/login");
  };

  // ✅ Render content dynamically
  const renderContent = () => {
    switch (active) {
      case "view":
        return <ViewApplications />;
      case "create":
        return <CreateScholar />;
      case "payment":
        return <MakePayment onBack={() => setActive("view")} />;
      case "transactions":
        return <ViewTransactions />;
      default:
        return <ViewApplications />;
    }
  };

  return (
    <DashboardWrapper>
      {/* ✅ Top Bar */}
      <TopBar>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </TopBar>

      {/* ✅ Main Body */}
      <BodyContainer>
        <Sidebar>
          <Logo>Admin Panel</Logo>

          {/* ✅ Email Box */}
          <div
            style={{
              background: "#f4faff",
              border: "2px solid #bde0ff",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "24px",
              textAlign: "left",
              boxShadow: "0 2px 6px rgba(0, 162, 255, 0.1)",
              width: "100%",
            }}
          >
            {storedAdmin ? (
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#00a2ff",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  {storedAdmin.orgName || storedAdmin.name || "Admin"}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#1e40af",
                    wordBreak: "break-word",
                  }}
                >
                  {storedAdmin.contactEmail ||
                    storedAdmin.email ||
                    "No Email Available"}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Not signed in
              </div>
            )}
          </div>

          {/* ✅ Navigation */}
          <Nav>
            <NavButton
              active={active === "view"}
              onClick={() => setActive("view")}
            >
              View Applications
            </NavButton>
            <NavButton
              active={active === "create"}
              onClick={() => setActive("create")}
            >
              Create Scholar
            </NavButton>
            <NavButton
              active={active === "payment"}
              onClick={() => setActive("payment")}
            >
              Make Payment
            </NavButton>
            <NavButton
              active={active === "transactions"}
              onClick={() => setActive("transactions")}
            >
              View Transactions
            </NavButton>
          </Nav>
        </Sidebar>

        {/* ✅ Main Content */}
        <Content>
          <Header>
            <Title>
              {active === "view"
                ? "View Applications"
                : active === "create"
                ? "Create Scholarship"
                : active === "payment"
                ? "Make Payment"
                : "View Transactions"}
            </Title>
          </Header>

          {renderContent()}
        </Content>
      </BodyContainer>
    </DashboardWrapper>
  );
};

export default AdminDashboard;
