import "./Login.css";
import { useState } from "react";

function Login({ onLogin }) {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRole = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Role check
    if (!role) {
      alert("Please select a role");
      return;
    }

    // Email validation
    if (!email.toLowerCase().endsWith("@iiitdmj.ac.in")) {
      alert("Please login using your institute email id");
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      // Check server response
      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      if (data.status === "success") {
        alert("Login successful!");
        onLogin(role.toLowerCase()); // send role to parent
      } else {
        alert(data.message || "Invalid login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Backend connection failed. Check server.");
    }
  };

  return (
    <div
      className="loginPage"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/image.png)` }}
    >
      <div className="loginOverlay"></div>

      <div className="floatingCircle c1"></div>
      <div className="floatingCircle c2"></div>
      <div className="floatingCircle c3"></div>

      <div className="loginContainer">
        <img src="/logo.png" alt="IIITDMJ Logo" className="loginPageLogo" />

        <h1 className="loginTitle">👋 Welcome to IntraMap</h1>

        <p className="loginSubtitle">
          Navigate IIITDMJ Campus Smartly
        </p>

        {/* ROLE SELECTION */}
        {role === "" && (
          <div className="loginOptions">
            <div className="loginCard">
              <h2>🎓 Student</h2>

              <p>Explore buildings and navigate the campus.</p>

              <button
                className="loginBtn"
                onClick={() => handleRole("Student")}
              >
                Login as Student
              </button>
            </div>

            <div className="loginCard">
              <h2>🛠 Admin</h2>

              <p>Manage building locations and campus data.</p>

              <button
                className="loginBtn"
                onClick={() => handleRole("Admin")}
              >
                Login as Admin
              </button>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {role !== "" && (
          <form className="loginForm" onSubmit={handleSubmit}>
            <h3>Login as {role}</h3>

            <p className="loginNote">
              Use your institute email id
            </p>

            <input
              type="email"
              placeholder="Institute Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            {/* Optional: Back button */}
            <button
              type="button"
              onClick={() => setRole("")}
              style={{ marginTop: "10px" }}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
