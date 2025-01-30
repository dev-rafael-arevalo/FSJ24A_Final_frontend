import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { logout, getUser } = useAuth();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Modal de edición
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editUserData, setEditUserData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const ApiUri = import.meta.env.VITE_REACT_API_URL;

  // Obtener usuario actual y lista de usuarios al cargar el componente
  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
    fetchUsers();
  }, []);

  // Funcion para obtener la lista de usuarios desde la API detalladamente usando depuracion y ver mas errores
  const fetchUsers = async () => {
    try {
      console.log("Intentando obtener usuarios..."); // Depuración inicial
      const token = localStorage.getItem("token");
      console.log("Token obtenido:", token); // Verifica si el token está presente
  
      const response = await axios.get(`${ApiUri}/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
      });
  
      console.log("Respuesta de la API:", response.data); // Verifica el contenido de la respuesta
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
        console.log("Usuarios cargados correctamente:", response.data); // Confirma que los usuarios se han cargado
      } else {
        setUsers([]);
        console.warn("No se encontraron usuarios."); // Advertencia si no hay usuarios
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error.response || error); // Muestra el error completo
      Swal.fire("Error", "No se pudo cargar la lista de usuarios", "error");
      setUsers([]);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        window.location.href = "/"; // Redirigir al login o a la página principal
      }
    });
  };

  // Agregar un nuevo usuario
  const handleAddUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    try {
      await axios.post(`${ApiUri}/v1/users`, newUserData);
      Swal.fire("Éxito", "Usuario agregado correctamente", "success");
      fetchUsers();
      setShowModal(false);
      setNewUserData({ name: "", email: "", password: "" }); // Limpiar formulario
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el usuario", "error");
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${ApiUri}/v1/users/${id}`);
        Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  // Editar usuario
  const handleEditUser = async () => {
    if (!editUserData.name || !editUserData.email) {
      Swal.fire("Error", "Los campos Nombre y Correo son obligatorios", "error");
      return;
    }

    try {
      await axios.put(`${ApiUri}/v1/users/${editUserData.id}`, editUserData);
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  // Abrir modal para editar usuario
  const handleOpenEditModal = (user) => {
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // No es necesario para la edición si no se desea cambiar
    });
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg shadow-md">

      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        {user ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-400">Bienvenido, {user.name}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      {/* Botón para agregar un nuevo usuario */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white p-2 rounded mb-4 hover:bg-blue-700 transition"
      >
        Agregar nuevo usuario
      </button>

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg border border-blue-500">
            <h2 className="text-xl mb-4 text-blue-400">Agregar Nuevo Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newUserData.name}
              onChange={(e) =>
                setNewUserData({ ...newUserData, name: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Correo"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              onClick={handleAddUser}
              className="bg-green-600 text-white p-2 rounded mr-2 hover:bg-green-700 transition"
            >
              Agregar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      {users.length === 0 ? (
        <p>No hay usuarios disponibles</p>
      ) : (
        <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden border border-blue-500">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border px–4 py–3">Nombre</th>
              <th className="border px–4 py–3">Correo</th>
              <th className="border px–4 py–3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray–700">
                <td className="border px–4 py–3">{user.name}</td>
                <td className="border px–4 py–3">{user.email}</td>
                <td className="border px–4 py–3 flex space-x–2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red–600 text-white py–1 px–3 rounded hover:bg-red–700 transition"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="bg-blue–600 text-white py–1 px–3 rounded hover:bg-blue–700 transition"
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
