//imports
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
// import cookieParser from "cookie-parser";
//crear el servidor
const server = express();

//configurar el servidor
server.use(express.json({ limit: "25mb" }));
server.use(cors());
require("dotenv").config(); // permitimos el uso de variables de entorno, instalar libreria
// server.use(cookieParser())

//conexión a la bases de datos
async function getDBConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Boxify",
  });
  connection.connect();
  return connection;
}

//iniciar el servidor desde un puerto
const port = 5005;
server.listen(port, () => {
  console.log(`Server is listening in http://localhost:${port}`);
});

//ENDPOINTS

//GET: CAJAS

server.get("/boxs", async (req, res) => {
  try {
    const connection = await getDBConnection();
    const sqlQuery = "SELECT * FROM box";
    const [boxResult] = await connection.query(sqlQuery);

    res.status(200).json({
      status: true,
      result: boxResult,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "No se pueden mostrar las cajas en este momento",
    });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

//POST: CAJAS

server.post("/add-box", async (req, res) => {
  /*
        - recoger las cajas que me envía frontend (body params)
        - abro conexión
        - consulta CREATE (INSERT INTO)
        - cierro conexión
        - respondo
    */
});

//REGISTRO:

/*
    - recoger los datos: username, email y password (body params)
    - conectar a DB
    - encriptar la contraseña
    - guardarlos en la base de datos
    - cerrar la conexión con DB
    - responder con un ok

*/

server.post("/register", async (req, res) => {
  const { name, user, email, password } = req.body;

  //validamos y aseguramos que name no sea muy corto
  if (name.length < 3) {
    res.status(400).json({
      code: "NAME_TOO_SHORT",
      message: "name debe tener al menos 3 caracteres",
    });
  }
  //validamos y nos aseguramos que user sea un string y no sea muy corto
  if (typeof user !== "string") {
    res.status(400).json({
      code: "INVALID_USERNAME",
      message: "User debe ser un string",
    });
  } else if (user.length < 3) {
    res.status(400).json({
      code: "USER_TOO_SHORT",
      message: "User debe tener al menos 3 caracteres",
    });
  }

  //Validamos email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      code: "INVALID_EMAIL",
      message: "El email no tiene un formato válido.",
    });
  }

  //Validamos que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    return res.status(400).json({
      code: "PASSWORD_TOO_SHORT",
      message: "La contraseña debe tener al menos 6 caracteres.",
    });
  }

  const connection = await getDBConnection();

  try {
    // Comprobar si el nombre de usuario ya existe
    const userQuery = "SELECT * FROM users WHERE user= ?";
    const [userExists] = await connection.query(userQuery, [user]);

    if (userExists.length > 0) {
      return res.status(400).json({
        code: "USERNAME_EXISTS",
        message: "El nombre de usuario ya está en uso.",
      });
    }

    // Comprobar si el email ya existe
    const emailQuery = "SELECT * FROM users WHERE email = ?";
    const [emailExists] = await connection.query(emailQuery, [email]);

    if (emailExists.length > 0) {
      return res.status(400).json({
        code: "EMAIL_EXISTS",
        message: "El email ya está registrado",
      });
    }

    // Encriptar la contraseña
    const passwordHashed = await bcrypt.hash(password, 10);

    // Insertar en la base de datos
    const query =
      "INSERT INTO users (name, user, email, password) VALUES (?, ?, ?, ?)";
    const [newUserResult] = await connection.query(query, [
      name,
      user,
      email,
      passwordHashed,
    ]);

    res.status(201).json({
      success: true,
      message: `Usuario registrado con éxito. ID: ${newUserResult.insertId}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar el usuario. Inténtalo de nuevo.",
    });
  } finally {
    // Cerrar la conexión a la base de datos
    connection.end();
  }
});

//LOGIN
/*
 - Recoge el email y la contraseña enviados por front
- Si el email existe en la base de datos
    - Verifico que la contraseña esté asociada a ese email
    - Si la contraseña es correcta,
        generar el token
        enviar el token a frontend
    Si no, envia un error de autenticación
*/

server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const connection = await getDBConnection();

  try {
    const emailQuery = "SELECT * FROM users WHERE email = ?";
    const [userResult] = await connection.query(emailQuery, [email]);

    //si el usuario con el email existe - compara la contraseña que ha puesto con la que hay en la bd
    if (userResult.length > 0) {
      const isSamePassword = await bcrypt.compare(
        password,
        userResult[0].password
      );
      //la contraseña es correcta
      if (isSamePassword) {
        //generar token con JWT
        //guardar los datos que quiero almacenar en el token
        const infoToken = {
          email: userResult[0].email,
          name: userResult[0].name,
          id: userResult[0].id,
        };
        //generar token
        const token = jwt.sign(infoToken, process.env.DB_PASSWORD, {
          expiresIn: "1h",
        });
        res.status(200).json({
          success: true,
          token: token,
        });
        //guardamos el token en las cookies.
        // res.cookie("access_token", token, {
        //   httpOnly: true, // la cookie solo se puede acceder en el servidor
        //   secure: true,
        // })
      } else {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado. Contraseña incorrecta",
        });
      }
      //si el usuario no se encuentra
    } else {
      res.status(403).json({
        success: false,
        message: "Usuario no registrado. No se encuentra el email",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión. Inténtalo de nuevo",
    });
  } finally {
    connection.end();
  }
});

//AUTORIZACION
/*
 - Autorizar:
        - recoger el token (header params)
        - validar el token con la clave secreta
        - guardar la información del estudiante que viene en el token
*/

async function authorize(req, res, next) {
  const tokenBearer = req.headers.authorization; //recojo token que me manda front

  if (!tokenBearer) {
    return res.status(401).json({
      success: false,
      message: "Error en autenticación",
    });
  }

  try {
    const token = tokenBearer.split(" ")[1]; // dividimos el token (string) en un array y extraemos la parte que necesitamos
    const tokenInfo = jwt.verify(token, process.env.DB_PASSWORD); // Verificamos el token con la clave

    const connection = await getDBConnection();
    const query = "SELECT * FROM users WHERE email = ?";
    const [emailResult] = await connection.query(query, [tokenInfo.email]);

    if (emailResult.length === 0) {
      //si el email no esta en la base de datos:
      return res.status(401).json({
        success: false,
        message: "email no registrado",
      });
    }

    //el usuario existe, agregar la informacion del usuario a req para usarla en la siguiente funcion

    req.user = emailResult[0];
    next();
  } catch (error) {
    //error de token invalido o expirado
    return res.status(401).json({
      success: false,
      message: "Autenticación fallida",
    });
  } finally {
    connection.end();
  }
}

server.get("/profileUser", authorize, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

//ENDPOINT AÑADIR CAJAS (SEGUN EL LOGIN DE USUARIO)
