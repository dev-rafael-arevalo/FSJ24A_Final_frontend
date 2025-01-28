import axios from "axios";

const useAuth = () => {
  const login = async (email, password) => {
    try {
      const ApiUri = import.meta.env.VITE_REACT_API_URL;
      const response = await axios.post(`${ApiUri}/login`, {
        email,
        password,
      });

      // Verificar si la respuesta fue exitosa
      if (response.data.success) {
        // Guardar el token y el usuario en sessionStorage
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        return {
          success: true,
          message: response.data.message || "Inicio de sesión exitoso.",
          user: response.data.user,
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Credenciales incorrectas.",
        };
      }
    } catch (error) {
      // Si el error es un error de respuesta de servidor
      if (error.response && error.response.data) {
        return {
          success: false,
          message: error.response.data.message || "Error desconocido.",
        };
      }
      // Si hay un error de red o cualquier otro error
      return {
        success: false,
        message: "Error al conectar con el servidor.",
      };
    }
  };

  const logout = () => {
    // Eliminar el token y el usuario de sessionStorage
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
  };

  const getUser = () => {
    // Obtener el usuario del sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user;
  };

  return { login, logout, getUser };
};

export default useAuth;
