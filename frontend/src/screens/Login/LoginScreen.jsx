import React, { useState } from "react";
import "./LoginScreen.css";
import logo from "../../assets/images/Logo.png";
import woman from "../../assets/svg/Woman.svg";
import man from "../../assets/svg/Man.svg";
import { login } from "../../core/RequestEngine";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.status === 200) {
        const { token } = response.data;
        sessionStorage.setItem("token", token);
        window.location.href = "/dashboard";
      } else {
        setErrorMessage("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <section className="login-left-section">
        <div className="login-logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <div className="login-illustrations">
          <img src={woman} alt="Woman Illustration" />
          <img src={man} alt="Man Illustration" />
        </div>
      </section>

      <section className="login-right-section">
        <h1 className="login-title">Time to Work!</h1>
        <form className="login-form" onSubmit={handleLogin}>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="input-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="login-input"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="login-input"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            SIGN IN
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
