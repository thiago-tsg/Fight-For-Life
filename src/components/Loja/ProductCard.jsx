// Components
import { useCart } from "./CartContext";

// React
import { v4 as uuidv4 } from "uuid"

const ProductCard = ({ product, onClickProduct }) => {
  const { addToCart } = useCart();

  // Pegando cor e tamanho padrão, caso existam
  const defaultColor = product.colors?.[0] || null;
  const defaultSize = product.sizes?.[0] || null;

  // Função para adicionar ao carrinho
  return (
    <div className="product-card flex-colum gap-md">
      <div className="c-img-product">
        <img src={product.img} alt={product.name} className="product-image" />
      </div>
      <h4 className="titulo">{product.name}</h4>
      <p className="preco">R$ {product.price}</p>
      <div className="buttons flex gap-md">
        {/* Botão Adicionar ao Carrinho */}
        <button
          className="btn-product"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              uid: uuidv4(),
              name: product.name,
              price: product.price,
              img: product.img,
              quantity: 1,
              color: defaultColor,
              size: defaultSize
            });
          }}
        >
          Adicionar
        </button>

        {/* Botão Detalhes / Modal */}
        <button
          className="btn-product btn-details"
          onClick={(e) => {
            e.stopPropagation(); // previne qualquer clique pai
            onClickProduct(product); // abre o modal
          }}
        >
          Detalhes
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
