// Components
import ProductCard from "./ProductCard";
import { productsData } from "./productsData";

const ProductList = ({ subcategory, onClickProduct }) => {
  // Pega os produtos da subcategoria selecionada
  const products = productsData[subcategory] || [];

  // Se não houver produtos, exibe mensagem
  if (!products.length)
    return <p className="center">Nenhum produto encontrado.</p>;

  // Renderiza os produtos usando o ProductCard
  return (
    <div className="product-list grid gap-lg">
      {products.map((prod, index) => (
        <ProductCard
          key={`${subcategory}-${index}`}
          product={prod}
          onClickProduct={onClickProduct}
        />
      ))}
    </div>
  );
};

export default ProductList;
