import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../Assets/Images/SideBarLogo.png";
import "./sidebar.css";
import axios from "axios";

const Sidebar = () => {
  const [sidebarMode, setSidebarMode] = useState("locked-open");
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menu = [
    {
      title: "Dashboard",
      name: "Dashboard",
      link: "/menaxho/dashboard",
      icon: "fa-solid fa-house",
      activeMatch: ["/menaxho/dashboard"],
    },

    {
      title: "Filma",
      name: "Filma",
      link: "/menaxho/filma",
      icon: "fa-solid fa-film",
      activeMatch: ["/menaxho/filma", "/menaxho/filma/shto-film"],
    },
    {
      title: "Rezervime",
      name: "Rezervime",
      link: "/menaxho/rezervime",
      icon: "fa-solid fa-calendar-check",
      activeMatch: ["/menaxho/rezervime"],
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width > 1180) {
        setSidebarMode("locked-open");
        setIsOpen(true);
      } else if (width > 880) {
        setSidebarMode("toggleable");
        setIsOpen(false);
      } else {
        setSidebarMode("mobile");
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSidebar = () => {
    if (sidebarMode === "toggleable" || sidebarMode === "locked-open") {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <aside
        className={`sidebar ${isOpen ? "open" : "collapsed"} ${
          isMobileMenuOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-content">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="sidebar-logo" />
          </div>

          <button className="arrow-btn" onClick={toggleSidebar}>
            <i
              className={`fa-solid ${
                isOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </button>

          <div className="sidebar-menu">
            <div className="sidebar-buttons">
              <div className="sidebar-subtitle">Menu</div>

              {menu.map((item, index) => {
                const isActive = item.activeMatch?.some((route) =>
                  location.pathname.startsWith(route.replace(/:\w+/g, ""))
                );

                return (
                  <button
                    key={index}
                    onClick={() => navigate(item.link)}
                    title={!isOpen ? item.title : ""}
                    className={`sidebar-nav-button ${isActive ? "active" : ""}`}
                  >
                    <i className={item.icon}></i>
                    {isOpen && <span>{item.title}</span>}
                  </button>
                );
              })}
            </div>
            <div className="sidebar-footer">
              <div className="sidebar-subtitle">Settings</div>
              <div className="sidebar-footer-buttons">
                <button
                  onClick={() => navigate("/profilo")}
                  title={!isOpen ? "Settings" : ""}
                  className={`sidebar-nav-button ${
                    location.pathname.includes("/profilo") ? "active" : ""
                  }`}
                >
                  <i className="fa-solid fa-gear" />
                  {isOpen && <span>Profile</span>}
                </button>

                <button
                  onClick={handleLogout}
                  title={!isOpen ? "Logout" : ""}
                  className="footer-icon-button"
                >
                  <i className="fa-solid fa-right-from-bracket" />
                  {isOpen && <span>Log out</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
