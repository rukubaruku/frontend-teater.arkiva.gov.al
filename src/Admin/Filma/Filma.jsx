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
      const response = await axios.get("http://localhost:5000/api/movies");
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, {
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
