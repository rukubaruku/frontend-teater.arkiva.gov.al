import "./login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "../../Assets/Images/icon.png";

const Login = () => {
  const [emailL, setEmailL] = useState("");
  const [passwordL, setPasswordL] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogIn = async () => {
    const userToLogin = { email: emailL, password: passwordL };
    try {
      const response = await axios.post(
        "https://teater-api.arkiva.gov.al/api/users/login",
        userToLogin
      );
      if (response.data.type === "error") {
        setLoginError(response.data.message);
        return;
      }

      const user = response.data;
      if (user) {
        navigate("/manage/dashboard");
        localStorage.setItem("loggedUser_id", user._id);
      } else {
        localStorage.setItem("loggedUser_id", 0);
        setLoginError("Email and password do not match!");
      }
    } catch (error) {
      console.log(error);
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
                value={emailL}
                onChange={(e) => setEmailL(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box pass">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={passwordL}
                onChange={(e) => setPasswordL(e.target.value)}
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
