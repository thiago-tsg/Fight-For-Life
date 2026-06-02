// Components
import { db } from "../../firebase/FireStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../firebase/AuthContext";

// React
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // para gerar ids únicos

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // Estados do carrinho
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carrega o carrinho do Firestore ao logar
  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        console.log("🔹 Carrinho carregado do Firestore:", cartSnap.data().items);
        setCartItems(cartSnap.data().items || []);
      } else {
        await setDoc(cartRef, { items: [] });
        setCartItems([]);
      }

      setLoading(false);
    };

    loadCart();
  }, [user]);

  // Função para salvar o carrinho
  const saveCart = async (items) => {
    if (!user) return;
    const cartRef = doc(db, "carts", user.uid);
    await setDoc(cartRef, { items });
    console.log("💾 Carrinho salvo no Firestore:", items);
  };

  // Função para adicionar produto
  const addToCart = (product) => {
    if (!user) return alert("Você precisa estar logado!");

    setCartItems((prev) => {

      const existingProduct = prev.find(
        item =>
          item.name === product.name &&
          item.color === product.color &&
          item.size === product.size
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = prev.map(item =>
          item.uid === existingProduct.uid
            ? {
              ...item,
              quantity: item.quantity + product.quantity
            }
            : item
        );
      } else {
        updatedCart = [
          ...prev,
          {
            ...product,
            uid: uuidv4(),
          }
        ];
      }

      saveCart(updatedCart);

      return updatedCart;
    });
  };

  // Função para remover produto
  const removeFromCart = (uid) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.uid !== uid);
      saveCart(updatedCart);
      console.log("❌ Produto removido:", updatedCart);
      return updatedCart;
    });
  };

  // Função para limpar carrinho
  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
    console.log("🧹 Carrinho limpo");
  };

  // Calcula o total do carrinho
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);