// Components
import { useCart } from "./CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, total } = useCart();

  if (cartItems.length === 0) return <p className="center">Seu carrinho está vazio.</p>;

  // TODO: transformar em sidebar ou modal
  return (
    <div className="cart flex-colum gap-lg">
      <h2 className="titulo center">Carrinho de Compras</h2>
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
      <div className="cart-footer flex space-between">
        <strong>Total: R$ {total}</strong>
        <button className="btn" onClick={clearCart}>Limpar Carrinho</button>
      </div>
    </div>
  );
};

export default Cart;
