import { Link } from "react-router-dom";
import "../scss/components/MobileMenuHeader.scss";
import { useNavigate } from "react-router-dom";

function MobileMenuHeader(props) {
  const navigate = useNavigate();

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

    props.onClickLogoutMobile();
  }
  return (
    <ul className="mobile-menu">
      <Link onClick={handleClick} to="/info">
        <li className="nav-list-item">Sobre la APP</li>
      </Link>
      <Link onClick={handleClick} to="/contact">
        <li className="nav-list-item">Contacto </li>
      </Link>
      <li className="nav-list-item" onClick={handleClickLogout}>
        Cerrar sesión
      </li>
    </ul>
  );
}

export default MobileMenuHeader;
