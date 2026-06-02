import React, { useEffect, useState } from "react";
import { useAuth } from "../../firebase/AuthContext";
import { db } from "../../firebase/FireStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
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

  useEffect(() => {
    if (!loadingAuth && !user) navigate("/");
  }, [loadingAuth, user, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      const userRef = doc(db, "usuarios", user.uid);
      const snap = await getDoc(userRef);

      const defaultFormData = {
        nome: "",
        email: user.email || "",
        telefone: "",
        endereco: "",
        idade: "",
        peso: "",
        graduacao: "",
        fotoURL: "",
      };

      if (snap.exists()) {
        const data = snap.data();

        setFormData({
          nome: data.nome || "",
          email: data.email || user.email || "",
          telefone: data.telefone || "",
          endereco: data.endereco || "",
          idade: data.idade || "",
          peso: data.peso || "",
          graduacao: data.graduacao || "",
          fotoURL: data.fotoURL || "",
        });
      } else {
        await setDoc(userRef, defaultFormData);
        setFormData(defaultFormData);
      }

      setLoading(false);
    };

    loadUserData();
  }, [user]);

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handlePhotoChange = (e) => {
    if (!user) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result;

      setFormData((prev) => ({
        ...prev,
        fotoURL: base64String,
      }));

      try {
        await setDoc(
          doc(db, "usuarios", user.uid),
          { fotoURL: base64String },
          { merge: true }
        );

        alert("Foto atualizada com sucesso!");
      } catch (error) {
        console.error(error);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "usuarios", user.uid),
        formData,
        { merge: true }
      );

      alert("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return alert("Preencha todos os campos.");
    }

    if (newPass !== confirmPass) {
      return alert("As senhas não coincidem.");
    }

    try {
      const credential =
        EmailAuthProvider.credential(
          user.email,
          oldPass
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      await updatePassword(user, newPass);

      alert("Senha alterada com sucesso!");

      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      console.error(error);
      alert("Senha atual incorreta.");
    }
  };

  if (loadingAuth || loading || !user)
    return <p>Carregando...</p>;

  return (
    <section className="config-user container">
      <div className="cg-config-user">

        <div className="profile-card">

          <h1>Meu Perfil</h1>

          <div className="foto-area">
            <div className="c-img-config-user">
              <img
                src={
                  formData.fotoURL ||
                  "/default-user.png"
                }
                alt="Usuário"
                className="foto-preview"
              />
            </div>

            <label className="btn">
              Alterar Foto
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          </div>

          <div className="email-box">
            <label>Email</label>
            <input
              value={formData.email}
              disabled
            />
          </div>

          <div className="cg-grupo-info">
            {[
              "nome",
              "telefone",
              "endereco",
              "idade",
              "peso",
              "graduacao",
            ].map((key) => (
              <div
                key={key}
                className="c-grupo-info"
              >
                <label>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1)}
                </label>

                <input
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  type={
                    key === "idade" ||
                    key === "peso"
                      ? "number"
                      : "text"
                  }
                />
              </div>
            ))}
          </div>

          <button
            className="btn save-btn"
            onClick={handleSave}
          >
            Salvar Dados
          </button>
        </div>

        <div className="password-card">

          <h2>Segurança</h2>

          <input
            type="password"
            placeholder="Senha Atual"
            value={oldPass}
            onChange={(e) =>
              setOldPass(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Nova Senha"
            value={newPass}
            onChange={(e) =>
              setNewPass(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Confirmar Nova Senha"
            value={confirmPass}
            onChange={(e) =>
              setConfirmPass(e.target.value)
            }
          />

          <button
            className="btn"
            onClick={handlePasswordChange}
          >
            Alterar Senha
          </button>
        </div>

      </div>
    </section>
  );
};

export default ConfigUser;