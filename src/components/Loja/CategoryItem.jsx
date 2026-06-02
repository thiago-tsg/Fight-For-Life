// Componente para exibir cada categoria e suas subcategorias
const CategoryItem = ({ category, selectedCategory, setSelectedCategory, setSelectedSubcategory }) => {
  // Verifica se a categoria atual é a selecionada para abrir ou fechar
  const isOpen = selectedCategory === category.name;

  // Função para lidar com clique na categoria
  const handleCategoryClick = () => {
    if (isOpen) {
      // Fecha categoria
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      // Seleciona categoria e primeira subcategoria automaticamente
      setSelectedCategory(category.name);
      setSelectedSubcategory(category.subcategories[0]);
    }
  };

  // Renderiza a categoria e suas subcategorias se estiver aberta
  return (
    <li className="category-item">
      <div
        className={`category-name ${isOpen ? "open" : ""} cursor`}
        onClick={handleCategoryClick}
      >
        {category.name}
      </div>
      {isOpen && (
        <ul className="subcategory-list flex-colum gap-p">
          {category.subcategories.map((sub) => (
            <li
              key={sub}
              className="subcategory-item cursor"
              onClick={() => setSelectedSubcategory(sub)}
            >
              {sub}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default CategoryItem;