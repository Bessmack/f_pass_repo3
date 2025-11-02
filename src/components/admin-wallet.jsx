import React, { useState } from "react";
import "./Wallet.css";

const Wallet = () => {
  const [wallets, setWallets] = useState([
    {
      id: 1,
      name: "Alice Cooper",
      email: "alice@example.com",
      balance: 1250.5,
      status: "active",
    },
  ]);

  const [modal, setModal] = useState({ open: false, type: "", wallet: null });
  const [amount, setAmount] = useState("");

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const averageBalance = totalBalance / wallets.length;
  const activeWallets = wallets.filter((w) => w.status === "active").length;

  // --- handle modal open/close ---
  const openModal = (wallet, type) => setModal({ open: true, wallet, type });
  const closeModal = () => {
    setModal({ open: false, type: "", wallet: null });
    setAmount("");
  };

  // --- update balance ---
  const updateBalance = () => {
    if (!amount || isNaN(amount)) return alert("Enter a valid amount!");
    setWallets((prev) =>
      prev.map((w) =>
        w.id === modal.wallet.id
          ? {
              ...w,
              balance:
                modal.type === "add"
                  ? w.balance + parseFloat(amount)
                  : w.balance - parseFloat(amount),
            }
          : w
      )
    );
    closeModal();
  };

  return (
    <div className="wallet-container">
      {/* Stats cards */}
      <div className="wallet-stats">
        <div className="wallet-card purple">
          <div className="wallet-icon">💳</div>
          <p>Total Wallet Balance</p>
          <h2>${totalBalance.toFixed(2)}</h2>
        </div>

        <div className="wallet-card green">
          <div className="wallet-icon">➕</div>
          <p>Average Balance</p>
          <h2>${averageBalance.toFixed(2)}</h2>
        </div>

        <div className="wallet-card blue">
          <div className="wallet-icon">👥</div>
          <p>Active Wallets</p>
          <h2>{activeWallets}</h2>
        </div>
      </div>

      {/* Search bar */}
      <div className="wallet-search">
        <input type="text" placeholder="🔍 Search wallets..." />
      </div>

      {/* Table */}
      <table className="wallet-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Wallet Balance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              <td>
                <div className="user-info">
                  <p className="name">{wallet.name}</p>
                  <p className="email">{wallet.email}</p>
                </div>
              </td>
              <td>
                <span className="balance">${wallet.balance.toFixed(2)}</span>
              </td>
              <td>
                <span className={`status ${wallet.status}`}>{wallet.status}</span>
              </td>
              <td>
                <button className="btn add" onClick={() => openModal(wallet, "add")}>
                  + Add
                </button>
                <button
                  className="btn deduct"
                  onClick={() => openModal(wallet, "deduct")}
                >
                  − Deduct
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing on modal click
          >
            <h3>
              {modal.type === "add" ? "Add Funds" : "Deduct Funds"} -{" "}
              {modal.wallet.name}
            </h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`btn confirm ${modal.type}`}
                onClick={updateBalance}
              >
                {modal.type === "add" ? "Add" : "Deduct"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;