import "../scss/components/Main.scss";
import IconAdd from "../images/icon+.png";
import Filter from "./Filter";
import ModalAddBox from "./ModalAddBox";
import ChicaCaja from "../images/chica-caja.jpg";

import { Link } from "react-router-dom";
import BoxList from "./BoxList";
import MobileMenuHeader from "./MobileMenuHeader";
import ModalRemoveBox from "./ModalRemoveBox";

function Main(props) {
  /*Cuando la usuaria haga click en añadir caja, muestra el pop up con el formulario para añadir*/
  function handleClick(event) {
    event.preventDefault();
    props.onClickModalAddBox();
  }

  return (
    <main>
      <section className="section">
        <Filter
          inputFilterBox={props.inputFilterBox}
          onChangeInput={props.onChangeInput}
          addedBox={props.addedBox} //cajas filtradas que pasamos por props desde app a main
          inputFilterObject={props.inputFilterObject}
          onChangeInputObject={props.onChangeInputObject}
        />

        <ul className="container-list-box">
          {props.addedBox.map((box) => (
            <BoxList
              addedBox={props.addedBox} //cajas filtradas que pasamos por props desde app a main
              key={box.id}
              box={box}
              onClickRemoveBox={props.onClickRemoveBox}
              modalRemoveBox={props.modalRemoveBox}
              questionRemove={props.questionRemove}
              onCloseModal={props.onCloseModal}
              boxToRemove={props.boxToRemove}
              onClickCloseMenu={props.onClickCloseMenu}
            />
          ))}

          <li className="container-box" onClick={handleClick}>
            <h3 className="container-box__tittle">Añadir caja</h3>
            <img
              className="icon-add"
              src={IconAdd}
              alt="imagen icono para añadir"
            />
          </li>
        </ul>
      </section>

      {props.modalAddBox && (
        <ModalAddBox
          onClickClose={props.onClickClose}
          inputModalAddBox={props.inputModalAddBox}
          onChangeInputModalAddBox={props.onChangeInputModalAddBox}
          onClickAddBox={props.onClickAddBox}
          messageAddBox={props.messageAddBox}
        />
      )}

      {props.modalRemoveBox && (
        <ModalRemoveBox
          onClickRemoveBox={props.onClickRemoveBox}
          onCloseModal={props.onCloseModal}
          box={props.boxToRemove}
        />
      )}

      {props.mobileMenuHeader && (
        <MobileMenuHeader
          onClickCloseMenu={props.onClickCloseMenu}
          onClickLogoutMobile={props.onClickLogoutMobile}
        />
      )}
    </main>
  );
}

export default Main;
