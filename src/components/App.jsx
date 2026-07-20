// React
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

// Components
import ButtonWhats from "./ButtonWhats.jsx";
import Relogio from "./Relogio.jsx";
import Menu from "./Menu.jsx";
import Header from "./Header.jsx";
import Main from "./Main.jsx";
import Footer from "./Footer.jsx";
import QuemSomos from "./QuemSomos.jsx";
import Contato from "./Contato.jsx";
import Planos from "./Planos.jsx";
import ConfigUser from "./ConfigUser.jsx";
import Loja from "./Loja/Loja.jsx";
import Carrinho from "./Loja/Carrinho.jsx";
import Comprar from "./Loja/Comprar.jsx";
import Checkout from "./Pagamento/Checkout.jsx";
import Campeonatos from "./Campeonatos.jsx";
import AvaliacaoGrau from "./AvaliacaoGrauKids.jsx";
import Background from "./Background.jsx";
import { useAuth } from "../firebase/AuthContext";
import { CartProvider } from "./Loja/CartContext.jsx";
import AdminRoute from "../config/AdminRoute";

// Styles
import "../styles/App.scss";

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Rota protegida
const PrivateRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <p>Carregando...</p>;
  }

  return user ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <CartProvider>
      <Background />

      <Router basename={import.meta.env.BASE_URL}>
        <ButtonWhats />
        <Relogio />
        <Menu />
        <ScrollToTop />

        <section className="app-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header />
                  <Main />
                </>
              }
            />

            <Route path="/quemsomos" element={<QuemSomos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/planos" element={<Planos />} />

            <Route
              path="/loja"
              element={
                <AdminRoute>
                  <Loja />
                </AdminRoute>
              }
            />

            <Route
              path="/carrinho"
              element={
                <AdminRoute>
                  <Carrinho />
                </AdminRoute>
              }
            />

            <Route
              path="/comprar"
              element={
                <AdminRoute>
                  <Comprar />
                </AdminRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <AdminRoute>
                  <Checkout />
                </AdminRoute>
              }
            />

            <Route path="/campeonatos" element={<Campeonatos />} />

            <Route
              path="/avaliacao-infantil-2026"
              element={<AvaliacaoGrau />}
            />

            <Route
              path="/configUser"
              element={
                <PrivateRoute>
                  <ConfigUser />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>

        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;