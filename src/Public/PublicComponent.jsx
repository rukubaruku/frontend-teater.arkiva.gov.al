import "./publicComponent.css";
import Logo from "../Assets/Images/logo.jpg";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import axios from "axios";
import CustomSelect from "../CustomSelect";

const PublicComponent = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const [movieId, setMovieId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nrPeople, setNrPeople] = useState("");
  const [errors, setErrors] = useState({});

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://teater-api.arkiva.gov.al/api/movies/pending"
      );
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const isValid = () => {
    const newErrors = {};
    if (!movieId) newErrors.movieId = "Zgjidhni një event!";
    if (!fullName.trim())
      newErrors.fullName = "Emri dhe mbiemri janë të detyrueshëm!";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Vendosni një email të vlefshëm!";
    if (!nrPeople || parseInt(nrPeople) <= 0)
      newErrors.nrPeople = "Zgjidhni numrin e biletave!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        await axios.post("https://teater-api.arkiva.gov.al/submit", {
          film: movies.find((m) => m._id === movieId)?.title || "Event",
          name: fullName,
          email,
          persona: nrPeople,
        });

        toast.success("Rezervimi u shtua dhe emaili u dërgua me sukses!", {
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
        setNrPeople("1");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Ndodhi një gabim gjatë ruajtjes ose dërgimit të emailit!",
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

  const movieOptions = movies.map((movie) => ({
    value: movie._id,
    label: `${movie.title} - ${formatDate(movie.date)} - ${movie.time}`,
  }));

  const ticketOptions = [1, 2, 3, 4, 5].map((n) => ({
    value: n.toString(),
    label: n.toString(),
  }));

  return (
    <div className="booking">
      <div className="overlay"></div>
      <div className="booking-container">
        <div className="booking-form-container">
          <div className="booking-form">
            <div className="form-title">Rezervoni vendin tuaj</div>
            <div className="form-inputs">
              <div className="input-group">
                <div className="input-label">
                  Zgjidhni eventin që doni të ndiqni:
                </div>
                <div className="input-value">
                  <CustomSelect
                    options={movieOptions}
                    value={
                      movieOptions.find((opt) => opt.value === movieId) || null
                    }
                    onChange={(selected) =>
                      setMovieId(selected ? selected.value : "")
                    }
                    placeholder="-- Zgjidhni eventin --"
                  />
                </div>
                {errors.movieId && (
                  <div className="error-message">{errors.movieId}</div>
                )}
              </div>

              {/* Full name */}
              <div className="input-group">
                <div className="input-label">Emër Mbiemër:</div>
                <div className="input-value">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Emër Mbiemër"
                  />
                </div>
                {errors.fullName && (
                  <div className="error-message">{errors.fullName}</div>
                )}
              </div>

              {/* Email */}
              <div className="input-group">
                <div className="input-label">Email:</div>
                <div className="input-value">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              {/* Tickets */}
              <div className="input-group">
                <div className="input-label">Numri i biletave:</div>
                <div className="input-value">
                  <CustomSelect
                    options={ticketOptions}
                    value={
                      ticketOptions.find((opt) => opt.value === nrPeople) ||
                      null
                    }
                    onChange={(selected) =>
                      setNrPeople(selected ? selected.value : "1")
                    }
                    placeholder="-- Zgjidhni nr. e biletave --"
                  />
                </div>
                {errors.nrPeople && (
                  <div className="error-message">{errors.nrPeople}</div>
                )}
              </div>
            </div>
            {/* Submit button */}
            <div className="send-btn">
              <button disabled={loading} onClick={addReservation}>
                {loading ? "Duke dërguar..." : "Dërgo"}
              </button>
            </div>
          </div>
        </div>

        <div className="description">
          <div className="description-image">
            <img src={Logo} alt="dpa logo" />
          </div>
          <div className="description-title">Teatri / Kinemaja verore</div>
          <div className="description-content">
            <p>
              Pas një sezoni të parë të suksesshëm dhe të ngrohtë, Kinemaja
              Verore e Drejtorisë së Përgjithshme të Arkivave (DPA) rikthehet
              për një sezon të dytë plot buzëqeshje dhe kujtime!
            </p>
            <p>
              Në bashkëpunim me Arkivin Qendror të Filmit, këtë verë sjellim një
              cikël të dedikuar komedive shqiptare – filmave që na kanë bërë të
              qeshim, të mendojmë dhe që vazhdojnë të na shoqërojnë brez pas
              brezi.
            </p>
            <p>
              Nga batutat legjendare te situatat plot humor të hollë, këto filma
              janë pjesë e një trashëgimie kinematografike që mbart jo vetëm të
              qeshura, por edhe reflektime të kohës ku janë krijuar.
            </p>
            <p>
              Kinemaja Verore e DPA-së mbetet një hapësirë e gjallë kulturore,
              me 140 ulëse nën qiellin e hapur, që ofron një mënyrë të veçantë
              për të përjetuar filmin si bashkëbisedim mes brezave.
            </p>
            <p>
              Publiku është i ftuar të rizbulojë vlerat e humorit shqiptar, në
              një mjedis miqësor që ndërthur edukimin me zbavitjen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicComponent;
