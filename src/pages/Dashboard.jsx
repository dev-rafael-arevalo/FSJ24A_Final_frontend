import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { logout, getUser } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = getUser();
    setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    logout();
    // Redirigir al login o a la página principal después de cerrar sesión
    window.location.href = "/"; // o puedes usar `useNavigate` si usas react-router
  };

  return (
    <div>
      {user ? (
        <>
          <h1>Bienvenido, {user.name}</h1>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Dashboard;
