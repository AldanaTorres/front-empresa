import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import axios from "axios";

function App() {
  const baseUrl = "http://localhost:8080/services/empresa/api/clientes";
  const [data, setData] = useState([]);

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState({
    id: "",
    nombre: "",
    cUIL: "",
    telefono: "",
    direccion: "",
    empresa: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(clienteSeleccionado);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const header = {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsImV4cCI6MTYzNjkwNjYyMn0.MPAgnCNWDS_Iu2OEmOCfsA1p5ZCuVD0yT3mW50wWEk2wRetPQj5h8WcK-6rP1IKPxk85SfgjHS0shE10tbWkgA`,
    },
  };
  const peticionGet = async () => {
    await axios.get(baseUrl, header).then((response) => {
      setData(response.data);
    });
  };

  const peticionPost = async () => {
    const aGuardar = {
      nombre: clienteSeleccionado.nombre,
      cUIL: clienteSeleccionado.cUIL,
      telefono: clienteSeleccionado.telefono,
      direccion: clienteSeleccionado.direccion,
      empresa: {
        id: clienteSeleccionado.empresa,
      },
    };

    await axios
      .post(baseUrl, aGuardar, header)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionPut = async () => {
    const aGuardar = {
      id: clienteSeleccionado.id,
      nombre: clienteSeleccionado.nombre,
      cUIL: clienteSeleccionado.cUIL,
      telefono: clienteSeleccionado.telefono,
      direccion: clienteSeleccionado.direccion,
      empresa: {
        id: clienteSeleccionado.empresa,
      },
    };
    await axios
      .put(baseUrl, aGuardar, header)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((cliente) => {
          if (cliente.id === clienteSeleccionado.id) {
            cliente.nombre = clienteSeleccionado.nombre;
            cliente.cUIL = clienteSeleccionado.cUIL;
            cliente.telefono = clienteSeleccionado.telefono;
            cliente.direccion = clienteSeleccionado.direccion;
            cliente.empresa.id = clienteSeleccionado.empresa;
          }
        });
        setData(dataNueva);
        abrirCerrarModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const peticionDelete = async () => {
    await axios
      .delete(baseUrl + "/" + clienteSeleccionado.id, header)
      .then((response) => {
        setData(
          data.filter((cliente) => cliente.id !== clienteSeleccionado.id)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const seleccionarCliente = (cliente, caso) => {
    setClienteSeleccionado(cliente);

    caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <br />
      <button
        className="btn btn-success"
        onClick={() => abrirCerrarModalInsertar()}
      >
        Insertar
      </button>
      <br />
      <br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CUIL</th>
            <th>Telefono</th>
            <th>Dirección</th>
            <th>Empresa</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.nombre}</td>
              <td>{data.cUIL}</td>
              <td>{data.telefono}</td>
              <td>{data.direccion}</td>
              <td>{data.empresa ? data.empresa.nombre : "-"}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => seleccionarCliente(data, "Editar")}
                >
                  Editar
                </button>{" "}
                {"  "}
                <button
                  className="btn btn-danger"
                  onClick={() => seleccionarCliente(data, "Eliminar")}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>Insertar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
            />
            <br />
            <label>CUIL: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="cUIL"
              onChange={handleChange}
            />
            <br />
            <label>Teléfono: </label>
            <br />
            <input
              type="nomber"
              className="form-control"
              name="telefono"
              onChange={handleChange}
            />
            <br />
            <label>Dirección: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="direccion"
              onChange={handleChange}
            />
            <br />
            <label>Empresa: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="empresa"
              onChange={handleChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPost()}>
            Insertar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalInsertar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <br />
            <input
              type="text"
              disabled
              className="form-control"
              name="nombre"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.id}
            />
            <br />
            <label>Nombre: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nombre"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.nombre}
            />
            <br />
            <label>CUIL: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="cUIL"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.cUIL}
            />
            <br />
            <label>Teléfono: </label>
            <br />
            <input
              type="nomber"
              className="form-control"
              name="telefono"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.telefono}
            />
            <br />
            <label>Dirección: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="direccion"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.direccion}
            />
            <br />
            <label>Empresa: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="empresa"
              onChange={handleChange}
              value={clienteSeleccionado && clienteSeleccionado.empresa}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => peticionPut()}>
            Editar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirCerrarModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>¿Está seguro que desea eliminar al cliente?</ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>
            Confirmar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirCerrarModalEliminar()}
          >
            {" "}
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
