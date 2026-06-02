// Components
import { useCart } from "./CartContext";

const CartSidebar = () => {
  // Acessando o contexto do carrinho
  const { cartItems, removeFromCart, clearCart, total, isCartOpen, toggleCart } = useCart();

  // Sidebar do carrinho, que aparece/desaparece com base no estado isCartOpen
  return (
    <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
      <div className="cart-header flex space-between center">
        <h2 className="titulo">Carrinho</h2>
        <button className="btn" onClick={toggleCart}>X</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="center mt-md">Carrinho vazio</p>
      ) : (
        <>
          <div className="cart-items flex-colum gap-md">
            {cartItems.map((item) => (
              <div key={item.name} className="cart-item flex space-between center">
                <div className="cart-info flex gap-md">
                  <img src={item.img} alt={item.name} width={60} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>Qtd: {item.quantity}</p>
                    <p>R$ {item.price * item.quantity}</p>
                  </div>
                </div>
                <button className="btn" onClick={() => removeFromCart(item.name)}>Remover</button>
              </div>
            ))}
          </div>

          <div className="cart-footer flex space-between center mt-lg">
            <strong>Total: R$ {total}</strong>
            <button className="btn" onClick={clearCart}>Limpar</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
