// src/Components/Search/SearchPage.jsx
import React, { useContext, useState, useMemo } from "react";
import { ShopContext } from "../../Context/ShopContext";
import Item from "../Item/Item";
import "./SearchPage.css";

const SearchPage = () => {
  const { all_products } = useContext(ShopContext);
  const [query, setQuery] = useState("");

  // Filter products only if query is not empty
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return []; // 🔹 Empty search → no results
    const term = query.toLowerCase();
    return all_products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
    );
  }, [query, all_products]);

  return (
    <div className="search-page">
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="search-results">
        {query.trim() ? (
          filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Item
                key={product._id || product.id}
                id={product.id}
                name={product.name}
                brand={product.brand}
                image={product.image}
                new_price={product.new_price}
                old_price={product.old_price}
              />
            ))
          ) : (
            <p className="no-results">No products found</p>
          )
        ) : (
          <p className="no-results">Start typing to search products...</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
