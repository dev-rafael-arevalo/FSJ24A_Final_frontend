import { Route, Navigate, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute"; // Importa el componente PrivateRoute

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta pública para Register */}
        <Route path="/register" element={<Register />} />

        {/* Ruta privada para Dashboard */}
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />} // Usa el componente PrivateRoute para la ruta privada
        />
        
        {/* Redirigir a login si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;