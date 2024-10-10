import { Link } from "react-router-dom";
import "../scss/components/MobileMenuHeader.scss";

function MobileMenuHeader(props) {
  function handleClick() {
    props.onClickCloseMenu();
  }
  return (
    <ul className="mobile-menu">
      <Link onClick={handleClick} to="/info">
        <li className="nav-list-item">Sobre la APP</li>
      </Link>
      <Link onClick={handleClick} to="/contact">
        <li className="nav-list-item">Contacto </li>
      </Link>
      <li className="nav-list-item">Cerrar sesión</li>
    </ul>
  );
}

export default MobileMenuHeader;
