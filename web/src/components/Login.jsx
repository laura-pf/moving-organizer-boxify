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
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [errorLogin, setErrorLogin] = useState({
    email: "",
    password: "",
  });

  function handleClickForm() {
    props.toggleForm();

    //objeto para actualizar mensajes de error

    const emptyErrorMessage = {};

    //iteramos en cada campo los mensajes de error: si hay mensaje de error y el campo esta vacio, limpiar mensaje de error, si no, mantener el mensaje de error.

    for (const field in errorMessage) {
      if (errorMessage[field] && registerForm[field] === "") {
        emptyErrorMessage[field] = "";
      } else {
        emptyErrorMessage[field] = errorMessage[field];
      }
    }

    setErrorMessage(emptyErrorMessage);
    setErrorLogin({
      email: "",
      password: "",
    });
  }

  function handleChangeLogin(e) {
    const { name, value } = e.target;

    setLoginForm({
      ...loginForm,
      [name]: value,
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let updateError = "";

    if (name === "email") {
      if (value.trim() === "") {
        updateError = "";
      } else if (!emailRegex.test(value)) {
        updateError = "El email no tiene un formato valido";
      } else {
        updateError = "";
      }
    }

    setErrorLogin({
      ...errorLogin,
      [name]: updateError,
    });
  }

  //habria que hacer otra funcion manejadora para comprobar el email que ingresa esta registrado o no, yo lo pondria dentro de un eventoclick en iniciar sesion. (email no registrado y contraseña incorrecta)

  function handleClickLogin(e) {
    e.preventDefault();

    const errors = { email: "", password: "" };

    if (!loginForm.email.trim()) {
      errors.email = "El email es obligatorio";
    }
    if (!loginForm.password.trim()) {
      errors.password = "La contraseña es obligatoria";
    }

    setErrorLogin(errors);

    fetch("http://localhost:5005/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginForm),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const serverErrors = { email: "", password: "" };

            if (errorData.message.includes("email") && loginForm.email) {
              serverErrors.email = "El email no está registrado";
              serverErrors.password = "";
            }

            if (errorData.message.includes("contraseña")) {
              serverErrors.password = "Contraseña incorrecta";
            }

            setErrorLogin({
              email: serverErrors.email || errors.email,
              password: serverErrors.password || errors.password,
            });
            throw new Error("Errores en los campos.");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          props.setLogin(true);
          navigate("/main"); // Redirige al usuario
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
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

    fetch("https://boxify.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(registerForm),
      credentials: "include",
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
        return response.json();
      })

      .then((data) => {
        if (data.success) {
          props.setLogin(true);
          navigate("/main");
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }

  return (
    <section className="section-landing">
      <div className="container-login welcome"></div>

      <div className="container-login">
        {props.isLogin ? (
          <div className="form-box">
            <h2>Iniciar Sesión</h2>
            <form id="loginForm">
              <div className="input-group">
                <label
                  htmlFor="email"
                  className={errorLogin.email ? "label-error" : ""}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="ejemplo@correo.com"
                  name="email"
                  onChange={handleChangeLogin}
                  value={loginForm.email}
                  required
                  autoComplete="email"
                  className={errorLogin.email ? "input-error" : ""}
                />
                {errorLogin.email ? (
                  <p className="error-message">{errorLogin.email}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label
                  htmlFor="password"
                  className={errorLogin.password ? "label-error" : ""}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Introduce tu contraseña"
                  name="password"
                  value={loginForm.password}
                  onChange={handleChangeLogin}
                  className={errorLogin.password ? "input-error" : ""}
                  required
                />{" "}
                {errorLogin.password ? (
                  <p className="error-message">{errorLogin.password}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>

              <button
                type="submit"
                className="submit-btn"
                onClick={handleClickLogin}
              >
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
                <label
                  htmlFor="nombre"
                  className={errorMessage.name ? "label-error" : ""}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="name"
                  placeholder="Introduce tu nombre"
                  required
                  onChange={handleChangeRegister}
                  value={registerForm.name}
                  autoComplete="name"
                  className={errorMessage.name ? "input-error" : ""}
                />
                {errorMessage.name ? (
                  <p className="error-message">{errorMessage.name}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label
                  htmlFor="email-register"
                  className={errorMessage.email ? "label-error" : ""}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email-register"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  required
                  autoComplete="email"
                  onChange={(e) => {
                    handleChangeRegister(e);
                    handleChangeField("email", e.target.value);
                  }}
                  value={registerForm.email}
                  className={errorMessage.email ? "input-error" : ""}
                />
                {errorMessage.email ? (
                  <p className="error-message">{errorMessage.email}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label
                  htmlFor="username"
                  className={errorMessage.user ? "label-error" : ""}
                >
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="user"
                  placeholder="Elige un nombre de usuario"
                  required
                  autoComplete="user"
                  onChange={(e) => {
                    handleChangeRegister(e);
                    handleChangeField("user", e.target.value);
                  }}
                  value={registerForm.user}
                  className={errorMessage.user ? "input-error" : ""}
                />
                {errorMessage.user ? (
                  <p className="error-message">{errorMessage.user}</p>
                ) : (
                  <p className="error-message">&nbsp;</p>
                )}
              </div>
              <div className="input-group">
                <label
                  htmlFor="password-register"
                  className={errorMessage.password ? "label-error" : ""}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password-register"
                  name="password"
                  placeholder="Introduce una contraseña"
                  required
                  onChange={handleChangeRegister}
                  value={registerForm.password}
                  className={errorMessage.password ? "input-error" : ""}
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
