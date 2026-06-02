import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "./FirebaseConfig";
import { createUserDocument } from "./FireStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.warn("Não foi possível definir persistência:", err);
      }

      const unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          try {
            await createUserDocument(u);
          } catch (err) {
            console.error("Erro ao criar documento:", err);
          }
        }
        setLoadingAuth(false);
      });

      return () => unsub();
    })();
  }, [auth]);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, auth, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
