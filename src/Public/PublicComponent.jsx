import "./publicComponent.css";
import Logo from "../Assets/Images/logo.jpg";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import axios from "axios";

const PublicComponent = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  // Form states
  const [movieId, setMovieId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nrPeople, setNrPeople] = useState("1");
  const [errors, setErrors] = useState({});

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/movies/pending"
      );
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gabim gjatë marrjes së filmave!",
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

  useEffect(() => {
    fetchMovies();
  }, []);

  // Validate form
  const isValid = () => {
    const newErrors = {};
    if (!movieId) newErrors.movieId = "Zgjidhni një event!";
    if (!fullName.trim())
      newErrors.fullName = "Emri i plotë është i detyrueshëm!";
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
        "http://localhost:5000/api/reservations/new",
        {
          fullName,
          email,
          nrPeople,
          movie: movieId,
        }
      );

      if (response.status === 200) {
        toast.success("Rezervimi u shtua me sukses!", { transition: Bounce });
        // Reset form
        setMovieId("");
        setFullName("");
        setEmail("");
        setNrPeople("1");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Ndodhi një gabim gjatë ruajtjes!",
        { transition: Bounce }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking">
      <div className="overlay"></div>
      <div className="booking-container">
        <div className="booking-form-container">
          <div className="booking-form">
            <div className="form-title">Rezervoni vendin tuaj</div>
            <div className="form-inputs">
              {/* Movie selection */}
              <div className="input-group">
                <div className="input-label">
                  Zgjidhni eventin që doni të ndiqni:
                </div>
                <div className="input-value">
                  <select
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                  >
                    <option value="">-- Zgjidh event --</option>
                    {movies.map((movie) => (
                      <option key={movie._id} value={movie._id}>
                        {movie.title} - {movie.date} - {movie.time}
                      </option>
                    ))}
                  </select>
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
                  <select
                    value={nrPeople}
                    onChange={(e) => setNrPeople(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.nrPeople && (
                  <div className="error-message">{errors.nrPeople}</div>
                )}
              </div>

              {/* Submit button */}
              <div className="send-btn">
                <button disabled={loading} onClick={addReservation}>
                  {loading ? "Duke dërguar..." : "Dërgo"}
                </button>
              </div>
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
