// React
import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

// Components
import { useCart } from "./CartContext";

// Styles
import "../../styles/ProductModal.scss";

const ProductModal = ({ open, onClose, product }) => {
  if (!product) return null;

  // mapa de cores para converter nomes de cores em códigos hexadecimais
  const colorMap = {
    Azul: "#1E90FF",
    Branco: "#FFFFFF",
    Preto: "#000000",
    Rosa: "#FF69B4",
    Amarelo: "#FFD700",
    Vermelho: "#FF0000",
    Verde: "#235c23ff",
    Cinza: "#808080",
  };

  // contexto do carrinho
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(product.img);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1); // quantidade selecionada

  // resetar estado do modal quando abrir um novo produto
  useEffect(() => {
    if (open && product) {
      setMainImage(product.img);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
    }
  }, [open, product]);

  // garantir que a imagem principal seja sempre a primeira do array (caso haja imagens extras)
  const extraImages = product?.extraImages || [];

  // função para compartilhar o produto nas redes sociais
  const handleShare = (platform) => {
    const url = window.location.href;
    switch (platform) {
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}`, "_blank");
        break;
      case "instagram":
        alert("Instagram não permite compartilhamento direto via web. Copie o link manualmente.");
        break;
      case "tiktok":
        alert("TikTok não permite compartilhamento direto via web. Copie o link manualmente.");
        break;
      default:
        navigator.clipboard.writeText(url);
        alert("Link copiado!");
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="flex-center">
      <Box>
        {/* Header */}
        <div className="header-modal-product flex space-between">
          {/* Titulo */}
          <Typography variant="h5" className="titulo">{product.name}</Typography>

          {/* Fechar */}
          <IconButton onClick={onClose} className="fechar">
            <CloseIcon />
          </IconButton>
        </div>

        <div className="product-modal grid2col gap-xl">
          {/* Imagens */}
          <section className="cg-img-product-modal">
            <div className="c-img-product-modal flex-colum gap-md">

              {/* Imagem principal */}
              <div className="c-img-principal-modal">
                <img src={mainImage} alt={product.name} />
              </div>

              {/* Miniaturas */}
              {[product.img, ...extraImages].length > 0 && (
                <div className="thumbnail-carousel flex-center gap-md">
                  <button
                    className="arrow left"
                    onClick={() => {
                      const container = document.getElementById("thumb-scroll");
                      container.scrollBy({ left: -150, behavior: "smooth" });
                    }}
                  >
                    &#10094;
                  </button>

                  <div
                    id="thumb-scroll"
                    className="flex gap-md"
                  >
                    {[product.img, ...extraImages].map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                  </div>

                  <button
                    className="arrow right"
                    onClick={() => {
                      const container = document.getElementById("thumb-scroll");
                      container.scrollBy({ left: 150, behavior: "smooth" });
                    }}
                  >
                    &#10095;
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Informações */}
          <section className="cg-info-product-modal flex-colum gap-md">

            {/* Badge */}
            {product.tag && (
              <div className="product-tag">
                {product.tag}
              </div>
            )}

            {/* Preços */}
            <div className="price-area">
              {product.oldPrice && (
                <Typography className="oldPrice">
                  R$ {product.oldPrice}
                </Typography>
              )}

              <Typography className="price">
                R$ {product.price}
              </Typography>
            </div>

            {/* Características */}
            {product.features && (
              <div className="info-section">
                <span className="caracteristicas">
                  Características
                </span>

                <Typography>
                  {product.features}
                </Typography>
              </div>
            )}

            {/* Material */}
            {product.materials && (
              <div className="info-section">
                <span className="caracteristicas">
                  Composição
                </span>

                <Typography>
                  {product.materials}
                </Typography>
              </div>
            )}

            {/* Observações */}
            {product.notes && (
              <div className="info-section">
                <span className="caracteristicas">
                  Observações
                </span>

                <Typography>
                  {product.notes}
                </Typography>
              </div>
            )}

            {/* Variações */}
            <div className="info-section">

              {/* Cores */}
              {product.colors && product.colors.length > 0 && (
                <>
                  <span className="caracteristicas">
                    Cor
                  </span>

                  <div className="product-colors flex gap-p">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? "selected" : ""
                          }`}
                        style={{
                          backgroundColor:
                            colorMap[color] || color.toLowerCase(),
                        }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Tamanhos */}
              {product.sizes && product.sizes.length > 0 && (
                <>
                  <span
                    className="caracteristicas"
                    style={{ marginTop: "1rem" }}
                  >
                    Tamanho
                  </span>

                  <div className="product-sizes flex gap-p">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? "selected" : ""
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Compartilhar */}
            <div className="compartilhar flex gap-md">
              <p>Compartilhar</p>

              <div className="share-buttons flex gap-p">
                <button
                  onClick={() => handleShare("clipboard")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/link.svg" alt="Copiar link" />
                </button>

                <button
                  onClick={() => handleShare("facebook")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/facebook.svg" alt="Facebook" />
                </button>

                <button
                  onClick={() => handleShare("twitter")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/x.svg" alt="Twitter" />
                </button>

                <button
                  onClick={() => handleShare("whatsapp")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/whatsapp.svg" alt="WhatsApp" />
                </button>

                <button
                  onClick={() => handleShare("instagram")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/instagram.svg" alt="Instagram" />
                </button>

                <button
                  onClick={() => handleShare("tiktok")}
                  className="btn-product-rede-sociais"
                >
                  <img src="/icon/tiktok.svg" alt="TikTok" />
                </button>
              </div>
            </div>

            {/* Quantidade */}
            <div className="quantity-selector">
              <span className="caracteristicas">
                Quantidade
              </span>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    setQuantity((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((prev) => prev + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              className="btn"
              onClick={() =>
                addToCart({
                  uid: uuidv4(),
                  name: product.name,
                  price: product.price,
                  img: mainImage,
                  quantity,
                  color: selectedColor,
                  size: selectedSize,
                })
              }
            >
              Adicionar ao Carrinho
            </button>
          </section>
        </div>
      </Box>
    </Modal>
  );
};

export default ProductModal;
