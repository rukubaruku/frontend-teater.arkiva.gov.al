import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import CountUp from "react-countup";
import CustomBarChart from "./PerformanceChart";
import { Bounce, toast } from "react-toastify";
import { LineChart } from "@mui/x-charts/LineChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [moviesNr, setMoviesNr] = useState(0);
  const [reservationsNr, setReservationsNr] = useState(0);
  const [shiNePlazhReservations, setShiNePlazhReservations] = useState(0);
  const loggedUser = localStorage.getItem("loggedUser_id");
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://teater-api.arkiva.gov.al/api/movies/dashboard"
        );
        if (response.status === 200) {
          setMoviesNr(response.data.count);
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

    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://teater-api.arkiva.gov.al/api/reservations/dashboard"
        );
        if (response.status === 200) {
          setReservationsNr(response.data.count);
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

    const fetchShiNePlazhReservations = async () => {
      try {
        const response = await axios.get(
          "https://teater-api.arkiva.gov.al/api/reservations/countByMovie",
          { params: { title: "Shi në plazh" } }
        );
        if (
          response.status === 200 &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setShiNePlazhReservations(response.data.data[0].count);
        } else {
          setShiNePlazhReservations(0);
        }
      } catch (error) {
        console.error("Error fetching reservations for Shi në plazh", error);
        setShiNePlazhReservations(0);
      } finally {
        setDataReady(true);
      }
    };

    if (!loggedUser) {
      alert("Hyr per te pare filmat!");
      navigate("/login");
      localStorage.clear();
    } else {
      fetchMovies();
      fetchReservations();
      fetchShiNePlazhReservations();
    }
  }, [navigate, loggedUser]);

  if (!loggedUser) {
    return null;
  }

  const widgets = [
    {
      icons: "fa-solid fa-clapperboard",
      stats: moviesNr,
      title: "Filma",
      className: "movies",
      navigate: "/menaxho/filma",
    },
    {
      icons: "fa-solid fa-square-check",
      stats: reservationsNr,
      title: "Rezervime",
      className: "reservations",
      navigate: "/menaxho/rezervime",
    },
  ];

  const moviesData = [
    { title: "Edhe kështu edhe ashtu", reservations: 14 },
    { title: "Zonja nga qyteti", reservations: 26 },
    { title: "Dy herë mat", reservations: 18 },
    { title: "Zëvendësi i grave", reservations: 12 },
    { title: "Shoqja nga fshati", reservations: 20 },
    { title: "Përrallë nga e kaluara", reservations: 14 },
    { title: "Kapedani", reservations: 19 },
    { title: "Pallati 176", reservations: 25 },
    { title: "Shi në plazh", reservations: shiNePlazhReservations || 0 },
  ];

  return (
    <div className="dashboard">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="dashboard-widgets">
        {widgets.map((widget, index) => (
          <div
            className="widget"
            key={index}
            onClick={() => navigate(widget.navigate)}
          >
            <div className={`widget-icon ${widget.className}`}>
              <i className={widget.icons}></i>
            </div>
            <div className="dashboard-info">
              <CountUp start={0} end={widget.stats} delay={8000}>
                {({ countUpRef }) => (
                  <div>
                    <span ref={countUpRef} />
                  </div>
                )}
              </CountUp>
              <div className="widget-title">{widget.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        {dataReady && (
          <div className="line-chart">
            {dataReady && (
              <div className="line-chart">
                <CustomBarChart
                  data={moviesData}
                  xKey="reservations"
                  yKey="title"
                  xLabel="Nr. Rezervimeve"
                  yLabel="Filmat"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
