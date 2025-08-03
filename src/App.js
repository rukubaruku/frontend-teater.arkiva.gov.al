import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import PublicComponent from "./Public/PublicComponent";
import Login from "./Admin/Login/Login";
import Sidebar from "./Admin/Sidebar/Sidebar";
import Filma from "./Admin/Filma/Filma";
import ShtoFilm from "./Admin/Filma/ShtoFilm";
import { ToastContainer } from "react-toastify";
import Rezervime from "./Admin/Rezervime/Rezervime";
import ShtoRezervim from "./Admin/Rezervime/ShtoRezervim";
import { useEffect, useState } from "react";
import Navbar from "./Admin/Navbar/Navbar";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Profili from "./Admin/Profili/Profili";
import EditFilm from "./Admin/Filma/EditFilm";

function App() {
  const location = useLocation();
  const loggedUser = localStorage.getItem("loggedUser_id");
  const isManage = location.pathname.includes("menaxho");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setShowSidebar(width > 992 && height > 650);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {loggedUser && isManage ? (
        <div className={`layout ${!showSidebar ? "navbar-visible" : ""}`}>
          {showSidebar && <Sidebar />}
          {!showSidebar && <Navbar />}
          <div className="content-page">
            <Routes>
              <Route path="/menaxho/dashboard" element={<Dashboard />} />
              <Route path="/menaxho/filma" element={<Filma />} />
              <Route path="/menaxho/filma/shto-film" element={<ShtoFilm />} />
              <Route path="/menaxho/filma/:id" element={<EditFilm />} />
              <Route path="/menaxho/rezervime" element={<Rezervime />} />
              <Route path="/menaxho/profili" element={<Profili />} />
              <Route
                path="/menaxho/rezervime/shto-rezervim"
                element={<ShtoRezervim />}
              />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<PublicComponent />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  );
}

export default App;
