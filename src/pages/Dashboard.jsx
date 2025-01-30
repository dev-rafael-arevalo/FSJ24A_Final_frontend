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

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUri}/v1/users`);
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

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

  const handleAddUser = async () => {
    try {
      await axios.post(`${ApiUri}/v1/users`, newUserData);
      Swal.fire("Éxito", "Usuario agregado correctamente", "success");
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo agregar el usuario", "error");
    }
  };

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

  const handleEditUser = async () => {
    try {
      await axios.put(`${ApiUri}/v1/users/${editUserData.id}`, editUserData);
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

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
    <div className="container mx-auto p-4">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        {user ? (
          <>
            <h1 className="text-xl font-semibold">Bienvenido, {user.name}</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white p-2 rounded"
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
        className="bg-blue-600 text-white p-2 rounded mb-4"
      >
        Agregar nuevo usuario
      </button>

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Agregar Nuevo Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newUserData.name}
              onChange={(e) =>
                setNewUserData({ ...newUserData, name: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={newUserData.email}
              onChange={(e) =>
                setNewUserData({ ...newUserData, email: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUserData.password}
              onChange={(e) =>
                setNewUserData({ ...newUserData, password: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleAddUser}
              className="bg-green-600 text-white p-2 rounded mr-2"
            >
              Agregar
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-400 text-white p-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">Editar Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={editUserData.name}
              onChange={(e) =>
                setEditUserData({ ...editUserData, name: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={editUserData.email}
              onChange={(e) =>
                setEditUserData({ ...editUserData, email: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña (dejar en blanco si no se quiere cambiar)"
              value={editUserData.password}
              onChange={(e) =>
                setEditUserData({ ...editUserData, password: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button
              onClick={handleEditUser}
              className="bg-blue-600 text-white p-2 rounded mr-2"
            >
              Actualizar
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="bg-gray-400 text-white p-2 rounded"
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
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Correo</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 text-white p-2 rounded"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="bg-blue-600 text-white p-2 rounded"
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