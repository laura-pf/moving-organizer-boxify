import "../scss/components/Landing.scss";
import React, { useState } from "react";
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

  function handleChangeRegister(event) {
    const { name, value } = event.target;

    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  }

  function handleClickForm() {
    props.toggleForm();
  }

  function handleClickRegister(event) {
    event.preventDefault();

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
            setErrorMessage({
              [errorData.field]: errorData.message,
            });
            throw new Error(errorData.message);
          });
        }
        return response.json();
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
                {errorMessage.name && (
                  <p className="label">{errorMessage.name}</p>
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
                  onChange={handleChangeRegister}
                  value={registerForm.email}
                />
                {errorMessage.email && (
                  <p className="label">{errorMessage.email}</p>
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
                  onChange={handleChangeRegister}
                  value={registerForm.user}
                />
                {errorMessage.user && (
                  <p className="label">{errorMessage.user}</p>
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
                {errorMessage.password && (
                  <p className="label">{errorMessage.password}</p>
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
