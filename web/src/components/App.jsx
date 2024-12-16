import "../scss/App.scss";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";
import Landing from "./Landing";
import Main from "./Main";
import Contact from "./Contact";
import Info from "./Info";
import Header from "./Header";
import { useEffect, useState } from "react";
import Box from "./Box";
import localStorage from "../services/localStorage";

function App() {
  const [modalAddBox, setModalAddBox] = useState(false);
  const location = useLocation();

  const [inputModalAddBox, setInputModalAddBox] = useState("");
  const [addedBox, setAddedBox] = useState(() => {
    return localStorage.get("boxes", []);
  });

  const [messageAddBox, setMesaggeAddBox] = useState("");
  const [inputAddObject, setInputAddObject] = useState("");
  const [inputFilterBox, setInputFilterBox] = useState("");
  const [isLogin, setIslogin] = useState(true);
  const [inputFilterObject, setInputFilterObject] = useState("");
  const [mobileMenuHeader, setMobileMenuHeader] = useState(false);
  const [modalRemoveBox, setModalRemoveBox] = useState(false);
  const [boxToRemove, setBoxToRemove] = useState(null);
  const [login, setLogin] = useState(false);

  //guardar en localStorage:

  useEffect(() => {
    localStorage.set("boxes", addedBox);
  }, [addedBox]);

  //FETCH MOSTRAR CAJAS
  useEffect(() => {
    if (!login) {
      return;
    }

    fetch(`http://localhost:5005/boxs`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const boxData = data.result.map((box) => {
          return {
            tittle: box.tittle,
            id: box.id,
            objects: box.objects,
          };
        });
        setAddedBox(boxData);
      });
  }, [login]);

  /*abrir pop up añadir caja*/
  function handleModalAddBox() {
    setModalAddBox(true);
  }
  /*cerrar pop up añadir caja*/
  function handleClickClose() {
    setModalAddBox(false);
    setInputModalAddBox(""); //cuando se cierra el pop up, de momento no se guarda la información escrita anteriormente, mas adelante se puede contemplar guardar en localStorage
    setMesaggeAddBox("");
  }

  // input de añadir caja
  function handleChangeInputModalAddBox(value) {
    setInputModalAddBox(value);
  }

  //función añadir caja

  function handleClickAddBox() {
    const doesBoxExist = addedBox.some(
      (box) =>
        box.tittle.toLowerCase().trim() ===
        inputModalAddBox.toLocaleLowerCase().trim()
    );

    if (inputModalAddBox.trim() === "") {
      setMesaggeAddBox("Debes ponerle un nombre a la caja");
      return;
    } else if (inputModalAddBox.length > 18) {
      setMesaggeAddBox("Ese nombre es demasiado largo");
    } else if (doesBoxExist) {
      setMesaggeAddBox("Ya hay otra caja con ese nombre");
      return;
    }

    const newBox = {
      tittle: inputModalAddBox,
    };

    fetch("http://localhost:5005/add-box", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newBox),
      credentials: "include", //Asegura que las cookies se envien automáticamente
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Error al añadir caja");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          const addedBoxFromServer = {
            id: data.boxId,
            tittle: newBox.tittle,
            objects: [],
            message: "",
          };

          setAddedBox([...addedBox, addedBoxFromServer]);
          setInputModalAddBox("");
          setMesaggeAddBox("");
          setModalAddBox(false);
        } else {
          setMesaggeAddBox(data.message || "Error al añadir la caja");
        }
      })
      .catch((error) => {
        // Manejo de errores de red u otros errores
        setMesaggeAddBox(
          error.message || "Hubo un problema al conectar con el servidor"
        );
      });
  }

  //funcion aparece mensaje eliminar
  function handleQuestionRemoveBox(box) {
    setBoxToRemove(box);
    setModalRemoveBox(true);
  }

  //función eliminar caja (SI)

  function handleClickRemoveBox(id) {
    const removedBox = addedBox.filter((box) => box.id !== id);

    fetch(`http://localhost:5005/delete-box/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setAddedBox(removedBox);
        setModalRemoveBox(false);
        setBoxToRemove(null);
        localStorage.clear();
      })
      .catch((error) => {
        console.error("Error eliminando el recurso:", error);
      });
  }

  //funcion cerrar modal mensaje eliminar caja (NO)
  function handleCloseModal() {
    setModalRemoveBox(false);
    setBoxToRemove(null);
  }
  //rutas de cada caja

  const { pathname } = useLocation();
  const routeData = matchPath("/box/:boxId", pathname);
  const boxId = routeData !== null ? parseInt(routeData.params.boxId) : null;

  const boxSelected = addedBox.find((box) => box.id === boxId);

  //forzar scroll

  useEffect(() => {
    if (pathname !== "/main") {
      window.scrollTo(0, 0); // Forzar el scroll al tope cada vez que cambias de ruta
    }
  }, [pathname]); // Ejecuta el efecto cada vez que cambie la ruta

  //Añadir objetos (dentro de las rutas, es decir, dentro de cada caja)

  function handleInputAddObject(value) {
    setInputAddObject(value);
  }

  function handleAddObject() {
    // Limpiar el input antes de empezar
    setInputAddObject("");

    if (inputAddObject.trim() === "") {
      // Si el input está vacío, encontrar la caja y actualizar su mensaje de error
      const updatedBoxes = addedBox.map((box) => {
        if (box.id === boxSelected.id) {
          return {
            ...box,
            message: "Por favor, añade un objeto", // Mensaje de error específico para la caja
          };
        }
        return box; // No cambiar otras cajas
      });

      // Actualizar el estado con las cajas modificadas
      setAddedBox(updatedBoxes);
      return; // Salir si el input está vacío
    }

    // Verificamos si el objeto ya existe en la lista de la caja seleccionada
    const doesObjectExist = boxSelected.objects.some(
      (object) =>
        object.text.toLowerCase() === inputAddObject.trim().toLowerCase()
    );

    if (doesObjectExist) {
      // Si el objeto ya existe, actualizar el mensaje de error solo para la caja seleccionada
      const updatedBoxes = addedBox.map((box) => {
        if (box.id === boxSelected.id) {
          return {
            ...box,
            message: "Lo que intentas añadir ya está en tu caja",
          };
        }
        return box;
      });

      // Actualizar el estado con las cajas modificadas
      setAddedBox(updatedBoxes);
      return; // Salir si el objeto ya existe
    }

    // Si no existe, proceder a añadir el nuevo objeto
    const newObject = {
      text: inputAddObject.trim(),
      checked: false,
    };

    //preparamos los datos para enviar al servidor:
    const dataToSend = {
      boxId: boxSelected.id,
      objects: [newObject],
    };

    fetch("http://localhost:5005/add-objects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Error al añadir objetos");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          // Actualizamos la caja en el frontend con el nuevo objeto
          const updatedBoxes = addedBox.map(
            (box) =>
              box.id === boxSelected.id
                ? {
                    ...box,
                    objects: [...box.objects, newObject],
                    message: "", // Limpiamos cualquier mensaje de error
                  }
                : box //se devuelve la caja si el id no coincide tal y como estaba
          );
          setAddedBox(updatedBoxes);
        } else {
          // Mostramos el mensaje de error recibido del servidor
          const updatedBoxes = addedBox.map((box) =>
            box.id === boxSelected.id ? { ...box, message: data.message } : box
          );
          setAddedBox(updatedBoxes);
        }
      })
      .catch((error) => {
        // Manejo de errores de red o del servidor
        const updatedBoxes = addedBox.map((box) =>
          box.id === boxSelected.id
            ? {
                ...box,
                message:
                  error.message || "Hubo un problema al añadir el objeto",
              }
            : box
        );
        setAddedBox(updatedBoxes);
      });
  }

  //Marcar con check cada elemento de la lista
  function handleChecked(indexToCheck, boxId) {
    const checkInBox = addedBox.map((box) => {
      if (box.id === boxId) {
        const checkedObjects = box.objects.map((object, index) =>
          index === indexToCheck
            ? { ...object, checked: !object.checked }
            : object
        );
        return {
          ...box,
          objects: checkedObjects,
        };
      }
      return box;
    });
    setAddedBox(checkInBox);
  }

  //eliminar item de cada caja
  function handleRemoveItem(indexToRemove, boxId) {
    const removedItem = addedBox.map((box) => {
      if (box.id === boxId) {
        return {
          ...box,
          objects: box.objects.filter((_, index) => index !== indexToRemove),
        };
      }
      return box;
    });

    const dataItemToSend = {
      objectIndex: indexToRemove,
      boxId: boxId,
    };

    fetch("http://localhost:5005/delete-object", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataItemToSend),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || "Error al eliminar objetos");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setAddedBox(removedItem);
          localStorage.clear();
        }
      })
      .catch((error) => {
        console.error("Error eliminando el recurso:", error);
      });
  }

  //funcionalidad buscador por nombre de caja:
  function handleChangeInput(value) {
    setInputFilterBox(value);
  }
  //buscar por objeto:

  function handleChangeInputObject(value) {
    setInputFilterObject(value);
  }

  //filtrar por nombre de la caja y por objeto dentro de la caja

  const filteredBoxName = addedBox
    .filter((box) =>
      box.tittle.toLowerCase().includes(inputFilterBox.toLowerCase())
    )
    .filter((box) => {
      // Si no se está filtrando por objeto, mostramos todas las cajas
      if (inputFilterObject === "") {
        return true;
      }

      // Si la caja no tiene objetos, la eliminamos del resultado
      if (box.objects.length === 0) {
        return false;
      }

      // Si la caja tiene objetos, aplicamos el filtro a los objetos
      const objectMatches = box.objects.some((obj) =>
        obj.text.toLowerCase().includes(inputFilterObject.toLowerCase())
      );

      return objectMatches;
    });

  //login-register:
  function handleClickForm() {
    setIslogin(!isLogin);
  }

  function handleClickMenu() {
    setMobileMenuHeader(!mobileMenuHeader);
  }

  function handleCloseMenu() {
    setMobileMenuHeader(false);
  }

  function handleClickLogoutMobile() {
    setMobileMenuHeader(false);
  }
  return (
    <>
      {location.pathname !== "/" && (
        <Header
          toggleMenu={handleClickMenu}
          onClickCloseMenu={handleCloseMenu}
          setLogin={setLogin}
          setIslogin={setIslogin}
          setModalAddBox={setModalAddBox}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Landing
              toggleForm={handleClickForm}
              isLogin={isLogin}
              setLogin={setLogin}
            />
          }
        />
        <Route
          path="/main"
          element={
            <Main
              modalAddBox={modalAddBox}
              onClickModalAddBox={handleModalAddBox}
              onClickClose={handleClickClose}
              inputModalAddBox={inputModalAddBox}
              onChangeInputModalAddBox={handleChangeInputModalAddBox}
              onClickAddBox={handleClickAddBox}
              addedBox={filteredBoxName}
              messageAddBox={messageAddBox}
              questionRemove={handleQuestionRemoveBox}
              onClickRemoveBox={handleClickRemoveBox}
              onCloseModal={handleCloseModal}
              box={boxSelected}
              onChangeInput={handleChangeInput}
              onChangeInputObject={handleChangeInputObject}
              inputFilterBox={inputFilterBox}
              inputFilterObject={inputFilterObject}
              mobileMenuHeader={mobileMenuHeader}
              onClickCloseMenu={handleCloseMenu}
              modalRemoveBox={modalRemoveBox}
              boxToRemove={boxToRemove}
              onClickLogoutMobile={handleClickLogoutMobile}
              setModalAddBox={setModalAddBox}
              setIslogin={setIslogin}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact
              onClickCloseMenu={handleCloseMenu}
              mobileMenuHeader={mobileMenuHeader}
              onClickLogoutMobile={handleClickLogoutMobile}
            />
          }
        />
        <Route
          path="/info"
          element={
            <Info
              onClickCloseMenu={handleCloseMenu}
              mobileMenuHeader={mobileMenuHeader}
              onClickLogoutMobile={handleClickLogoutMobile}
            />
          }
        />
        <Route
          path="/box/:boxId"
          element={
            <Box
              addedBox={addedBox}
              box={boxSelected}
              onClickAddObject={handleAddObject}
              onChangeInputObject={handleInputAddObject}
              inputObject={inputAddObject}
              onChangeChecked={handleChecked}
              onClickRemoveItem={handleRemoveItem}
              mobileMenuHeader={mobileMenuHeader}
              onClickLogoutMobile={handleClickLogoutMobile}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
