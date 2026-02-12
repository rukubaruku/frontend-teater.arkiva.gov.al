import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "../../Assets/Images/icon.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogIn = async () => {
    setLoginError("");

    const userToLogin = { email, password };

    try {
      const response = await axios.post(
        "https://teater-api.arkiva.gov.al/api/users/login",
        userToLogin,
        {
          withCredentials: true,
        },
      );

      const user = response.data;
      if (user && user._id) {
        localStorage.setItem("loggedUser_id", user._id);
        navigate("/menaxho/dashboard");
      } else {
        setLoginError("Autentikimi dështoi. Ju lutem provoni përsëri.");
      }
    } catch (error) {
      if (
        error.response?.data?.type === "error" &&
        error.response?.data?.message
      ) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Ndodhi një gabim i papritur. Ju lutem provoni më vonë.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="body-container">
      <div className="container">
        <div className="form-box login">
          <div className="login-box">
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box pass">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
              {loginError && <div className="error">{loginError}</div>}
            </div>
            <div className="forgot">Frogot Password</div>
            <button className="btn" onClick={handleLogIn}>
              Login
            </button>
          </div>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Drejtoria e Përgjithshme e Arkivave!</h1>
            <img src={Logo} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
