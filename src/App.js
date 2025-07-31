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

function App() {
  const location = useLocation();
  const loggedUser = localStorage.getItem("loggedUser_id");
  const isManage = location.pathname.includes("menaxho");

  return (
    <>
      {loggedUser && isManage ? (
        <div className="layout">
          <Sidebar />
          <div className="content-page">
            <Routes>
              <Route path="/menaxho/dashboard" element={<div>Dashboard</div>} />
              <Route path="/menaxho/filma" element={<Filma />} />
              <Route path="/menaxho/filma/shto-film" element={<ShtoFilm />} />
              <Route path="/menaxho/rezervime" element={<Rezervime />} />
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
