// React
import React from "react";

// Components
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";

// Styles
import "../../styles/Loja.scss";

const Loja = () => {
  // dados das categorias e subcategorias
  const categoriesData = [
    { name: "Jiu Jitsu", subcategories: ["Kimonos", "Protetor Bucal", "Rash Guard"] },
    { name: "Muay Thai", subcategories: ["Luvas", "Caneleiras", "Cotoveleiras"] },
    { name: "Boxe", subcategories: ["Luvas", "Capacetes", "Bandagens"] },
    { name: "Vestuario", subcategories: ["Camisas", "Bonés", "Rash Guard", "Kimonos", "Shorts", "Blusas", "Calças"] },
  ];

  // estado da categoria e subcategoria selecionada
  const [selectedCategory, setSelectedCategory] = React.useState(categoriesData[0].name);

  // inicializa a subcategoria selecionada com a primeira subcategoria da primeira categoria
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(categoriesData[0].subcategories[0]);

  // estado do modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalProduct, setModalProduct] = React.useState(null);

  // função para abrir o modal com o produto selecionado
  const handleClickProduct = (product) => {
    setModalProduct(product);
    setModalOpen(true);
  };

  return (
    <section className="loja flex container gap-lg">
      <Sidebar
        categoriesData={categoriesData}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
      />

      <div className="loja-content">
        <ProductList subcategory={selectedSubcategory} onClickProduct={handleClickProduct} />
      </div>

      {/* MODAL */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={modalProduct}
      />
    </section>
  );
};

export default Loja;
