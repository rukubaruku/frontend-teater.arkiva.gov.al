import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import "./filma.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "../../CustomSelect";

const EditFilm = () => {
  const [loading, setLoading] = useState(true);
  const [film, setFilm] = useState(null);
  const loggedUser = localStorage.getItem("loggedUser_id");
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://teater-api.arkiva.gov.al/api/movies/${id}`
      );
      if (res.status === 200) {
        setFilm(res.data);
        setForm({
          title: res.data.title || "",
          date: res.data.date || "",
          time: res.data.time || "",
        });
        setStatus(res.data.status || "");
      } else if (res.status === 404) {
        toast.error(res.message || "Filmi nuk u gjet!", {
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
      alert("Hyr për të parë të dhënat e filmit!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchMovie();
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value.trim()) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const validate = () => {
    const inputErrors = {};
    if (!form.title.trim()) {
      inputErrors.title = "Titulli nuk mund të jetë bosh!";
    }

    if (!form.date.trim()) {
      inputErrors.date = "Data nuk mund të jetë bosh!";
    }
    if (!form.time.trim()) {
      inputErrors.time = "Ora nuk mund të jetë bosh!";
    }
    if (!status.trim()) {
      inputErrors.status = "Statusi nuk mund të jetë bosh!";
    }

    setErrors(inputErrors);
    return Object.keys(inputErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        title: form.title,
        date: form.date,
        time: form.time,
        status: status,
      };

      const response = await axios.put(
        `https://teater-api.arkiva.gov.al/api/movies/update/${id}`,
        payload
      );
      if (response.status === 200) {
        toast.success("Detajet e filmit u modifikuan me sukses!", {
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
        setFilm(payload);
        setEditMode(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error.response?.data?.message || ""}`, {
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

  const handleCancel = () => {
    if (film) {
      setForm({
        title: film.title || "",
        date: film.date || "",
        time: film.time || "",
      });
      setStatus(film.status || "");
    }
    setErrors({});
    setEditMode(false);
  };

  const statusOptions = [
    { value: "pending", label: "Në pritje" },
    { value: "completed", label: "Përfunduar" },
  ];

  return (
    <div className="content-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">Modifiko të dhënat e filmit</div>
        <div className="header-actions">
          <button
            onClick={() => navigate("/menaxho/filma")}
            className="back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Kthehu
          </button>
        </div>
      </div>

      <div className="page-content edit-tipologia-container">
        <div className="edit-tipologia-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-film"></i>
              Detajet e filmit
            </div>
            {!editMode && (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                <i className="fa-solid fa-edit"></i>
                Modifiko
              </button>
            )}
          </div>

          <div className="card-content">
            {film && (
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    <i className="fa-solid fa-ticket"></i>
                    Filmi
                  </label>
                  <div className="field-input">
                    {!editMode ? (
                      <div className="readonly-value">{film.title}</div>
                    ) : (
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Vendos titullin e filmit"
                        className={errors.title ? "error-input" : ""}
                      />
                    )}
                    {errors.title && (
                      <div className="error-message">{errors.title}</div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <i className="fa-solid fa-calendar-days"></i>
                    Data
                  </label>
                  <div className="field-input">
                    {!editMode ? (
                      <div className="readonly-value">{film.date}</div>
                    ) : (
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        placeholder="Zgjidh datën"
                        className={errors.date ? "error-input" : ""}
                      />
                    )}
                    {errors.date && (
                      <div className="error-message">{errors.date}</div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <i className="fa-solid fa-clock"></i>
                    Ora
                  </label>
                  <div className="field-input">
                    {!editMode ? (
                      <div className="readonly-value">{film.time}</div>
                    ) : (
                      <input
                        type="text"
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        placeholder="Vendosni orarin e filmit"
                        className={errors.time ? "error-input" : ""}
                      />
                    )}
                    {errors.date && (
                      <div className="error-message">{errors.time}</div>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <i className="fa-solid fa-list-check"></i>
                    Statusi
                  </label>
                  <div className="field-input">
                    {!editMode ? (
                      <div className="readonly-value">
                        {film.status === "completed"
                          ? "Përfunduar"
                          : film.status === "pending"
                          ? "Në pritje"
                          : ""}
                      </div>
                    ) : (
                      <CustomSelect
                        options={statusOptions}
                        value={
                          statusOptions.find((opt) => opt.value === status) ||
                          null
                        }
                        onChange={(selectedOption) =>
                          setStatus(selectedOption?.value || "")
                        }
                        placeholder="Zgjidh statusin"
                        className={errors.status ? "error-input" : ""}
                      />
                    )}
                    {errors.status && (
                      <div className="error-message">{errors.status}</div>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="action-buttons">
                    <button className="cancel-btn" onClick={handleCancel}>
                      <i className="fa-solid fa-times"></i>
                      Anullo
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                      <i className="fa-solid fa-check"></i>
                      Ruaj ndryshimet
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFilm;
