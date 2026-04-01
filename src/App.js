import "./App.css";
import { useState } from "react";
import Login from "./Login";
import LandingPage from "./LandingPage";
import BuildingPage from "./BuildingPage";
import AdminPage from "./AdminPage";

function App() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [role, setRole]               = useState(null);
  const [currentPage, setCurrentPage] = useState("landing");

  if (!isLoggedIn) {
    return (
      <Login onLogin={(userRole) => {
        setRole(userRole);
        setIsLoggedIn(true);
      }} />
    );
  }

  if (role === "admin") {
    return <AdminPage onLogout={() => { setIsLoggedIn(false); setRole(null); }} />;
  }

  if (currentPage === "building") {
    return <BuildingPage onBack={() => setCurrentPage("landing")} />;
  }
  return <LandingPage onGoToBuilding={() => setCurrentPage("building")} />;
}

export default App;
