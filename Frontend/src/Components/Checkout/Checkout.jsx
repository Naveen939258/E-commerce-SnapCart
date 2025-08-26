import React, { useContext, useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import OrderSummary from "./OrderSummary";
import PaymentForm from "./PaymentForm";
import { ShopContext } from "../../Context/ShopContext";
import "./Checkout.css";

const Checkout = () => {
  const { getTotalCartAmount } = useContext(ShopContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null); // ✅ track editing
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = getTotalCartAmount();
  const total = Math.max(subtotal - promoDiscount, 0);

  const getToken = () => localStorage.getItem("token") || "";

  // Fetch addresses from backend
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setAddresses([]);
        setSelectedAddress(null);
        setShowForm(true);
        return;
      }

      const res = await fetch(`http://localhost:2005/address/list`, {
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setAddresses([]);
        setSelectedAddress(null);
        setShowForm(true);
        return;
      }

      const data = await res.json();
      if (data?.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
        setAddresses(data.addresses);
        const def = data.addresses.find((a) => a.isDefault);
        setSelectedAddress(def || data.addresses[0]);
        setShowForm(false);
      } else {
        setAddresses([]);
        setSelectedAddress(null);
        setShowForm(true);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      setAddresses([]);
      setSelectedAddress(null);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch + login/logout listener
  useEffect(() => {
    fetchAddresses();
    const onLoginChange = () => fetchAddresses();
    window.addEventListener("loginStatusChanged", onLoginChange);
    return () => window.removeEventListener("loginStatusChanged", onLoginChange);
  }, []);

  // ✅ Save or update address
  const handleSaveAddress = async (address) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Please log in to save an address.");
        return;
      }

      const url = editingAddress
        ? `http://localhost:2005/address/update/${editingAddress._id}`
        : `http://localhost:2005/address/add`;

      const method = editingAddress ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(address),
      });

      const data = await res.json();
      if (data?.success) {
        alert(editingAddress ? "Address updated!" : "Address added!");
        setEditingAddress(null);
        setShowForm(false);
        fetchAddresses(); // ✅ refresh after save
      } else {
        alert(data?.message || "Failed to save address");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    }
  };

  // ✅ Delete address
  const handleDeleteAddress = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Please log in to delete an address.");
        return;
      }

      const res = await fetch(`http://localhost:2005/address/delete/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      });

      const data = await res.json();
      if (data?.success) {
        alert("Address deleted!");
        fetchAddresses(); // refresh list, backend auto-handles default
      } else {
        alert(data?.message || "Failed to delete address");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-sections">
        {/* Address Section */}
        <div className="checkout-address">
          <h2>Shipping Address</h2>
          {loading ? (
            <p>Loading address…</p>
          ) : addresses.length > 0 && !showForm ? (
            <div className="saved-addresses">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`address-card ${
                    selectedAddress?._id === addr._id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <p>
                    <strong>{addr.name}</strong>{" "}
                    {addr.isDefault && <span className="default-tag">Default</span>}
                  </p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>{addr.phone}</p>
                  <div className="address-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(addr);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr._id);
                      }}
                      style={{ marginLeft: "8px", color: "red" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button className="add-new-btn" onClick={() => setShowForm(true)}>
                + Add New Address
              </button>
            </div>
          ) : (
            <AddressForm
              onSave={handleSaveAddress}
              editingAddress={editingAddress} // ✅ match prop name in AddressForm.js
              onCancel={() => {
                setEditingAddress(null);
                setShowForm(false);
              }}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <OrderSummary
            subtotal={subtotal}
            total={total}
            promoDiscount={promoDiscount}
            setPromoDiscount={setPromoDiscount}
          />
        </div>
      </div>

      {/* Payment Section */}
      <div className="checkout-payment">
        <h2>Payment</h2>
        {selectedAddress ? (
          <PaymentForm address={selectedAddress} total={total} />
        ) : (
          <p className="error">Please select or add an address to proceed.</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
