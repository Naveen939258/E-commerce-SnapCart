import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = (props) => {
  return (
    <div className="item-pics">
      <Link to={`/product/${props.id}`} onClick={() => window.scrollTo(0, 0)}>
        <img src={props.image} alt={props.name} />
      </Link>

      <p className="item-name">{props.name}</p>
      <p className="item-brand">{props.brand}</p> {/* 🔥 Brand added */}

      <div className="item-prices">
        <div className="item-price-new">
          ${props.new_price}
        </div>
        <div className="item-price-old">
          ${props.old_price}
        </div>
      </div>
    </div>
  );
};

export default Item;
