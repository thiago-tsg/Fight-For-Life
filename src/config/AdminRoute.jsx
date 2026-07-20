import { Navigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";
import EmManutencao from "../components/EmManutencao";
import { FEATURE_FLAGS, ADMIN_EMAILS } from "../config/featureFlags";

const AdminRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <p>Carregando...</p>;
  }

  // Loja aberta para todos
  if (FEATURE_FLAGS.STORE_ENABLED) {
    return children;
  }

  // Não logado
  if (!user) {
    return <EmManutencao />;
  }

  // É administrador?
  const isAdmin = ADMIN_EMAILS.includes(user.email);

  if (!isAdmin) {
    return <EmManutencao />;
  }

  return children;
};

export default AdminRoute;