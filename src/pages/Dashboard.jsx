import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const Dashboard = () => {
  const { logout, getUser } = useAuth();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Configurar axios con el token
  const getAxiosConfig = () => {
    const token = sessionStorage.getItem("authToken");
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiUri}/v1/users`, getAxiosConfig());

      // Manejar diferentes estructuras de respuesta
      const userData = response.data.data || response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else {
        console.error("Formato de respuesta inesperado:", response.data);
        setUsers([]);
      }
    } catch (error) {
      handleApiError(error, "Error al cargar usuarios");
      setUsers([]);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        window.location.href = "/";
      }
    });
  };

  const handleAddUser = async () => {
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserData.email)) {
      Swal.fire("Error", "El formato del email no es válido", "error");
      return;
    }

    // Validar longitud mínima de la contraseña
    if (newUserData.password.length < 6) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }

    try {
      // Formatear los datos exactamente como los espera Laravel
      const userData = {
        name: newUserData.name.trim(),
        email: newUserData.email.trim().toLowerCase(),
        password: newUserData.password,
        password_confirmation: newUserData.password // Laravel suele requerir confirmación
      };

      console.log('Intentando registro con datos:', {
        ...userData,
        password: '[REDACTED]' // No logear la contraseña real
      });

      const response = await axios.post(
        `${ApiUri}/register`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Importante para recibir respuestas JSON de Laravel
          }
        }
      );

      console.log('Respuesta del servidor:', response.data);

      if (response.data) {
        await Swal.fire("Éxito", "Usuario agregado correctamente", "success");
        setShowModal(false);
        setNewUserData({ name: "", email: "", password: "" });
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error completo:', error);

      let errorMessage = "Error al agregar usuario";

      if (error.response) {
        console.error('Respuesta de error del servidor:', error.response.data);

        // Manejar diferentes formatos de error de Laravel
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.errors) {
          // Laravel validation errors
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
        }
      }

      Swal.fire("Error", errorMessage, "error");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${ApiUri}/v1/users/${id}`,
          getAxiosConfig()
        );

        await Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
        await fetchUsers();
      }
    } catch (error) {
      handleApiError(error, "Error al eliminar usuario");
    }
  };

  const handleEditUser = async () => {
    if (!editUserData.name || !editUserData.email) {
      Swal.fire("Error", "Los campos Nombre y Correo son obligatorios", "error");
      return;
    }

    try {
      // Crear objeto con solo los campos necesarios
      const updateData = {
        name: editUserData.name,
        email: editUserData.email,
        ...(editUserData.password ? { password: editUserData.password } : {})
      };

      await axios.put(
        `${ApiUri}/v1/users/${editUserData.id}`,
        updateData,
        getAxiosConfig()
      );

      await Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      setShowEditModal(false);
      await fetchUsers();
    } catch (error) {
      handleApiError(error, "Error al actualizar usuario");
    }
  };

  // Función centralizada para manejar errores de API
  const handleApiError = (error, defaultMessage) => {
    console.error('Error API:', error);

    let errorMessage = defaultMessage;

    if (error.response) {
      // Si el servidor respondió con un error
      if (error.response.status === 401) {
        Swal.fire("Error de autenticación", "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.", "error")
          .then(() => {
            logout();
            window.location.href = "/";
          });
        return;
      }

      // Intentar obtener mensaje de error del servidor
      errorMessage = error.response.data?.message || error.response.data?.error || defaultMessage;
    } else if (error.request) {
      // Si la solicitud fue hecha pero no se recibió respuesta
      errorMessage = "No se pudo conectar con el servidor. Por favor, verifica tu conexión.";
    }

    Swal.fire("Error", errorMessage, "error");
  };

  const handleOpenEditModal = (user) => {
    setEditUserData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "", // Limpiamos la contraseña al abrir el modal
    });
    setShowEditModal(true);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg shadow-md">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        {user ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-400">
              Bienvenido, {user.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
              >
                Agregar Usuario
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>

      {/* Tabla de usuarios */}
      {Array.isArray(users) && users.length > 0 ? (
        <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden border border-blue-500">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border px-4 py-3">Nombre</th>
              <th className="border px-4 py-3">Correo</th>
              <th className="border px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700">
                <td className="border px-4 py-3">{user.name}</td>
                <td className="border px-4 py-3">{user.email}</td>
                <td className="border px-4 py-3 flex space-x-2 justify-center">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios disponibles.</p>
      )}

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-blue-500/30">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-500/30 pb-2">
              Agregar Nuevo Usuario
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingrese la contraseña"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-blue-500/30">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-blue-500/30">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-500/30 pb-2">
              Editar Usuario
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el nombre"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para mantener la actual"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  value={editUserData.password}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-blue-500/30">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditUser}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;