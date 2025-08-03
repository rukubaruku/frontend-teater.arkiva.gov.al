import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Table from "../../Table/Table";
import axios from "axios";
import CustomSelect from "../../CustomSelect";

const Filma = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://teater-api.arkiva.gov.al/api/movies"
      );

      if (response.status === 200) {
        const now = new Date();

        const updatedMovies = await Promise.all(
          response.data.map(async (movie) => {
            const movieDateTime = new Date(`${movie.date}T${movie.time}`);

            const formattedDate = new Date(movie.date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\//g, ".");

            let status = movie.status;
            if (status === "pending" && movieDateTime < now) {
              try {
                await axios.patch(
                  `https://teater-api.arkiva.gov.al/api/movies/${movie._id}`,
                  { status: "completed" }
                );
                status = "completed";
              } catch (err) {
                console.error(
                  `Failed to update status for movie ${movie.title}`,
                  err
                );
              }
            }

            const translatedStatus =
              status === "pending" ? "Në pritje" : "Përfunduar";

            return {
              ...movie,
              id: movie._id,
              date: formattedDate,
              rawDate: movie.date,
              status: translatedStatus,
            };
          })
        );

        setMovies(updatedMovies);
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message || "Gabim në server"}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser_id");
    if (!loggedUser) {
      alert("Hyr per te pare filmat!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchMovies();
    }
  }, [navigate]);

  const columns = [
    { field: "title", header: "Titulli", size: 400 },
    { field: "date", header: "Data" },
    { field: "time", header: "Ora" },
    { field: "status", header: "Statusi" },
  ];

  const handleRowClick = (movie) => {
    navigate(`/menaxho/filma/${movie.id}`);
  };

  const yearOptions = [
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
  ];

  const handleYearChange = (selectedOption) => {
    setSelectedYear(selectedOption ? selectedOption.value : null);
  };

  const handleClearFilters = () => {
    setSelectedYear(null);
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const movieYear = new Date(movie.rawDate).getFullYear();
      return !selectedYear || movieYear === selectedYear;
    });
  }, [movies, selectedYear]);

  return (
    <div className="content-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">Filma</div>
        <div className="controls">
          <div className="add-btn">
            <button onClick={() => navigate("/menaxho/filma/shto-film")}>
              + Shto film
            </button>
          </div>
        </div>
      </div>

      <div className="page-content users">
        <div className="filters-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fa-solid fa-filter"></i>
              Filtro sipas vitit
            </div>
            {selectedYear && (
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="fa-solid fa-times"></i>
                Hiq filtrat
              </button>
            )}
          </div>

          <div className="card-content">
            <div className="filters-grid">
              <div className="filter-field">
                <label className="filter-label">
                  <i className="fa-solid fa-calendar"></i>
                  Viti
                </label>
                <div className="filter-input">
                  <CustomSelect
                    options={yearOptions}
                    value={
                      selectedYear
                        ? yearOptions.find((y) => y.value === selectedYear)
                        : null
                    }
                    onChange={handleYearChange}
                    placeholder="Zgjidh vit"
                    isMulti={false}
                  />
                </div>
              </div>
            </div>

            <div className="filters-summary">
              <div className="active-filters">
                {selectedYear && (
                  <span className="filter-tag">
                    <i className="fa-solid fa-calendar"></i>
                    Viti: {selectedYear}
                  </span>
                )}
              </div>
              <div className="results-count">
                {filteredMovies.length} filma të gjetura
              </div>
            </div>
          </div>
        </div>
        {filteredMovies && (
          <Table
            columns={columns}
            data={filteredMovies}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </div>
  );
};

export default Filma;
