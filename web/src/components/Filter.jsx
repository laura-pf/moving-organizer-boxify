function Filter(props) {
  function handleChange(event) {
    props.onChangeInput(event.target.value);
  }
  function handleChangeObject(event) {
    props.onChangeInputObject(event.target.value);
  }

  return (
    <form className="filter">
      <div className="filter__container">
        <label htmlFor="box" className="label filters">
          Busca alguna de tus cajas:
        </label>
        <input
          id="box"
          value={props.inputFilterBox}
          className="input"
          type="text"
          onChange={handleChange}
        />
        <label htmlFor="object" className="label filters ">
          Busca cosas dentro de tus cajas:
        </label>
        <input
          id="object"
          value={props.inputFilterObject}
          className="input"
          type="text"
          onChange={handleChangeObject}
        />
      </div>
    </form>
  );
}

export default Filter;
