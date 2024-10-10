import "../scss/components/ModalAddBox.scss";

function ModalAddBox(props) {
  function handleClose(event) {
    event.preventDefault();
    props.onClickClose();
  }

  function handleInput(event) {
    const valueInputModalAddBox = event.target.value;
    props.onChangeInputModalAddBox(valueInputModalAddBox);
  }

  function handleAddBox(event) {
    event.preventDefault();
    props.onClickAddBox();
  }
  return (
    <section className="popup-add-box">
      <div className="container-add-box">
        <span className="close" onClick={handleClose}>
          X
        </span>
        <form className="add-box" action="">
          <label htmlFor="modal" className="name-box">
            Nombre de la caja:
          </label>
          <div className="input-button">
            <input
              id="modal"
              className="input-add-box"
              type="text"
              onChange={handleInput}
            />
            <button className="button-add-box" onClick={handleAddBox}>
              Añadir
            </button>
          </div>
          <h3 className="label message">{props.messageAddBox}</h3>
        </form>
      </div>
    </section>
  );
}

export default ModalAddBox;
