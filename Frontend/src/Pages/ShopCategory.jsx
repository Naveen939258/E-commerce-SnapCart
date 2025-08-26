import React, { useContext, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";

const DropdownFilter = ({ label, options, selected, setSelected }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (value) => {
    if (value === "all") {
      setSelected([]); // reset to all
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
                  opt === "all"
                    ? selected.length === 0
                    : selected.includes(opt)
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

const ShopCategory = (props) => {
  const { all_products } = useContext(ShopContext);

  const [visibleCount, setVisibleCount] = useState(16);
  const [sortBy, setSortBy] = useState("default");

  // filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]); // store labels

  if (!all_products) {
    return (
      <div className="shop-category">
        <img
          className="shopcategory-banner"
          src={props.banner}
          alt="Category Banner"
        />
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Loading products...
        </p>
      </div>
    );
  }

  // Step 1: filter by category (props.category)
  let categoryProducts = all_products.filter(
    (item) => item.category?.toLowerCase() === props.category?.toLowerCase()
  );

  // Step 2: get unique brands for this category
  const brands = [
    "all",
    ...new Set(
      categoryProducts
        .map((p) => p.brand)
        .filter((b) => b && b.toLowerCase() !== "generic")
    ),
  ];

  // Step 3: price options
  const priceOptions = [
    { label: "Under ₹500", range: [0, 500] },
    { label: "₹500 - ₹2000", range: [500, 2000] },
    { label: "₹2000 - ₹5000", range: [2000, 5000] },
    { label: "₹5000+", range: [5000, 100000] },
  ];

  // Step 4: filtering by brand & price
  let filteredProducts = categoryProducts.filter((p) => {
    const inBrand =
      selectedBrands.length === 0 || selectedBrands.includes(p.brand);

    const inPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((label) => {
        const range = priceOptions.find((po) => po.label === label)?.range;
        return range && p.new_price >= range[0] && p.new_price <= range[1];
      });

    return inBrand && inPrice;
  });

  // Step 5: sorting
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
    case "newest":
      filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      break;
  }

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="shop-category">
      <img
        className="shopcategory-banner"
        src={props.banner}
        alt="Category Banner"
      />

      {/* Filters + Sort + Count */}
      <div className="shopcategory-indexSort">
        <p>
          <span>
            Showing 1–
            {Math.min(visibleCount, filteredProducts.length)}
          </span>{" "}
          out of {filteredProducts.length} products
        </p>

        <div className="shopcategory-filters">
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

          <div className="shopcategory-sort">
            Sort by{" "}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="shopcategory-products">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((item, i) => (
            <Item
              key={item.id || i}
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
          className="shopcategory-loadmore"
          onClick={() => setVisibleCount((prev) => prev + 12)}
        >
          Load More
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
