# Boxify

¡Organiza tu mudanza de manera sencilla! Con esta aplicación web, podrás gestionar tus cajas y objetos durante el proceso de mudanza, eliminando el estrés del desorden.

![Vista previa de Boxify](./src/images/1.png)

## Índice

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#Tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Características](#características)
- [Endpoints](#endpoints)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Contacto](#contacto)

## Descripción

Boxify es una aplicación web diseñada para ayudarte a organizar todas las cajas y objetos durante tu mudanza. Con esta herramienta intuitiva, podrás crear, gestionar y marcar cajas, así como visualizar todo lo que has guardado de manera clara y eficiente.

El proyecto incluye tanto un front-end interactivo como un back-end completamente funcional. Cada usuario que se registra en la aplicación es almacenado en una base de datos, donde puede guardar y organizar sus cajas y los objetos que contienen. Cada cuenta es privada y permite a los usuarios realizar modificaciones en su contenido tras iniciar sesión. Esto asegura que cada usuario tenga acceso exclusivo a su información de mudanza y pueda personalizarla según sus necesidades.

Puedes acceder y utilizar la versión de front-end a través del siguiente enlace:

[Boxify - Organiza tu mudanza](https://laura-pf.github.io/moving-organizer/#/)

## Tecnologías

- **Frontend:** React (create-react-app)
- **Backend:** Node.js con Express
- **Base de datos:** MySQL gestionada con MySQL Workbench
- **Autenticación:** JWT (JSON Web Token)
- **Documentación API:** Swagger
- **Estilo:** SCSS

## Instalación

Sigue estos pasos para instalar el proyecto en tu máquina local:

1. Clona este repositorio e instala las dependencias necesarias con los siguientes comandos:

```bash
git clone https://github.com/laura-pf/moving-organizer-boxify.git
cd moving-organizer-boxify
npm install
```

2. Crea un archivo .env en la raíz del proyecto con la siguiente información:

```bash
DB_PASSWORD=tu_contraseña
DB_USER=tu_usuario
DB_TOKEN="token"
NODE_ENV=development
```

3. Configura la base de datos:

- Crea una nueva base de datos en MySQL Workbench llamada `boxify` (o el nombre que prefieras).
- Importa el archivo `BOXIFY.sql` incluido en el proyecto.

## Uso

Para iniciar este proyecto debes hacerlo con:

```bash
npm run dev
```

markdown
Copiar código

## Características

Boxify ofrece las siguientes funcionalidades principales:

1. **Crear y gestionar cajas de mudanza**

   - Permite a la usuaria crear cajas, nombrarlas y añadir objetos dentro de cada una.

2. **Filtro por cajas u objetos**

   - Si tienes muchas cajas o necesitas encontrar dónde guardaste un objeto, puedes usar el buscador disponible en la página principal.

3. **Marcado de objetos**

   - A medida que empacas, puedes marcar los objetos que ya están listos con un check, lo que facilita el seguimiento.

4. **Eliminación de cajas u objetos**
   - Puedes eliminar cualquier caja o artículo en caso de que cambies de opinión o cometas un error.

## Endpoints

### Registrar un nuevo usuario

`POST /register`

Registra un nuevo usuario en el sistema.

#### Parámetros del cuerpo (JSON)

- `name` (string): Nombre del usuario.
- `user` (string): Nombre de usuario.
- `email` (string): Correo electrónico del usuario.
- `password` (string): Contraseña del usuario.

---

### Verificar si un nombre de usuario está disponible

`POST /user`

Verifica si un nombre de usuario ya existe en el sistema.

#### Parámetros del cuerpo (JSON)

- `user` (string): Nombre de usuario a verificar.

---

### Verificar si un correo electrónico está disponible

`POST /email`

Verifica si un correo electrónico ya existe en el sistema.

#### Parámetros del cuerpo (JSON)

- `email` (string): Correo electrónico a verificar.

---

### Iniciar sesión

`POST /login`

Inicia sesión en el sistema.

#### Parámetros del cuerpo (JSON)

- `email` (string): Correo electrónico del usuario.
- `password` (string): Contraseña del usuario.

---

### Obtener perfil de usuario autenticado

`GET /profile-user`

Obtiene la información del perfil del usuario autenticado.

---

### Obtener todas las cajas

`GET /boxs`

Retorna una lista de todas las cajas asociadas al usuario autenticado.

---

### Añadir una nueva caja

`POST /add-box`

Crea una nueva caja para el usuario autenticado.

#### Parámetros del cuerpo (JSON)

- `tittle` (string): Título de la caja.

---

### Añadir objetos a una caja

`PUT /add-objects`

Añade objetos a una caja específica.

#### Parámetros del cuerpo (JSON)

- `boxId` (integer): ID de la caja donde se añadirán los objetos.
- `objects` (array de strings): Lista de objetos a añadir.

---

### Eliminar una caja

`DELETE /delete-box/:id`

Elimina una caja específica.

#### Parámetros de la URL

- `id` (integer): ID de la caja a eliminar.

---

### Eliminar un objeto de una caja

`DELETE /delete-object`

Elimina un objeto específico de una caja.

#### Parámetros del cuerpo (JSON)

- `boxId` (integer): ID de la caja.
- `objectIndex` (integer): Índice del objeto a eliminar.

---

### Cerrar sesión

`POST /logout`

Cierra la sesión del usuario eliminando la cookie que contiene el token de autenticación.

---

### Acceder a la documentación API

Visita [http://localhost:5005/api-doc](http://localhost:5005/api-doc) en tu navegador para acceder a la documentación generada por Swagger UI.

## Contribuir

Si deseas colaborar con el proyecto, sigue estos pasos:

1. Crea una nueva rama (`git checkout -b nueva-caracteristica`).
2. Realiza los cambios necesarios y haz commit (`git commit -m 'Agrega nueva característica'`).
3. Sube los cambios a tu rama (`git push origin nueva-caracteristica`).
4. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE) en este repositorio.

MIT License

## Contacto

Para cualquier consulta, sugerencia o reporte de problemas, puedes ponerte en contacto con:

- [Laura Parra](https://github.com/laura-pf)
