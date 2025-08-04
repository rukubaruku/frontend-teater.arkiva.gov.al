import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import "./profili.css";
import axios from "axios";

const Profili = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [changePassToggle, setChangePassToggle] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState({});
  const changePassRef = useRef(null);
  const loggedUser = localStorage.getItem("loggedUser_id");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://teater-api.arkiva.gov.al/api/users/${loggedUser}`
      );
      if (res.status === 200) {
        setUser(res.data);
        setForm({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      } else if (res.status === 404) {
        toast.error(res.message || "Përdoruesi nuk u gjet!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gabim në server!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedUser) {
      alert("Hyr për të parë profilin!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchUser();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      }
      return prevErrors;
    });
  };

  const validate = () => {
    const inputErrors = {};
    if (!form.firstName.trim())
      inputErrors.firstName = "Emri nuk mund të jetë bosh!";
    if (!form.lastName.trim())
      inputErrors.lastName = "Mbiemri nuk mund të jetë bosh!";
    if (!form.email.trim()) inputErrors.email = "Email nuk mund të jetë bosh!";
    if (!form.phone.trim())
      inputErrors.phone = "Nr.telefonit nuk mund të jetë bosh!";

    setErrors(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      };

      const res = await axios.put(
        `https://teater-api.arkiva.gov.al/api/users/update/${loggedUser}`,
        payload
      );

      if (res.status === 200) {
        toast.success("Profili u modifikua me sukses!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });

        setUser(res.data.user || res.data);
        setEditMode(false);
        fetchUser();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        `Gabim: ${err.response?.status || "Server error"} - ${
          err.response?.data?.message || ""
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
    setErrors({});
    setEditMode(false);
  };

  const isStrongPassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const isValid = () => {
    const inputErrors = {};
    if (currentPassword.trim() === "") {
      inputErrors.currentPassword = "Fjalëkalimi aktual nuk mund të jetë bosh!";
      return false;
    }

    if (newPassword.trim() === "") {
      inputErrors.newPassword = "Fjalëkalimi i ri nuk mund të jetë bosh!";
      return false;
    } else if (!isStrongPassword(newPassword)) {
      inputErrors.newPassword =
        "Fjalëkalimi duhet të ketë 8 karaktere, 1 shkronjë të madhe, 1 të vogël, 1 numër dhe 1 karakter special!";
    }

    if (confirmNewPassword.trim() === "") {
      inputErrors.confirmNewPassword =
        "Konfirmimi i fjalëkalimit nuk mund të jetë bosh!";
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      inputErrors.confirmNewPassword = "Fjalëkalimet nuk përputhen!";
      return false;
    }

    setError(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  const changePassword = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);
      const response = await axios.put(
        `https://teater-api.arkiva.gov.al/api/users/reset-password/${loggedUser}`,
        {
          currentPassword,
          newPassword,
          confirmationPassword: confirmNewPassword,
        }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setChangePassToggle(false);
        toast.success(
          response.data?.message || "Fjalëkalimi u ndryshua me sukses!",
          {
            position: "top-right",
            autoClose: 5000,
            theme: "light",
            transition: Bounce,
          }
        );
      }
    } catch (error) {
      console.error("Gabim gjatë ndryshimit të fjalëkalimit:", error);
      toast.error(
        error.response?.data?.message ||
          `Gabim ${
            error.response?.status || ""
          }: Ndryshimi i fjalëkalimit dështoi!`,
        {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  };

  return (
    <div className="user-profile-container">
      {loading && (
        <div className="user-profile-overlay">
          <div className="user-profile-spinner"></div>
        </div>
      )}

      <div className="user-profile-header">
        <div className="user-profile-header-content">
          <button
            className="user-profile-back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Kthehu</span>
          </button>
          <h1 className="user-profile-title">
            <i className="fa-solid fa-user-circle"></i>
            Profili i përdoruesit
          </h1>
          <div className="user-profile-actions">
            {!editMode && (
              <button
                className="user-profile-edit-btn"
                onClick={() => setEditMode(true)}
              >
                <i className="fa-solid fa-edit"></i>
                <span>Modifiko profilin</span>
              </button>
            )}
            <button
              className="user-profile-password-btn"
              onClick={() => {
                setChangePassToggle(true);
                setTimeout(() => {
                  changePassRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            >
              <i className="fa-solid fa-key"></i>
              <span>Ndrysho fjalëkalimin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile-content">
        {/* User Profile Card */}
        <div className="user-profile-card">
          <div className="user-profile-avatar-section">
            <div className="user-profile-avatar">
              <div className="user-profile-avatar-initials">
                {getInitials(user.nome, user.cognome)}
              </div>
              <div className="user-profile-status">
                <span className="user-profile-status-badge">
                  <i className="fa-solid fa-circle"></i>
                  Aktiv
                </span>
              </div>
            </div>
            <div className="user-profile-info">
              <h2 className="user-profile-name">
                {user.firstName} {user.lastName}
              </h2>
              <p className="user-profile-email">
                <i className="fa-solid fa-envelope"></i>
                {user.email || "Email jo i disponueshëm"}
              </p>
            </div>
          </div>
        </div>

        {/* User Details Card */}
        <div className="user-profile-details-card">
          <div className="user-profile-details-header">
            <h3 className="user-profile-details-title">
              <i className="fa-solid fa-info-circle"></i>
              Informacioni personal
            </h3>
            {editMode && (
              <div className="user-profile-edit-actions">
                <button
                  className="user-profile-cancel-btn"
                  onClick={handleCancel}
                >
                  <i className="fa-solid fa-times"></i>
                  <span>Anullo</span>
                </button>
                <button className="user-profile-save-btn" onClick={handleSave}>
                  <i className="fa-solid fa-save"></i>
                  <span>Ruaj ndryshimet</span>
                </button>
              </div>
            )}
          </div>

          <div className="user-profile-details-content">
            <div className="user-profile-field">
              <label className="user-profile-field-label">
                <i className="fa-solid fa-user"></i>
                Emri
              </label>
              <div className="user-profile-field-value">
                {editMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`user-profile-input ${
                      errors.firstName ? "error" : ""
                    }`}
                    placeholder="Vendos emrin"
                  />
                ) : (
                  <span className="user-profile-text">
                    {user.firstName || "—"}
                  </span>
                )}
                {errors.firstName && (
                  <span className="user-profile-error">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    {errors.firstName}
                  </span>
                )}
              </div>
            </div>

            <div className="user-profile-field">
              <label className="user-profile-field-label">
                <i className="fa-solid fa-user"></i>
                Mbiemri
              </label>
              <div className="user-profile-field-value">
                {editMode ? (
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`user-profile-input ${
                      errors.lastName ? "error" : ""
                    }`}
                    placeholder="Vendos mbiemrin"
                  />
                ) : (
                  <span className="user-profile-text">
                    {user.lastName || "—"}
                  </span>
                )}
                {errors.lastName && (
                  <span className="user-profile-error">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="user-profile-field">
              <label className="user-profile-field-label">
                <i className="fa-solid fa-align-left"></i>
                Email
              </label>
              <div className="user-profile-field-value">
                {editMode ? (
                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`user-profile-input ${
                      errors.email ? "error" : ""
                    }`}
                    placeholder="Vendos email-in"
                  />
                ) : (
                  <span className="user-profile-text">{user.email || "—"}</span>
                )}
                {errors.email && (
                  <span className="user-profile-error">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="user-profile-field">
              <label className="user-profile-field-label">
                <i className="fa-solid fa-phone"></i>
                Nr.telefonit
              </label>
              <div className="user-profile-field-value">
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`user-profile-input ${
                      errors.phone ? "error" : ""
                    }`}
                    placeholder="Vendos nr.telefonit"
                  />
                ) : (
                  <span className="user-profile-text">{user.phone || "—"}</span>
                )}
                {errors.phone && (
                  <span className="user-profile-error">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        {changePassToggle && (
          <div className="user-profile-password-card" ref={changePassRef}>
            <div className="user-profile-password-header">
              <h3 className="user-profile-password-title">
                <i className="fa-solid fa-key"></i>
                Ndrysho fjalëkalimin
              </h3>
              <button
                className="user-profile-close-btn"
                onClick={() => setChangePassToggle(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="user-profile-password-content">
              <div className="user-profile-field">
                <label className="user-profile-field-label">
                  <i className="fa-solid fa-lock"></i>
                  Fjalëkalimi aktual
                </label>
                <div className="user-profile-field-value">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`user-profile-input ${
                      error.currentPassword ? "error" : ""
                    }`}
                    placeholder="Vendos fjalëkalimin aktual"
                  />
                  {error.currentPassword && (
                    <span className="user-profile-error">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                      {error.currentPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="user-profile-field">
                <label className="user-profile-field-label">
                  <i className="fa-solid fa-lock"></i>
                  Fjalëkalimi i ri
                </label>
                <div className="user-profile-field-value">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`user-profile-input ${
                      error.newPassword ? "error" : ""
                    }`}
                    placeholder="Vendos fjalëkalimin e ri"
                  />
                  {error.newPassword && (
                    <span className="user-profile-error">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                      {error.newPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="user-profile-field">
                <label className="user-profile-field-label">
                  <i className="fa-solid fa-lock"></i>
                  Konfirmo fjalëkalimin
                </label>
                <div className="user-profile-field-value">
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={`user-profile-input ${
                      error.confirmNewPassword ? "error" : ""
                    }`}
                    placeholder="Konfirmo fjalëkalimin"
                  />
                  {error.confirmNewPassword && (
                    <span className="user-profile-error">
                      <i className="fa-solid fa-exclamation-triangle"></i>
                      {error.confirmNewPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="user-profile-password-actions">
                <button
                  className="user-profile-cancel-btn"
                  onClick={() => setChangePassToggle(false)}
                >
                  <i className="fa-solid fa-times"></i>
                  <span>Anullo</span>
                </button>
                <button
                  className="user-profile-save-btn"
                  onClick={changePassword}
                >
                  <i className="fa-solid fa-save"></i>
                  <span>Ruaj fjalëkalimin</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profili;
