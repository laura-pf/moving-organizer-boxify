import { Link } from "react-router-dom";
import "../scss/components/BoxList.scss";
import imageList from "../images/lista.png";
import LogoBox from "../images/caja-png.png";

function BoxList(props) {
  function handleClickRemove() {
    props.questionRemove(props.box);
  }

  function handleClick() {
    props.onClickCloseMenu();
  }
  return (
    <>
      <li className="container-box box">
        <span className="remove" onClick={() => handleClickRemove()}>
          X
        </span>
        <Link
          onClick={handleClick}
          className="container-box__link"
          to={`/box/${props.box.id}`}
        >
          <h3 className="container-box__tittle">{props.box.tittle}</h3>
          <img
            className="box-image image-list"
            src={LogoBox}
            alt="imagen de caja de cartón"
          />{" "}
          <span className="item-list label">
            <img
              className="item-list__image"
              src={imageList}
              alt="bloc de notas"
            />
            : {props.box.objects.length}
          </span>
        </Link>
      </li>
    </>
  );
}

export default BoxList;
