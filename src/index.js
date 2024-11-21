//imports
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
const cookieParser = require("cookie-parser");
//crear el servidor
const server = express();

//configurar el servidor
server.use(express.json({ limit: "25mb" }));
server.use(cors());
require("dotenv").config(); // permitimos el uso de variables de entorno, instalar libreria
server.use(cookieParser());

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
  const connection = await getDBConnection();
  try {
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
  //recogemos los datos de registro de front que se van a almacenar en la BD
  const { name, user, email, password } = req.body;
  const errors = []; //Array para acumular errores

  //validamos y aseguramos que name no sea muy corto
  if (name.length < 3) {
    errors.push({
      field: "name",
      message: "el nombre debe tener al menos 3 caracteres",
    });
  }
  if (!name || name.trim() === " ") {
    errors.push({ field: "name", message: "El nombre es obligatorio" });
  }
  //validamos y nos aseguramos que user sea un string y no sea muy corto
  if (typeof user !== "string") {
    errors.push({ field: "user", message: "User debe ser un string" });
  } else if (user.length < 3) {
    errors.push({
      field: "user",
      message: "El usuario debe tener al menos 3 caracteres",
    });
  }
  if (!user || user.trim() === "") {
    errors.push({ field: "user", message: "El usuario es obligatorio" });
  }

  //Validamos email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({
      field: "email",
      message: "El email no tiene un formato válido.",
    });
  }
  if (!email || email.trim() === "") {
    errors.push({ field: "email", message: "El email es obligatorio" });
  }

  //Validamos que la contraseña tenga al menos 6 caracteres
  if (password.length < 6) {
    errors.push({
      field: "password",
      message: "La contraseña debe tener al menos 6 caracteres.",
    });
  }
  if (!password || password.trim() === "") {
    errors.push({ field: "password", message: "La contraseña es obligatoria" });
  }

  //Conectamos a la bd

  const connection = await getDBConnection();

  try {
    // Comprobar si el nombre de usuario ya existe
    const userQuery = "SELECT * FROM users WHERE user= ?";
    const [userExists] = await connection.query(userQuery, [user]);

    if (userExists.length > 0) {
      errors.push({
        field: "user",
        message: "El nombre de usuario ya está en uso.",
      });
    }

    // Comprobar si el email ya existe
    const emailQuery = "SELECT * FROM users WHERE email = ?";
    const [emailExists] = await connection.query(emailQuery, [email]);

    if (emailExists.length > 0) {
      errors.push({
        field: "email",
        message: "El email ya está registrado",
      });
    }

    // Si hay errores después de consultar la BD, devolverlos
    console.log("errors:", errors);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
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

//VERIFICACIONES EMAIL Y USER EN EL REGISTRO ANTES DE ENVIAR A FRONT

server.post("/user", async (req, res) => {
  const { user } = req.body;

  const connection = await getDBConnection();

  try {
    const query = "SELECT * FROM users WHERE user = ?";
    const [results] = await connection.query(query, [user]);

    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "El usuario ya está registrado." });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al verificar al usuario" });
  } finally {
    connection.end();
  }
});

server.post("/email", async (req, res) => {
  const { email } = req.body;

  const connection = await getDBConnection();

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await connection.query(query, [email]);

    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "El email ya esta registrado" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al verificar el email" });
  } finally {
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

        //guardamos el token en las cookies.
        return res
          .cookie("access_token", token, {
            httpOnly: true, // la cookie solo se puede acceder en el servidor
            secure: process.env.NODE_ENV === "production", // para que siempre funcione con https
          })
          .json({ success: true, user: userResult[0], token: token });
      } else {
        return res.status(401).json({
          success: false,
          message: "Usuario no autenticado. Contraseña incorrecta",
        });
      }
      //si el usuario no se encuentra
    } else {
      return res.status(403).json({
        success: false,
        message: "Usuario no registrado. No se encuentra el email",
      });
    }
  } catch (error) {
    return res.status(500).json({
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
        - recoger el token (cookies)
        - validar el token con la clave secreta
        - guardar la información del estudiante que viene en el token
*/

async function authorize(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Error en autenticación",
    });
  }
  const connection = await getDBConnection();

  try {
    const tokenInfo = jwt.verify(token, process.env.DB_PASSWORD); // Verificamos el token con la clave

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

server.get("/profile-user", authorize, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

//ENDPOINT AÑADIR CAJAS (SEGUN EL LOGIN DE USUARIO)

/*Añadir cajas:
-recoger las cajas que envia front de body params
-Conectar a la base de datos
-consulta create (insert into)
-cierro conexion
-respondo
*/

server.post("/add-box", authorize, async (req, res) => {
  const { tittle } = req.body;

  if (!tittle) {
    return res.status(400).json({
      success: false,
      message: "El título es obligatorio",
    });
  }

  //la función authorize añade el usuario autenticado a req.user

  const userId = req.user.id;

  const connection = await getDBConnection();

  try {
    const query =
      "INSERT INTO Box (tittle, objects, fk_user_id) VALUES (?, ?, ?)";
    const defaultObjects = []; //pongo un array vacio porque de momento no metemos objetos
    const [result] = await connection.query(query, [
      tittle,
      JSON.stringify(defaultObjects),
      userId,
    ]);

    if (result.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Caja añadida",
        boxId: result.insertId,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al añadir caja. Inténtalo de nuevo",
    });
  } finally {
    connection.end();
  }
});

//AÑADIR OBJETOS

server.put("/add-objects", authorize, async (req, res) => {
  //recogemos datos desde el front: necesitamos el id de la caja y los nuevos objetos que se van a añadir
  const { boxId, objects } = req.body;

  if (!boxId || objects.length === 0 || !Array.isArray(objects)) {
    return res.status(400).json({
      success: false,
      message: "El objeto es obligatorio",
    });
  }

  const connection = await getDBConnection();

  try {
    //consultamos la base de datos para tener los objetos actuales que hay en la caja:
    const query = "SELECT objects FROM Box WHERE id = ? AND fk_user_id = ?";
    const [boxResult] = await connection.query(query, [boxId, req.user.id]);

    if (boxResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    // Recuperamos los objetos actuales y los parseamos de json a un array
    const currentObjects = boxResult[0].objects;

    //combinamos los objetos actuales con los nuevos objetos
    const updatedObjects = [...currentObjects, ...objects];

    //añadimos a la bd de datos los nuevos objetos
    const updateQuery = "UPDATE Box SET objects = ? WHERE id = ?";
    const [updateResult] = await connection.query(updateQuery, [
      JSON.stringify(updatedObjects),
      boxId,
    ]);

    console.log("updateResult:", updateResult);
    res.status(200).json({
      success: true,
      message: "Objeto añadido con exito",
    });
  } catch (error) {
    console.error("Error al actualizar los objetos:", error);
    res.status(500).json({
      success: false,
      message: "Error al añadir objetos, intentalo de nuevo",
    });
  } finally {
    connection.end();
  }
});

//ELIMINAR CAJA

server.delete("/delete-box/:id", authorize, async (req, res) => {
  //recogemos la ruta del id de la caja
  const id = req.params.id;

  const connection = await getDBConnection();
  try {
    //consultamos el id de la tabla caja con su correspondiente user logeado (req.user.id se obtiene de la funcion authorize)
    const sql = "DELETE FROM Box WHERE id = ? AND fk_user_id = ?";
    const [deleteBoxResult] = await connection.query(sql, [id, req.user.id]);

    if (deleteBoxResult.affectedRows > 0) {
      res.status(200).json({
        status: "true",
        message: "Caja eliminada con éxito",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "Caja no eliminada",
    });
  } finally {
    connection.end();
  }
});

server.delete("/delete-object", async (req, res) => {
  //recogemos de front el id de la caja y el index del objeto

  const { boxId, objectIndex } = req.body;

  const connection = await getDBConnection();

  try {
    //recuperamos los objetos que hay en la caja (req.user.id lo obtenemos de la funcion authorize, a que usuario logeado le pertenece la caja)
    const query = "SELECT objects FROM Box WHERE id = ?";
    const [boxResult] = await connection.query(query, [boxId]);

    console.log(boxResult);

    if (boxResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Caja no encontrada",
      });
    }

    //parseamos los objetos: de json a js para poder hacer modificaciones con ellos
    const currentObjects = boxResult[0].objects;

    //verificamos si el indice es válido

    if (objectIndex < 0 || objectIndex >= currentObjects.length) {
      return res.status(400).json({
        success: false,
        message: "Índice de objeto no válido",
      });
    }

    // eliminamos objeto del array:

    currentObjects.splice(objectIndex, 1);

    //actualizamos los objetos en la base de datos:

    const updateQuery = "UPDATE Box SET objects = ? WHERE id = ?";
    const [objectResult] = await connection.query(updateQuery, [
      JSON.stringify(currentObjects),
      boxId,
    ]);

    res.status(200).json({
      success: true,
      message: "Objeto eliminado con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar el objeto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el objeto, inténtalo de nuevo",
    });
  } finally {
    connection.end();
  }
});

server.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ success: true, message: "sesión cerrada" });
  res.redirect("/");
});
