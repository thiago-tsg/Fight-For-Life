// Components
import CategoryItem from "./CategoryItem";

const Sidebar = ({ categoriesData, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory }) => {
  return (
    <aside className="sidebar flex-colum gap-md">
      <h2 className="titulo">Categorias</h2>
      <ul className="sidebar-list flex-colum gap-p">
        {categoriesData.map((cat) => (
          <CategoryItem
            key={cat.name}
            category={cat}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSubcategory={setSelectedSubcategory}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;