import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";

import { useCart } from "./CartContext";

import "../../styles/ProductModal.scss";


const colorMap = {
  Azul: "#1E90FF",
  Branco: "#FFFFFF",
  Preto: "#000000",
  Rosa: "#FF69B4",
  Amarelo: "#FFD700",
  Vermelho: "#FF0000",
  Verde: "#235c23",
  Cinza: "#808080",
};

const ProductModal = ({ open, onClose, product }) => {
  const { addToCart } = useCart();
  const thumbRef = useRef(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!open || !product) return;

    const firstImage =
      product.img || product.extraImages?.[0] || "";

    setMainImage(firstImage); setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setQuantity(1);
  }, [open, product]);

  const images = product
    ? [product.img, ...(product.extraImages || [])].filter(Boolean)
    : [];

  const formatPrice = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));

  const scrollThumbs = (direction) => {
    thumbRef.current?.scrollBy({
      left: direction * 150,
      behavior: "smooth",
    });
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copiado!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível copiar o link.");
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;

      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;

      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;

      case "instagram":
        alert(
          "O Instagram não permite compartilhamento direto pela web."
        );
        break;

      case "tiktok":
        alert(
          "O TikTok não permite compartilhamento direto pela web."
        );
        break;

      default:
        copyLink(url);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      uid: uuidv4(),
      name: product.name,
      price: product.price,
      img: mainImage,
      quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const changeImage = (direction) => {
    if (!images.length) return;

    const newIndex =
      (currentImageIndex + direction + images.length) %
      images.length;

    setCurrentImageIndex(newIndex);
    setMainImage(images[newIndex]);
  };

  if (!product) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex-center container"
    >
      <Box>
        <div className="header-modal-product flex space-between">
          <Typography variant="h5" className="titulo">
            {product.name}
          </Typography>

          <IconButton
            onClick={onClose}
            className="fechar"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="product-modal grid gap-xl">
          <section className="cg-img-product-modal">
            <div className="c-img-product-modal flex-colum gap-lg">
              <div className="c-img-principal-modal flex-center">
                <img
                  src={mainImage}
                  alt={product.name}
                />
              </div>

              {images.length > 0 && (
                <div className="thumbnail-carousel flex-center gap-md">
                  <button
                    className="arrow left"
                    onClick={() => changeImage(-1)}                  >
                    &#10094;
                  </button>

                  <div
                    ref={thumbRef}
                    className="flex gap-md"
                  >
                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setMainImage(img);
                        }}
                      />
                    ))}
                  </div>

                  <button
                    className="arrow right"
                    onClick={() => changeImage(1)}                  >
                    &#10095;
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="cg-info-product-modal flex-colum gap-md">
            {product.tag && (
              <div className="product-tag">
                {product.tag}
              </div>
            )}

            <div className="price-area">
              {product.oldPrice && (
                <Typography className="oldPrice">
                  {formatPrice(product.oldPrice)}
                </Typography>
              )}

              <Typography className="price">
                {formatPrice(product.price)}
              </Typography>
            </div>

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

            {product.colors?.length > 0 && (
              <div className="info-section">
                <span className="caracteristicas">
                  Cor
                </span>

                <div className="product-colors flex gap-p">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color
                        ? "selected"
                        : ""
                        }`}
                      title={color}
                      style={{
                        backgroundColor:
                          colorMap[color] || color,
                      }}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="info-section">
                <span className="caracteristicas">
                  Tamanho
                </span>

                <div className="product-sizes flex gap-p">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size
                        ? "selected"
                        : ""
                        }`}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="compartilhar flex gap-md">
              <p>Compartilhar</p>

              <div className="share-buttons flex gap-p">
                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("clipboard")
                  }
                >
                  <img
                    src="/icon/link.svg"
                    alt="Copiar link"
                  />
                </button>

                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("facebook")
                  }
                >
                  <img
                    src="/icon/facebook.svg"
                    alt="Facebook"
                  />
                </button>

                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("twitter")
                  }
                >
                  <img
                    src="/icon/x.svg"
                    alt="X"
                  />
                </button>

                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("whatsapp")
                  }
                >
                  <img
                    src="/icon/whatsapp.svg"
                    alt="WhatsApp"
                  />
                </button>

                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("instagram")
                  }
                >
                  <img
                    src="/icon/instagram.svg"
                    alt="Instagram"
                  />
                </button>

                <button
                  className="btn-product-rede-sociais"
                  onClick={() =>
                    handleShare("tiktok")
                  }
                >
                  <img
                    src="/icon/tiktok.svg"
                    alt="TikTok"
                  />
                </button>
              </div>
            </div>

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

            <button
              className="btn"
              onClick={handleAddToCart}
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