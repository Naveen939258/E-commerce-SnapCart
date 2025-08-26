
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import LoginSignup from "./Pages/LoginSignup";
import Cart from "./Pages/Cart";
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import UserProfile from './Components/Profile/UserProfile';
import AllProducts from './Components/AllProducts/AllProducts';
import Checkout from './Components/Checkout/Checkout';
import Ordered from './Components/Ordered/Ordered';
import SearchPage from './Components/SearchPage/SearchPage';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/all-products" element={<AllProducts />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path="/kids" element={<ShopCategory banner={kid_banner} category="kids" />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/order-success/:orderId" element={<Ordered />} />
          <Route path="/login" element={<LoginSignup/>} />
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
