import "../scss/components/ModalRemoveBox.scss";

function ModalRemoveBox(props) {
  function handleClickRemove() {
    props.onClickRemoveBox();
  }

  function handleClickCloseModal() {
    props.onCloseModal();
  }
  return (
    <section className="popup-add-box ">
      <div className="container-add-box remove-box">
        <h3 className="name-box question-remove">
          ¿Seguro que quieres eliminar la caja {props.box.tittle}?
        </h3>
        <p className="label removep">
          Esto eliminará también todo lo que contiene
        </p>
        <div className="buttons">
          <button
            className="button-add-box buttons__yesno"
            onClick={() => handleClickRemove()}
          >
            Si
          </button>

          <button
            className="button-add-box buttons__yesno-no"
            onClick={() => handleClickCloseModal()}
          >
            No
          </button>
        </div>
      </div>
    </section>
  );
}

export default ModalRemoveBox;
