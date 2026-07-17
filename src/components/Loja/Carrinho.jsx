// src/components/Loja/Carrinho.jsx

import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useState, useEffect } from "react";

import "../../styles/Carrinho.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Efeito from "../EfeitoComponent";


const Carrinho = () => {
  const { cartItems, removeFromCart, clearCart, total } = useCart();

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  const handleComprar = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    navigate("/checkout", {
      state: { cartItems }
    });
  };

  return (
    <section className="carrinho container">
      {cartItems.length === 0 ? (
        <div className="empty-cart flex-colum gap-md">
          <h2>Seu carrinho está vazio</h2>

          <p>
            Adicione alguns produtos para continuar
            suas compras.
          </p>
        </div>
      ) : (
        <div className="cg-carrinho-product-total">
          {/* MOBILE */}
          {isMobile ? (
            <Swiper
              className="cart-items"
              spaceBetween={15}
              slidesPerView={"auto"}
              grabCursor={true}
            >
              {cartItems.map((item) => (
                <SwiperSlide key={item.uid}>
                  <div className="cart-item">
                    <div className="cart-item-info">
                      <img
                        src={item.img}
                        alt={item.name}
                      />

                      <div className="cart-item-actions flex-colum gap-p">
                        <h4>{item.name}</h4>

                        {item.color && (
                          <p>Cor: {item.color}</p>
                        )}

                        {item.size && (
                          <p>Tamanho: {item.size}</p>
                        )}

                        <p>
                          Preço unitário:
                          {" "}
                          R$ {Number(item.price).toFixed(2)}
                        </p>

                        <p className="quantity">
                          Quantidade:
                          {" "}
                          {item.quantity}
                        </p>

                        <p className="quantity">
                          Subtotal:
                          {" "}
                          R$
                          {" "}
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      className="remove"
                      onClick={() =>
                        removeFromCart(item.uid)
                      }
                    >
                      Remover
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* DESKTOP */
            <Efeito>
              <div className="cart-items grid2col">
                {cartItems.map((item) => (
                  <div
                    key={item.uid}
                    className="cart-item"
                  >
                    <div className="cart-item-info">
                      <img
                        src={item.img}
                        alt={item.name}
                      />
                      <div className="cart-item-actions flex-colum gap-p">
                        <h4>{item.name}</h4>
                        {item.color && (
                          <p>Cor: {item.color}</p>
                        )}
                        {item.size && (
                          <p>Tamanho: {item.size}</p>
                        )}
                        <p>
                          Preço unitário:
                          {" "}
                          R$ {Number(item.price).toFixed(2)}
                        </p>
                        <p className="quantity">
                          Quantidade:
                          {" "}
                          {item.quantity}
                        </p>
                        <p className="quantity">
                          Subtotal:
                          {" "}
                          R$
                          {" "}
                          {(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="remove"
                      onClick={() =>
                        removeFromCart(item.uid)
                      }
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </Efeito>
          )}

          {/* RESUMO */}
          <Efeito>
            <div className="cart-footer flex-colum gap-md">
              <h3>Resumo do Pedido</h3>
              <div className="resume-line">
                <span>Itens</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="resume-line">
                <span>Entrega</span>
                <span>A combinar</span>
              </div>
              <div className="resume-total">
                <span>Total</span>
                <strong>
                  R$ {Number(total).toFixed(2)}
                </strong>
              </div>
              <div className="cart-buttons flex-colum gap-md">
                <button
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </button>
                <button
                  className="btn-primary"
                  onClick={handleComprar}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </Efeito>
        </div>
      )}
    </section>
  );
};

export default Carrinho;