import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import Table from "../../Table/Table";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "./rezervime.css";
import CustomSelect from "../../CustomSelect";
import PopUp from "../../PopUp";

const Rezervime = () => {
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedMovieIds, setSelectedMovieIds] = useState([]);
  const navigate = useNavigate();
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  const fetchReservations = async (movieIds = []) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://teater-api.arkiva.gov.al/api/reservations/filter`,
        { movieIds }
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
      const response = await axios.get(
        "https://teater-api.arkiva.gov.al/api/movies"
      );
      if (Array.isArray(response.data)) {
        setMovies(response.data);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  const handleMovieChange = (selectedOptions) => {
    const ids = selectedOptions?.map((option) => option.value) || [];
    setSelectedMovieIds(ids);
    fetchReservations(ids);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const exportCSV = () => {
    const moviesToExport =
      selectedMovieIds.length > 0
        ? movies.filter((m) => selectedMovieIds.includes(m._id))
        : movies;

    let csvContent = "\uFEFF";

    moviesToExport.forEach((movie) => {
      const reservationsForMovie = filteredReservations.filter(
        (r) => r.movie === movie._id
      );

      if (reservationsForMovie.length === 0) return;

      const totalPeople = reservationsForMovie.reduce(
        (acc, r) => acc + Number(r.nrPeople || 0),
        0
      );

      csvContent += `Titulli: ${movie.title}\n`;
      csvContent += `Data: ${formatDate(movie.date)}\n`;
      csvContent += `Ora: ${movie.time || "-"}\n`;
      csvContent += `Rezervuar: ${totalPeople}\n`;
      csvContent += `Emër mbiemër,Nr.Personave\n`;

      reservationsForMovie.forEach((r) => {
        csvContent += `${r.fullName},${r.nrPeople}\n`;
      });

      csvContent += `\n`;
    });

    const fileName = (
      selectedMovieIds.length > 0
        ? moviesToExport.map((m) => m.title).join("_")
        : "All_Reservations"
    ).replace(/\s+/g, "_");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${fileName}_rezervime.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    const moviesToExport =
      selectedMovieIds.length > 0
        ? movies.filter((m) => selectedMovieIds.includes(m._id))
        : movies;

    moviesToExport.forEach((movie, movieIndex) => {
      const reservationsForMovie = filteredReservations.filter(
        (r) => r.movie === movie._id
      );

      if (reservationsForMovie.length === 0) return;

      const totalPeople = reservationsForMovie.reduce(
        (acc, r) => acc + Number(r.nrPeople || 0),
        0
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(`Titulli: ${movie.title}`, 10, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Data: ${formatDate(movie.date)}`, 10, y);
      y += 8;
      doc.text(`Ora: ${movie.time || "-"}`, 10, y);
      y += 8;
      doc.text(`Rezervuar: ${totalPeople}`, 10, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.text("Emër mbiemër", 10, y);
      doc.text("Nr. Biletave", 80, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      reservationsForMovie.forEach((r) => {
        doc.text(r.fullName || "-", 10, y);
        doc.text(`${r.nrPeople}`, 80, y);
        y += 8;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 10;

      if (y > 270 && movieIndex < moviesToExport.length - 1) {
        doc.addPage();
        y = 20;
      }
    });

    const fileName = (
      selectedMovieIds.length > 0
        ? moviesToExport.map((m) => m.title).join("_")
        : "All_Reservations"
    ).replace(/\s+/g, "_");

    doc.save(`${fileName}_rezervime.pdf`);
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem("loggedUser_id");
    if (!loggedUser) {
      alert("Hyr per te pare rezervimet!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchMovies();
    }
  }, [navigate]);

  const columns = [
    { field: "fullName", header: "Emër mbiemër", size: 500 },
    { field: "email", header: "Email", size: 200 },
    { field: "nrPeople", header: "Nr. personave", size: 100 },
    {
      header: "Veprime",
      size: 150,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <button
          className="outside-delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedReservationId(row.original._id);
            setShowPopUp(true);
          }}
        >
          <i className="fa-solid fa-trash"></i> Fshi
        </button>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!selectedReservationId) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `https://teater-api.arkiva.gov.al/api/reservations/delete/${selectedReservationId}`
      );

      if (response.status === 200) {
        toast.success("Rezervimi u fshi me sukses!", {
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

      fetchReservations();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Gabim gjatë fshirjes së rezervimit",
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
      setShowPopUp(false);
      setSelectedReservationId(null);
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedMovieIds([]);
    fetchReservations([]);
  };

  const movieOptions = movies.map((movie) => ({
    value: movie._id,
    label: movie.title,
  }));

  return (
    <div className="content-page">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <PopUp
        open={showPopUp}
        setOpen={setShowPopUp}
        header="Konfirmo fshirjen"
        content="Jeni i sigurtë që doni të fshini këtë rezervim?"
        deleteFunction={handleDelete}
      />

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
            {selectedMovieIds.length > 0 && (
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
                  <i className="fa-solid fa-user"></i>
                  Titulli
                </label>
                <div className="filter-input">
                  <CustomSelect
                    options={movieOptions}
                    value={movieOptions.filter((option) =>
                      selectedMovieIds.includes(option.value)
                    )}
                    onChange={handleMovieChange}
                    placeholder="Zgjidh film"
                    isMulti={true}
                  />
                </div>
              </div>
            </div>

            <div className="filters-summary">
              <div className="active-filters">
                {selectedMovieIds.map((id) => {
                  const movie = movies.find((m) => m._id === id);
                  return (
                    <span key={id} className="filter-tag">
                      <i className="fa-solid fa-film"></i>
                      Filmi: {movie?.title}
                    </span>
                  );
                })}
              </div>
              <div className="results-count">
                {filteredReservations?.length || 0} rezervime të gjetura
              </div>
            </div>
          </div>
        </div>

        <div className="export-btn">
          <button onClick={exportCSV} className="csv">
            Export CSV
          </button>
          <button onClick={exportPDF} className="pdf">
            Export PDF
          </button>
        </div>

        {filteredReservations && (
          <Table columns={columns} data={filteredReservations} />
        )}
      </div>
    </div>
  );
};

export default Rezervime;
