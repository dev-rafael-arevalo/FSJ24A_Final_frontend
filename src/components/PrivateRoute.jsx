import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ element }) => {
  const { getUser } = useAuth();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element; // Si está autenticado, renderiza el componente
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;