import React, { useContext, useState } from "react";
import { ShopContext } from "../../Context/ShopContext";
import Item from "../Item/Item";
import "./AllProducts.css";

const DropdownFilter = ({ label, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (value) => {
    if (value === "all") {
      // If "all" is clicked → reset filter
      setSelected([]);
      return;
    }

    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="dropdown-filter">
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        {label} <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map((opt, i) => (
            <label key={i} className="dropdown-option">
              <input
                type="checkbox"
                value={opt}
                checked={
                  opt === "all" ? selected.length === 0 : selected.includes(opt)
                }
                onChange={() => handleChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const AllProducts = () => {
  const { all_products } = useContext(ShopContext);

  const [visibleCount, setVisibleCount] = useState(20);
  const [sortBy, setSortBy] = useState("default");

  // Multi-select filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // keep labels, not ranges

  if (!all_products || all_products.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Loading products...
      </p>
    );
  }

  // Unique categories & brands (prepend "all")
  const categories = [
    "all",
    ...new Set(all_products.map((p) => p.category).filter(Boolean)),
  ];
  const brands = [
    "all",
    ...new Set(
      all_products
        .map((p) => p.brand)
        .filter((b) => b && b.toLowerCase() !== "generic")
    ),
  ];

  // Price ranges
  const priceOptions = [
    { label: "Under ₹500", range: [0, 500] },
    { label: "₹500 - ₹2000", range: [500, 2000] },
    { label: "₹2000 - ₹5000", range: [2000, 5000] },
    { label: "₹5000+", range: [5000, 100000] },
  ];

  // Filtering logic
  let filteredProducts = all_products.filter((p) => {
    const inCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);
    const inBrand =
      selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const inPrice =
   selectedPriceRanges.length === 0 ||
  selectedPriceRanges.some((label) => {
     const range = priceOptions.find((po) => po.label === label)?.range;
     return range && p.new_price >= range[0] && p.new_price <= range[1];
   });
    return inCategory && inBrand && inPrice;
  });

  // Sorting
  switch (sortBy) {
    case "priceLowHigh":
      filteredProducts.sort((a, b) => a.new_price - b.new_price);
      break;
    case "priceHighLow":
      filteredProducts.sort((a, b) => b.new_price - a.new_price);
      break;
    case "nameAsc":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "nameDesc":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="all-products">
      <h1>All Products</h1>

      {/* Filters */}
      <div className="allproducts-filters">
        <DropdownFilter
          label="Categories"
          options={categories}
          selected={selectedCategories}
          setSelected={setSelectedCategories}
        />
        <DropdownFilter
          label="Brands"
          options={brands}
          selected={selectedBrands}
          setSelected={setSelectedBrands}
        />
        <DropdownFilter
          label="Price"
          options={priceOptions.map((p) => p.label)}
          selected={selectedPriceRanges}
          setSelected={setSelectedPriceRanges}
        />

        {/* Sort */}
        <div className="allproducts-sort">
          <p>Sort by:</p>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="nameAsc">Name: A to Z</option>
            <option value="nameDesc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="allproducts-grid">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((item, i) => (
            <Item
              key={item._id || item.id || i}
              id={item.id}
              name={item.name}
              brand={item.brand}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No products found
          </p>
        )}
      </div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <div
          className="allproducts-loadmore"
          onClick={() => setVisibleCount((prev) => prev + 15)}
        >
          Load More
        </div>
      )}
    </div>
  );
};

export default AllProducts;
