import "../scss/components/Landing.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    user: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({
    name: "",
    user: "",
    email: "",
    password: "",
  });
  function handleClickForm() {
    props.toggleForm();
  }

  function handleChangeRegister(e) {
    const { name, value } = e.target;

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });

    let fieldError = "";
    if (name === "name") {
      if (!value || value.trim() === "") {
        fieldError = "";
      } else if (value.length < 3) {
        fieldError = "El nombre debe tener al menos 3 caracteres";
      }
    } else if (name === "user") {
      if (!value || value.trim() === "") {
        fieldError = "";
      } else if (value.length < 3) {
        fieldError = "El usuario debe tener al menos 3 caracteres";
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || value.trim() === "") {
        fieldError = "";
      } else if (!emailRegex.test(value)) {
        fieldError = "El email no tiene un formato válido";
      }
    } else if (name === "password") {
      if (!value || value.trim() === "") {
        fieldError = "";
      } else if (value.length < 6) {
        fieldError = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    // Actualizar el mensaje de error conforme el usuario va escribiendo
    setErrorMessage((prev) => ({
      ...prev,
      [name]: fieldError, // Solo actualizamos el campo que está siendo validado
    }));
  }

  function handleChangeField(field, value) {
    if (!value) return; //no hacer nada si el campo esta vacio (no hace peticiones al servidor)

    //queremos verificar antes de mandar el formulario a la bd, que el usuario y el email no existan:
    fetch(`http://localhost:5005/${field}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          setErrorMessage((prev) => ({
            ...prev,
            [field]: data.message,
          }));
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function handleClickRegister(e) {
    e.preventDefault();

    fetch("http://localhost:5005/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(registerForm),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            // Procesamos todos los errores
            const errors = errorData.errors;
            const newErrorMessages = {}; // Creamos un objeto para actualizar todo el estado

            errors.forEach((error) => {
              newErrorMessages[error.field] = error.message; // Agregamos cada error al campo correspondiente
            });

            // Actualizamos todo el estado de errorMessage de una vez
            setErrorMessage((prev) => ({
              ...prev,
              ...newErrorMessages, // Sobreescribimos solo los campos con errores
            }));

            throw new Error("Errores en los campos."); // Lanzamos un error genérico para detener el flujo
          });
        }
      })

      .then((data) => {
        if (data.success) {
          navigate("/main");
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }

  return (
    <section className="section-landing">
      {props.isLogin ? (
        <div className="container-login welcome">
          {/* <h1></h1>
          <p className="login-description">
            Crea cajas virtuales y agrega los objetos que desees, para que no
            pierdas nada de vista durante la mudanza. Regístrate o inicia sesión
            para comenzar a planificar tu mudanza de manera eficiente y sin
            complicaciones.
          </p> */}
        </div>
      ) : (
        <div className="container-login register">
          <h1></h1>
          {/* <p className="login-description">
            ...y disfruta de las ventajas de esta APP
          </p> */}
        </div>
      )}
      <div className="container-login">
        {props.isLogin ? (
          <div className="form-box">
            <h2>Iniciar Sesión</h2>
            <form id="loginForm">
              <div className="input-group">
                <label htmlFor="email" className="label">
                  Correo electrónico
                </label>
                <input
                  className="label"
                  type="email"
                  id="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password" className="label">
                  Contraseña
                </label>
                <input
                  className="label"
                  type="password"
                  id="password"
                  placeholder="Introduce tu contraseña"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Iniciar Sesión
              </button>
              <p className="switch-text">
                ¿Aún no estás registrado?{" "}
                <a href="#" onClick={handleClickForm}>
                  Regístrate aquí
                </a>
              </p>
            </form>
          </div>
        ) : (
          <div className="form-box">
            <h2>Regístrate</h2>
            <form id="registerForm">
              <div className="input-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="name"
                  placeholder="Introduce tu nombre"
                  required
                  onChange={handleChangeRegister}
                  value={registerForm.name}
                />
                {errorMessage.name ? (
                  <p className="error-message">{errorMessage.name}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="email-register">Correo electrónico</label>
                <input
                  type="email"
                  id="email-register"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  required
                  onChange={(e) => {
                    handleChangeRegister(e);
                    handleChangeField("email", e.target.value);
                  }}
                  value={registerForm.email}
                />
                {errorMessage.email ? (
                  <p className="error-message">{errorMessage.email}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="username">Usuario</label>
                <input
                  type="text"
                  id="username"
                  name="user"
                  placeholder="Elige un nombre de usuario"
                  required
                  onChange={(e) => {
                    handleChangeRegister(e);
                    handleChangeField("user", e.target.value);
                  }}
                  value={registerForm.user}
                />
                {errorMessage.user ? (
                  <p className="error-message">{errorMessage.user}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="password-register">Contraseña</label>
                <input
                  type="password"
                  id="password-register"
                  name="password"
                  placeholder="Introduce una contraseña"
                  required
                  onChange={handleChangeRegister}
                  value={registerForm.password}
                />
                {errorMessage.password ? (
                  <p className="error-message">{errorMessage.password}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <button
                type="submit"
                className="submit-btn"
                onClick={handleClickRegister}
              >
                Registrarse
              </button>
              <p className="switch-text">
                ¿Ya tienes una cuenta?{" "}
                <a href="#" onClick={handleClickForm}>
                  Inicia Sesión
                </a>
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
