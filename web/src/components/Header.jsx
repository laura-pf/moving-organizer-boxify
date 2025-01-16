import "../scss/components/Header.scss";
import LogoBox from "../images/logo-boxify.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Header(props) {
  const navigate = useNavigate();
  function handleClickMenu(event) {
    event.preventDefault();
    props.toggleMenu();
  }

  function handleClick() {
    props.onClickCloseMenu();
  }

  useEffect(() => {
    // Comprobamos si hay un token en las cookies al cargar la página
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      props.setLogin(true); // Si hay token, el usuario está logueado
    } else {
      props.setLogin(false); // Si no hay token, el usuario no está logueado
    }
  }, []);

  function handleClickLogout() {
    fetch("https://boxify.onrender.com/logout", {
      method: "POST",
      credentials: "include", //envia las cookies en la solicitud
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cerrar sesión");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          props.setLogin(false);
          document.cookie = "token=; Max-Age=0";
          props.setIslogin(true);
          props.setModalAddBox(false);

          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error cerrando sesión:", error);
      });
  }

  return (
    <header className="header">
      <nav className="header__nav">
        <img className="img-link" src={LogoBox} alt="imagen logo de caja" />{" "}
        <ul className="header__nav-list">
          <Link to="/info">
            <li className="nav-list-item">| Sobre la APP |</li>
          </Link>
          <Link to="/contact">
            <li className="nav-list-item">| Contacto |</li>
          </Link>
          <li className="nav-list-item" onClick={handleClickLogout}>
            | Cerrar sesión |
          </li>
        </ul>
        <button className="menu-button" onClick={handleClickMenu}></button>
      </nav>
    </header>
  );
}

export default Header;
