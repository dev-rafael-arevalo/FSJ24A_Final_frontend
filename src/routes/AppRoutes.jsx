import { Route, Navigate, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute"; 

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* para register */}
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />} 
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;