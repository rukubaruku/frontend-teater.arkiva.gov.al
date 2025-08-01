import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./navbar.css";
import logo from "../../Assets/Images/SideBarLogo.png";
import user from "../../Assets/Images/user.webp";

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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [openDropdownMenu, setOpenDropdownMenu] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const [isShortScreen, setIsShortScreen] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsShortScreen(window.innerHeight < 690);
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  const redirect = (path) => {
    navigate(path);
    setOpenMenu(false);
  };

  const toggleDropdown = () => {
    setOpenDropdownMenu((prev) => !prev);
  };

  const handleLogOut = async () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleEditUser = () => {
    navigate("/profili");
    setOpenDropdownMenu(false);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setOpenMenu(false);
      setOpenDropdownMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="manage-navbar">
      <div className="logo-img">
        <img src={logo} alt="logo" />
      </div>

      <div className="nav-menus">
        <div className="user-profile" ref={profileRef}>
          <button onClick={toggleDropdown}>
            <img src={user} alt="user" />
            <i className="fa-solid fa-user user-icon"></i>
          </button>
          {openDropdownMenu && (
            <div className="profile-menu">
              <ul>
                <li onClick={handleEditUser}>
                  <i className="fa-solid fa-user"></i> Profile
                </li>
                <li onClick={handleLogOut}>
                  <i className="fa-solid fa-right-from-bracket"></i> Log out
                </li>
              </ul>
            </div>
          )}
        </div>

        <div
          className={`navbar-menu ${openMenu ? "expanded" : "collapsed"}`}
          ref={menuRef}
        >
          <div className="burger-menu" onClick={() => setOpenMenu(!openMenu)}>
            {openMenu ? (
              <i className="fa-solid fa-x"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </div>

          <div
            className={`menu-tabs ${openMenu ? "expanded" : "collapsed"} ${
              isShortScreen ? "scrollable-menu" : ""
            }`}
          >
            {menu.map((item, index) => {
              const isActive = item.activeMatch?.some((route) =>
                location.pathname.startsWith(route.replace(/:\w+/g, ""))
              );

              return (
                <div
                  key={index}
                  className={`menu-tab ${isActive ? "active" : ""}`}
                  onClick={() => redirect(item.link)}
                  title={item.title}
                >
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
