import "../scss/components/Header.scss";
import LogoBox from "../images/logo-boxify.png";
import { Link } from "react-router-dom";

function Header(props) {
  function handleClickMenu(event) {
    event.preventDefault();
    props.toggleMenu();
  }

  function handleClick() {
    props.onClickCloseMenu();
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
          <li className="nav-list-item">| Cerrar sesión |</li>
        </ul>

        <button className="menu-button" onClick={handleClickMenu}></button>
      </nav>
    </header>
  );
}

export default Header;
