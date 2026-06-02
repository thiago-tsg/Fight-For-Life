import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { useAuth } from "../firebase/AuthContext";
import "../styles/Login.scss";

const Login = ({ open, onClose }) => {
    const { auth } = useAuth(); // ← AGORA ESTÁ NO LUGAR CERTO
    const provider = new GoogleAuthProvider();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [showSenha, setShowSenha] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, senha);
                onClose();
            } else {
                if (senha !== confirmSenha) {
                    setError("As senhas não coincidem.");
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, senha);
                onClose();
            }
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("Esse email já está em uso.");
            } else if (err.code === "auth/weak-password") {
                setError("A senha precisa ter no mínimo 6 caracteres.");
            } else if (err.code === "auth/invalid-credential") {
                setError("Email ou senha incorretos.");
            } else {
                setError("Ocorreu um erro. Tente novamente.");
            }
        }
    };

    const loginWithGoogle = async () => {
        setError("");
        try {
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err) {
            setError("Erro ao entrar com Google.");
        }
    };

    return (
        <div className="login-modal-overlay flex-center container">
            <div className="login-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                <h2 className="titulo-login center">
                    {isLogin ? "Entrar" : "Criar conta"}
                </h2>

                {error && <p className="error center">{error}</p>}

                <form onSubmit={handleSubmit} className="flex-colum gap-md">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Senha</label>
                    <div className="senha-wrapper flex">
                        <input
                            type={showSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                        <span
                            className="toggle"
                            onClick={() => setShowSenha(!showSenha)}
                        >
                            {showSenha ? (
                                // olho com risco (senha visível)
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-5 0-9.27-3-11-7a11.18 11.18 0 0 1 5.64-5.64" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                // olho aberto (senha oculta)
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                                </svg>
                            )}
                        </span>
                    </div>

                    {!isLogin && (
                        <>
                            <label>Confirmar senha</label>
                            <input
                                type={showSenha ? "text" : "password"}
                                value={confirmSenha}
                                onChange={(e) => setConfirmSenha(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <button className="btn" type="submit">
                        {isLogin ? "Entrar" : "Cadastrar"}
                    </button>
                </form>

                <div className="divider center">ou</div>

                <button className="btn" onClick={loginWithGoogle}>
                    Entrar com Google
                </button>

                <p className="toggle-text center">
                    {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Cadastre-se" : "Entrar"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
