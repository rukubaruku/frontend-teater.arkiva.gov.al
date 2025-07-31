import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Table from "../../Table/Table";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "./rezervime.css";

const Rezervime = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const navigate = useNavigate();

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reservations"
      );
      if (response.status === 200) {
        setReservations(response.data.data);
        setFilteredReservations(response.data.data);
      }
    } catch (error) {
      toast.error(
        `${error.response?.data?.message || "Error fetching reservations"}`,
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

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      if (Array.isArray(response.data?.data)) {
        setMovies(response.data.data);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  const handleMovieChange = (e) => {
    const movieId = e.target.value;
    setSelectedMovie(movieId);

    if (movieId === "") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter((r) => {
          // Support both string and populated object
          if (typeof r.movie === "string") return r.movie === movieId;
          if (typeof r.movie === "object" && r.movie !== null)
            return r.movie._id === movieId;
          return false;
        })
      );
    }
  };

  const exportCSV = () => {
    const movie = movies.find((m) => m._id === selectedMovie);
    const title = movie ? movie.title : "All Reservations";

    let csvContent = `Movie title: ${title}\nFull Name,Nr. personave\n`;
    filteredReservations.forEach((r) => {
      csvContent += `${r.fullName},${r.nrPeople}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${title.replace(/\s+/g, "_")}_reservations.csv`);
  };

  const exportPDF = () => {
    const movie = movies.find((m) => m._id === selectedMovie);
    const title = movie ? movie.title : "All Reservations";

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Movie title: ${title}`, 10, 10);

    let y = 20;
    filteredReservations.forEach((r) => {
      doc.text(`${r.fullName} => ${r.nrPeople}`, 10, y);
      y += 10;
    });

    doc.output("dataurlnewwindow");
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser_id");
    if (!loggedUser) {
      alert("Hyr per te pare rezervimet!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchReservations();
      fetchMovies();
    }
  }, [navigate]);

  const columns = [
    { field: "fullName", header: "Emër mbiemër", size: 500 },
    { field: "nrPeople", header: "Nr. personave", size: 100 },
  ];

  const handleRowClick = (movie) => {
    navigate(`/menaxho/rezervim/${movie.id}`);
  };

  const handleClearFilters = () => {
    setSelectedMovie("");
    setFilteredReservations(reservations);
  };

  return (
    <div className="content-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">Rezervime</div>
        <div className="controls">
          <div className="add-btn">
            <button
              onClick={() => navigate("/menaxho/rezervime/shto-rezervim")}
            >
              + Shto rezervim
            </button>
          </div>
        </div>
      </div>

      <div className="page-content reservations">
        <div className="filters-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-filter"></i>
              Filtro sipas filmit
            </div>
            {selectedMovie && (
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="fa-solid fa-times"></i>
                Cancella Filtri
              </button>
            )}
          </div>

          <div className="card-content">
            <div className="filters-grid">
              <div className="filter-field">
                <label className="filter-label">
                  <i className="fa-solid fa-user"></i>
                  Titulli
                </label>
                <div className="filter-input">
                  <select
                    value={selectedMovie}
                    onChange={handleMovieChange}
                    className="filter-select"
                  >
                    <option value="">Zgjidh film</option>
                    {Array.isArray(movies) &&
                      movies.length > 0 &&
                      movies.map((movie) => (
                        <option key={movie._id} value={movie._id}>
                          {movie.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="filters-summary">
              <div className="active-filters">
                {selectedMovie && (
                  <span className="filter-tag">
                    <i className="fa-solid fa-film"></i>
                    Filmi: {movies.find((m) => m._id === selectedMovie)?.title}
                  </span>
                )}
              </div>
              <div className="results-count">
                {filteredReservations?.length || 0} rezervime të gjetura
              </div>
            </div>
          </div>

          <div className="export-btn">
            <button onClick={exportCSV}>Export CSV</button>
            <button onClick={exportPDF}>Export PDF</button>
          </div>
        </div>

        {filteredReservations && (
          <Table
            columns={columns}
            data={filteredReservations}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default Rezervime;
