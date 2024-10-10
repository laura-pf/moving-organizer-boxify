import { Link } from "react-router-dom";
import "../scss/components/Info.scss";
import MobileMenuHeader from "./MobileMenuHeader";

function Info(props) {
  function handleClick() {
    props.onClickCloseMenu();
  }

  return (
    <>
      <div className="container-link">
        <Link onClick={handleClick} className="container-link__link" to="/main">
          &lt; Volver
        </Link>
      </div>
      <div className="container">
        <div className="background"></div>
        <section className="info">
          <h2 className="info__tittle">SOBRE BOXIFY</h2>
          <p className="info__text">
            Sabemos lo estresante que puede ser una mudanza, y por eso hemos
            creado esta App Web para hacer todo el proceso mucho más fácil.{" "}
            <br />
            Con nuestra herramienta, podrás organizar tus cajas de manera
            sencilla:
          </p>

          <div>
            <p className="info__text">
              {" "}
              📦Crea tus propias cajas, ponles nombre y añade todos los objetos
              que quieras. <br />
            </p>
            <p className="info__text instruction">
              ✅A medida que vayas empacando, marca los objetos que ya están
              listos con un check. <br />
            </p>
            <p className="info__text instruction">
              🗑️Si cambias de idea, puedes eliminar fácilmente cualquier caja u
              objeto. <br />
            </p>
          </div>
          <p className="info__text">
            ¡Tu mudanza más organizada y sin complicaciones, en pocos clics!
          </p>
        </section>
      </div>
      {props.mobileMenuHeader && (
        <MobileMenuHeader onClickCloseMenu={props.onClickCloseMenu} />
      )}
    </>
  );
}

export default Info;
