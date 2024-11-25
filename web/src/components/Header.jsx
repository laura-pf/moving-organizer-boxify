import "../scss/components/Header.scss";
import LogoBox from "../images/logo-boxify.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header(props) {
  const navigate = useNavigate();
  function handleClickMenu(event) {
    event.preventDefault();
    props.toggleMenu();
  }

  function handleClick() {
    props.onClickCloseMenu();
  }

  function handleClickLogout() {
    fetch("http://localhost:5005/logout", {
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
          navigate("/");
        }
      });
  }

  return (
    <header className="header">
      <nav className="header__nav">
        <Link onClick={handleClick} className="header__nav-link" to="/">
          {" "}
          <img
            className="img-link"
            src={LogoBox}
            alt="imagen logo de caja"
          />{" "}
        </Link>

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
