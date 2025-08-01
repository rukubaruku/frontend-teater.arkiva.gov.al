import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Table from "../../Table/Table";
import axios from "axios";

const Filma = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://teater-api.arkiva.gov.al/api/movies"
      );
      if (response.status === 200) {
        const now = new Date();

        const updatedMovies = response.data.map((movie) => {
          const movieDateTime = new Date(`${movie.date}T${movie.time}`);

          const formattedDate = new Date(movie.date).toLocaleDateString(
            "sq-AL",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          );

          let status = movie.status;
          if (status === "pending" && movieDateTime < now) {
            status = "completed";
          }

          const translatedStatus =
            status === "pending" ? "Në pritje" : "Përfunduar";

          return {
            ...movie,
            date: formattedDate,
            status: translatedStatus,
          };
        });

        setMovies(updatedMovies);
      }
    } catch (error) {
      toast.error(`${error?.response?.data?.message || "Gabim në server"}`, {
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
    { field: "date", header: "Data", size: 100 },
    { field: "time", header: "Ora", size: 100 },
    { field: "status", header: "Statusi", size: 100 },
  ];

  const handleRowClick = (movie) => {
    navigate(`/menaxho/film/${movie.id}`);
  };

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
        {movies && (
          <Table columns={columns} data={movies} onRowClick={handleRowClick} />
        )}
      </div>
    </div>
  );
};

export default Filma;
