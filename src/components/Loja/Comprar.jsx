import { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Comprar.scss";

const Comprar = () => {
    const { cartItems, removeFromCart, clearCart, total, loading } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome: "",
        endereco: "",
        cidade: "",
        cep: "",
        telefone: "",
        pagamento: "cartao",
    });

    const [modalOpen, setModalOpen] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFinalizarCompra = () => {
        if (!form.nome || !form.endereco || !form.cidade || !form.cep || !form.telefone) {
            return alert("Por favor, preencha todos os campos de envio.");
        }

        console.log("Compra finalizada:", { cartItems, total, form });

        alert("Compra finalizada com sucesso!");
        clearCart();
        navigate("/");
    };

    if (loading) return <p className="center mt-lg">Carregando carrinho...</p>;
    if (cartItems.length === 0) return <p className="center mt-lg">Seu carrinho está vazio.</p>;

    return (
        <section className="comprar container flex-colum gap-xl">
            <h2 className="titulo center">Finalizar Compra</h2>

            {/* Botão para abrir modal */}
            <button className="btn-cart-modal" onClick={() => setModalOpen(true)}>
                Ver Produtos do Carrinho
            </button>

            {/* Modal do Carrinho */}
            <div className={`modal-cart ${modalOpen ? "active" : ""}`}>
                <div className="modal-content">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-card">
                            <img src={item.img} alt={item.name} />
                            <h4>{item.name}</h4>
                            <p>Qtd: {item.quantity}</p>
                            <p>R$ {item.price * item.quantity}</p>
                            <button
                                className="btn"
                                onClick={() => removeFromCart(item.uid)}
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                    <button className="close-modal" onClick={() => setModalOpen(false)}>
                        ×
                    </button>
                </div>
            </div>

            {/* Formulário de envio */}
            <div className="checkout-form flex-colum gap-lg">
                <h3>Informações de Envio</h3>
                <input type="text" name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} />
                <input type="text" name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} />
                <input type="text" name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
                <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} />
                <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />

                <h3>Forma de Pagamento</h3>
                <select name="pagamento" value={form.pagamento} onChange={handleChange}>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="pix">PIX</option>
                </select>
            </div>

            {/* Total e finalizar */}
            <div className="cart-footer flex space-between">
                <strong>Total: R$ {total}</strong>
                <button className="btn-primary" onClick={handleFinalizarCompra}>
                    Finalizar Compra
                </button>
            </div>
        </section>
    );
};

export default Comprar;
