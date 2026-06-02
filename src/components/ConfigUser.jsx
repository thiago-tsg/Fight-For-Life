import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/AuthContext";
import { db } from "../firebase/FireStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/ConfigUser.scss";

const ConfigUser = () => {
  const { user, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    idade: "",
    peso: "",
    graduacao: "",
    fotoURL: "",
  });

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // Proteção — se não estiver logado, voltar para Home
  useEffect(() => {
    if (!loadingAuth && !user) navigate("/");
  }, [loadingAuth, user, navigate]);

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setFormData({ ...snap.data(), email: user.email });
      } else {
        await setDoc(userRef, { email: user.email });
        setFormData({ email: user.email });
      }

      setLoading(false);
    };

    loadUserData();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // SALVAR FOTO DIRETO NO FIRESTORE (base64)
  const handlePhotoChange = (e) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result; // "data:image/...;base64,..."
      setFormData((prev) => ({ ...prev, fotoURL: base64String }));

      // Salva direto no Firestore
      try {
        await setDoc(
          doc(db, "usuarios", user.uid),
          { fotoURL: base64String },
          { merge: true }
        );
        alert("Foto atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar foto:", error);
        alert("Erro ao salvar foto. Tente novamente.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, "usuarios", user.uid);

    try {
      await setDoc(userRef, formData, { merge: true });
      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao salvar dados. Tente novamente.");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPass || !newPass || !confirmPass)
      return alert("Preencha todos os campos.");

    if (newPass !== confirmPass)
      return alert("As senhas não coincidem.");

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPass);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPass);

      alert("Senha atualizada com sucesso!");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      console.error("Erro ao trocar senha:", error);
      alert("Erro ao trocar senha. Verifique a senha antiga.");
    }
  };

  if (loadingAuth || loading || !user) return <p>Carregando...</p>;

  return (
    <section className="config-user flex-center container">
      <div className="cg-config-user flex-colum gap-lg">
        <h2 className="titu-config-user center">Configurações do Usuário</h2>

        <div className="foto-area flex-colum gap-md">
          <div className="c-img-config-user">
            <img
              src={formData.fotoURL || "/default-user.png"}
              className="foto-preview"
              alt="Usuário"
            />
          </div>
          <label className="btn">
            Alterar Foto
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
        </div>

        <label>Email</label>
        <input value={formData.email} disabled />

        <div className="cg-grupo-info grid3col gap-lg">
          {["nome", "telefone", "endereco", "idade", "peso", "graduacao"].map(
            (key) => (
              <div key={key} className="c-grupo-info flex-colum gap-p">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  name={key}
                  type={key === "idade" || key === "peso" ? "number" : "text"}
                  value={formData[key] || ""}
                  onChange={handleChange}
                />
              </div>
            )
          )}
        </div>

        <button className="btn" onClick={handleSave}>
          Salvar Dados
        </button>

        <hr />

        <h3>Trocar Senha</h3>

        <label>Senha Atual</label>
        <input
          type="password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />

        <label>Nova Senha</label>
        <input
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        <label>Confirmar Nova Senha</label>
        <input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
        />

        <button className="btn" onClick={handlePasswordChange}>
          Alterar Senha
        </button>
      </div>
    </section>
  );
};

export default ConfigUser;
