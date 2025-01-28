import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Importar los íconos de ojo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación de campos
    if (password.length < 6) {
      setLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos 6 caracteres.",
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

    const result = await login(email, password);

    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Redirigiendo al dashboard...",
      }).then(() => {
        navigate("/dashboard");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: result.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
        <p className="text-center text-gray-600 mb-4">Accede a tu cuenta para continuar</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">Mantener sesión iniciada</label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>

        <p className="text-center text-gray-600 mt-4">
          ¿No tienes una cuenta? 
          <button 
            onClick={() => navigate("/register")} 
            className="text-blue-500 hover:underline"
          >
            Crea una ahora
          </button>
        </p>

        <div className="text-center text-sm text-gray-500 mt-6">
          <i className="bi bi-shield-lock"></i> Este es un sistema seguro. Tus datos están protegidos.
        </div>
      </div>
    </div>
  );
};

export default Login;
