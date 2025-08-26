import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressForm from "../Checkout/AddressForm"; // ✅ reuse existing form
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [tab, setTab] = useState("orders"); // ✅ active tab
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  // Avatar helper
  const getGender = (name) => {
    if (!name) return "male";
    const maleLetters = "ABCDEFGHJKLMN";
    const firstLetter = name.charAt(0).toUpperCase();
    return maleLetters.includes(firstLetter) ? "male" : "female";
  };

  // Fetch user info
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:2005/getuser", {
          headers: { "auth-token": token },
        })
        .then((res) => {
          const userData = res.data;
          if (!userData.avatar) {
            const seed = encodeURIComponent(userData.name);
            const gender = getGender(userData.name);
            userData.avatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&gender=${gender}`;
          }
          setUser(userData);
          setFormData({ name: userData.name, email: userData.email });
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  // Fetch orders
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:2005/orders/me", {
          headers: { "auth-token": token },
        })
        .then((res) => {
          if (res.data.success) setOrders(res.data.orders);
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:2005/address/list", {
        headers: { "auth-token": token },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  useEffect(() => {
    if (tab === "addresses" && token) fetchAddresses();
  }, [tab, token]);

  // Save address
  const handleSaveAddress = async (address) => {
    try {
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
      if (data.success) {
        fetchAddresses();
        setEditingAddress(null);
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`http://localhost:2005/address/delete/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token },
      });
      const data = await res.json();
      if (data.success) fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p style={{ textAlign: "center" }}>Loading profile...</p>;

  return (
    <div className="user-profile-container">
      {/* Profile Section */}
      <div className="user-profile">
        <h1>User Profile</h1>
        <div className="profile-card">
          <img src={user.avatar} alt="Avatar" className="profile-avatar" />
          <div className="profile-info">
            <label>Name:</label>
            {editable ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <p>{user.name}</p>
            )}

            <label>Email:</label>
            {editable ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            ) : (
              <p>{user.email}</p>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {editable ? (
            <button className="save-btn">Save</button>
          ) : (
            <button className="edit-btn" onClick={() => setEditable(true)}>
              Edit Profile
            </button>
          )}
        </div>
        {message && <p className="profile-message">{message}</p>}
      </div>

      {/* Tabs */}
      <div className="user-tabs">
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          Orders
        </button>
        <button
          className={tab === "addresses" ? "active" : ""}
          onClick={() => setTab("addresses")}
        >
          Addresses
        </button>
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="user-orders">
          <h2>My Orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                   <td>
  <span
    className={`status-badge ${
      o.status.toLowerCase() === "delivered"
        ? "status-delivered"
        : o.status.toLowerCase() === "cancelled"
        ? "status-cancelled"
        : o.status.toLowerCase() === "paid"
        ? "status-paid"
        : o.status.toLowerCase() === "failed"
        ? "status-failed"
        : "status-shipped"
    }`}
  >
    {o.status}
  </span>
</td>
                    <td>${o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {tab === "addresses" && (
        <div className="user-addresses">
          <h2>My Addresses</h2>
          {addresses.length > 0 && !showForm ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <div key={addr._id} className="address-card">
                  <p>
                    <strong>{addr.name}</strong> {addr.isDefault && "(Default)"}
                  </p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>{addr.phone}</p>
                  <div className="address-actions">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteAddress(addr._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowForm(true)}>+ Add New Address</button>
            </div>
          ) : (
            <AddressForm
              onSave={handleSaveAddress}
              editingAddress={editingAddress}
              onCancel={() => {
                setEditingAddress(null);
                setShowForm(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
