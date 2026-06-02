// React
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

// Components
import Login from "./Login";

import { useAuth } from "../firebase/AuthContext";
import { useCart } from "./Loja/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/FireStore";

// Styles
import "../styles/Menu.scss";

// Imagens
import logo from "../assets/logo-dourado.png";

const Menu = () => {
  // States
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [openLogin, setOpenLogin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loadingAuth } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Detecta mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Efeito ao rolar página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Busca nome do usuário
  useEffect(() => {
    setUserName("");

    const fetchUserName = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUserName(snap.data().nome || "");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserName();
  }, [user]);

  // Logout
  const handleLogout = async () => {
    await logout();

    setUserName("");
    setOpenDropdown(false);
    setOpenMobile(false);

    navigate("/");
  };

  return (
    <>
      <section
        className={`menu ${scrolled ? "scrolled" : ""}`}
      >
        <div className="menu-container container">
          {/* Logo */}
          <div
            className="logo"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Fight4Life" />
          </div>

          {/* Botão Mobile */}
          {isMobile && (
            <div
              className="menu-mobile-btn"
              onClick={() =>
                setOpenMobile(!openMobile)
              }
            >
              ☰
            </div>
          )}

          {/* Navegação */}
          <nav className={openMobile ? "open" : ""}>
            <ul className="flex-center gap-lg">
              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/" end>
                  HOME
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/quemsomos">
                  QUEM SOMOS
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/planos">
                  PLANOS
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/contato">
                  CONTATO
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/loja">
                  LOJA
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink
                  to="/carrinho"
                  className="cart-link"
                >
                  CARRINHO
                  {cartItems.length > 0 &&
                    ` (${cartItems.length})`}
                </NavLink>
              </li>

              <li
                onClick={() => setOpenMobile(false)}
              >
                <NavLink to="/campeonatos">
                  CAMPEONATOS
                </NavLink>
              </li>

              {/* CTA */}
              <li className="btn-menu">
                <a
                  href="https://wa.me/5511989226951"
                  target="_blank"
                  rel="noreferrer"
                >
                  AULA GRÁTIS
                </a>
              </li>

              {/* Usuário */}
              {loadingAuth ? (
                <li>
                  <span>...</span>
                </li>
              ) : user ? (
                <li
                  className={`user-menu ${isMobile ? "mobile" : ""
                    }`}
                  ref={dropdownRef}
                >
                  <span
                    onClick={() =>
                      setOpenDropdown(
                        !openDropdown
                      )
                    }
                  >
                    {userName ||
                      user.displayName ||
                      user.email.split("@")[0]}
                  </span>

                  {openDropdown && (
                    <div
                      className={`dropdown ${isMobile
                          ? "mobile"
                          : ""
                        }`}
                    >
                      <p
                        onClick={() => {
                          setOpenDropdown(
                            false
                          );
                          setOpenMobile(
                            false
                          );
                          navigate(
                            "/configUser"
                          );
                        }}
                      >
                        Configurações
                      </p>

                      <p
                        onClick={handleLogout}
                      >
                        Sair
                      </p>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <span
                    onClick={() => {
                      setOpenLogin(true);
                      setOpenMobile(false);
                    }}
                  >
                    LOGIN
                  </span>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </section>

      <Login
        open={openLogin}
        onClose={() =>
          setOpenLogin(false)
        }
      />
    </>
  );
};

export default Menu;