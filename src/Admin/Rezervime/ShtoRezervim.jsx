import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomSelect from "../../CustomSelect";

const ShtoRezervim = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nrPeople, setNrPeople] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();

  const isValid = () => {
    const errors = {};

    if (!movieId) errors.movieId = "Zgjidh një film!";
    if (!fullName) errors.fullName = "Emri nuk mund të jetë bosh!";
    if (!email) errors.email = "Email nuk mund të jetë bosh!";
    if (!nrPeople) {
      errors.nrPeople = "Nr.biletave nuk mund të jetë bosh!";
    } else if (isNaN(nrPeople) || parseInt(nrPeople) <= 0)
      errors.nrPeople = "Vendos një numër të vlefshëm biletash!";

    setInputErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://teater-api.arkiva.gov.al/api/movies"
      );
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (error) {
      toast.error(
        `${
          error.response?.data?.message || "Gabim gjatë ngarkimit të filmave!"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser_id");
    if (!loggedUser) {
      alert("Hyr për të shtuar rezervime!");
      navigate("/login");
      localStorage.clear();
    } else {
      setIsAuthorized(true);
      fetchMovies();
    }
  }, [navigate]);

  const addReservation = async () => {
    if (!isValid()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "https://teater-api.arkiva.gov.al/api/reservations/new",
        {
          fullName,
          email,
          nrPeople,
          movie: movieId,
        }
      );

      if (response.status === 200) {
        toast.success("Rezervimi u shtua me sukses!", {
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
        setMovieId("");
        setFullName("");
        setEmail("");
        setNrPeople("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ndodhi një gabim gjatë ruajtjes!", {
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
        <div className="page-title">Shto rezervim</div>
        <div className="header-actions">
          <button
            onClick={() => navigate("/menaxho/rezervime")}
            className="back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Kthehu tek rezervimet
          </button>
        </div>
      </div>

      <div className="page-content add-movie-container">
        <div className="add-movie-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-user-check"></i>
              Shto rezervim
            </div>
          </div>

          <div className="card-content">
            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-film"></i>
                  Filmi
                </label>
                <div className="field-input">
                  <CustomSelect
                    options={movies.map((movie) => ({
                      value: movie._id,
                      label: `${movie.title} - ${movie.date} @ ${movie.time}`,
                    }))}
                    value={
                      movieId
                        ? {
                            value: movieId,
                            label:
                              movies.find((m) => m._id === movieId)?.title ||
                              "",
                          }
                        : null
                    }
                    onChange={(selectedOption) => {
                      setMovieId(selectedOption ? selectedOption.value : "");
                    }}
                    placeholder="Zgjidh një film"
                    classNamePrefix={inputErrors.movieId ? "error-input" : ""}
                  />
                  {inputErrors.movieId && (
                    <div className="error-message">{inputErrors.movieId}</div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-user"></i>
                  Emër Mbiemër
                </label>
                <div className="field-input">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Vendosni emrin"
                    className={inputErrors.fullName ? "error-input" : ""}
                  />
                  {inputErrors.fullName && (
                    <div className="error-message">{inputErrors.fullName}</div>
                  )}
                </div>
              </div>
              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-user"></i>
                  Email
                </label>
                <div className="field-input">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Vendosni emailin"
                    className={inputErrors.email ? "error-input" : ""}
                  />
                  {inputErrors.email && (
                    <div className="error-message">{inputErrors.email}</div>
                  )}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">
                  <i className="fa-solid fa-users"></i>
                  Numri i biletave
                </label>
                <div className="field-input">
                  <input
                    type="number"
                    value={nrPeople}
                    onChange={(e) => setNrPeople(e.target.value)}
                    placeholder="Vendosni numrin e biletave"
                    className={inputErrors.nrPeople ? "error-input" : ""}
                  />
                  {inputErrors.nrPeople && (
                    <div className="error-message">{inputErrors.nrPeople}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() => navigate("/menaxho/rezervime")}
              >
                Anullo
              </button>
              <button className="save-btn" onClick={addReservation}>
                <i className="fa-solid fa-plus"></i>
                Shto rezervim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShtoRezervim;
