// src/firebase/FireStore.jsx
import { getFirestore, doc, setDoc, getDoc  } from "firebase/firestore";
import { app } from "./FirebaseConfig";

export const db = getFirestore(app);
export const createUserDocument = async (user) => {
    if (!user) return;

    const userRef = doc(db, "usuarios", user.uid);

    try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            // Cria documento apenas se não existir
            await setDoc(
                userRef,
                {
                    nome: user.displayName || "",
                    endereco: "",
                    idade: 0,
                    peso: 0,
                    graduacao: "",
                    fotoURL: user.photoURL || "",
                    email: user.email || "",
                    telefone: "",
                }
            );
        }
    } catch (error) {
        console.error("❌ Erro ao criar documento do usuário:", error);
    }
};