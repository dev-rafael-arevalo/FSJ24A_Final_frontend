import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Importar los íconos

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false); // Estado para confirmar la contraseña
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const ApiUri = import.meta.env.VITE_REACT_API_URL;

  // Función para mostrar/ocultar la contraseña
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const togglePasswordConfirmationVisibility = () => setPasswordConfirmationVisible(!passwordConfirmationVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de campos en el cliente
    if (password !== passwordConfirmation) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
      });
    }

    if (password.length < 8) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico no es válido.",
      });
    }

    // Enviar datos al backend (Laravel)
    try {
      const response = await fetch(`${ApiUri}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Redirigiendo al inicio de sesión...",
        }).then(() => {
          navigate("/login");
        });
      } else {
        // Aquí asignamos los errores que devuelve el backend
        setErrors(data.errors || {});
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Ocurrió un error",
        });
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error en el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name[0]}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {passwordVisible ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password[0]}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={passwordConfirmationVisible ? "text" : "password"}
                id="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                minLength={8}
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordConfirmationVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {passwordConfirmationVisible ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password_confirmation && <p className="text-red-500 text-xs mt-2">{errors.password_confirmation[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Cargando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
