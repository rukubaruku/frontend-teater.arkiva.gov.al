import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./filma.css";
import CustomSelect from "../../CustomSelect";

const ShtoFilm = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();

  const isValid = () => {
    const errors = {};

    if (!title) {
      errors.title = "Titulli nuk mund të jetë bosh!";
    }

    if (!date) {
      errors.date = "Data nuk mund të jetë bosh!";
    }

    if (!time) {
      errors.time = "Ora nuk mund të jetë bosh!";
    }
    if (!status) {
      errors.status = "Statusi nuk mund të jetë bosh!";
    }

    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const statusOptions = [
    { value: "pending", label: "Në pritje" },
    { value: "completed", label: "Përfunduar" },
  ];

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser_id");
    if (!loggedUser) {
      alert("Hyr për të shtuar filma!");
      navigate("/login");
      localStorage.clear();
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const addMovie = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3107/api/movies/new",
        {
          title,
          date,
          time,
          status,
        }
      );

      if (response.status === 200) {
        toast.success("Filmi u shtua me sukses!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setTitle("");
        setDate("");
        setTime("");
        setStatus("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ndodhi një gabim!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="content-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">Shto film</div>
        <div className="header-actions">
          <button
            onClick={() => navigate("/menaxho/filma")}
            className="back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Kthehu tek filmat
          </button>
        </div>
      </div>

      <div className="page-content add-movie-container">
        <div className="add-movie-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-film"></i>
              Shto film
            </div>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-ticket"></i>
                  Titulli
                </label>
                <div className="field-input">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Vendosni titullin"
                    className={inputErrors.nome ? "error-input" : ""}
                  />
                  {inputErrors.title && (
                    <div className="error-message">{inputErrors.title}</div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-calendar-days"></i>
                  Data
                </label>
                <div className="field-input">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Zgjidhni datën"
                    className={inputErrors.cognome ? "error-input" : ""}
                  />
                  {inputErrors.date && (
                    <div className="error-message">{inputErrors.date}</div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-clock"></i>
                  Ora
                </label>
                <div className="field-input">
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Vendosni orën"
                    className={inputErrors.email ? "error-input" : ""}
                  />
                  {inputErrors.time && (
                    <div className="error-message">{inputErrors.time}</div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-list-check"></i>
                  Statusi
                </label>
                <div className="field-input">
                  <CustomSelect
                    options={statusOptions}
                    value={
                      statusOptions.find((opt) => opt.value === status) || null
                    }
                    onChange={(selectedOption) =>
                      setStatus(selectedOption?.value || "")
                    }
                    placeholder="Zgjidh statusin"
                  />
                  {inputErrors.status && (
                    <div className="error-message">{inputErrors.status}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() => navigate("/menaxho/filma")}
              >
                <i className="fa-solid fa-times"></i>
                Anullo
              </button>
              <button className="save-btn" onClick={addMovie}>
                <i className="fa-solid fa-plus"></i>
                Shto film
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShtoFilm;
