// src/pages/UserSendMoney.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import { FaSearch, FaPaperPlane, FaCheckCircle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { beneficiaryAPI, transactionAPI, walletAPI, validateAmount } from "../services/api";
import { useAuth } from "../context/AuthContext";
import UserBottomNavbar from "../components/UserBottomNavbar";

const SendMoney = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [hoveredPreset, setHoveredPreset] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(true);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const navigate = useNavigate();
  const { refreshWallet } = useAuth();

  const presetAmounts = [10, 25, 50, 100, 250, 500];
  const transactionChargeRate = 0.015; // 1.5%

  // Fetch wallet and beneficiaries
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBeneficiaries(true);
        
        // Fetch wallet
        const walletResponse = await walletAPI.getWallet();
        const wallet = walletResponse?.wallet || walletResponse;
        setWalletBalance(wallet?.balance || 0);

        // Fetch beneficiaries
        const benefResponse = await beneficiaryAPI.getAll();
        const list = benefResponse?.beneficiaries || benefResponse?.data || benefResponse || [];
        setBeneficiaries(Array.isArray(list) ? list : []);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("error", "Failed to load data. Please refresh.");
      } finally {
        setLoadingBeneficiaries(false);
      }
    };
    
    fetchData();
  }, []);

  const filtered = beneficiaries.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.wallet_id?.includes(search)
  );

  const handleSendClick = (user) => {
    setSelectedUser(user);
    setAmount('');
    setNote('');
    setError('');
    setShowModal(true);
  };

  const totalCharge = amount ? Math.round(parseFloat(amount) * transactionChargeRate * 100) / 100 : 0;
  const totalPayable = amount ? parseFloat(amount) + totalCharge : 0;

  const confirmSend = () => {
    setError('');
    
    // Validate amount
    const validation = validateAmount(amount);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (totalPayable > walletBalance) {
      setError(`Insufficient balance. You need $${totalPayable.toFixed(2)} (including $${totalCharge.toFixed(2)} fee), but have $${walletBalance.toFixed(2)}`);
      return;
    }

    setConfirming(true);
  };

  const finalizeSend = async () => {
    if (!amount || !selectedUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await transactionAPI.sendMoney(
        selectedUser.wallet_id,
        parseFloat(amount),
        note || ''
      );

      if (response.success) {
        // Update local wallet balance
        setWalletBalance(prev => prev - totalPayable);
        
        // Refresh wallet from server
        await refreshWallet();
        
        showToast("success", `✅ Sent $${amount} to ${selectedUser.name}`);
        
        // Reset form
        setAmount("");
        setNote("");
        setSelectedUser(null);
        setConfirming(false);
        setShowModal(false);
      } else {
        setError(response.error || "Transaction failed");
      }
    } catch (err) {
      console.error("Transaction failed:", err);
      const errorMsg = err.data?.error || err.message || "Transaction failed! Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const formatCurrency = (val) => `$${parseFloat(val || 0).toFixed(2)}`;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 40%, #dbeafe 100%)",
      fontFamily: "Inter, sans-serif",
      paddingBottom: "100px",
      gap: "25px",
    },
    header: {
      width: "100%",
      background: "#2563eb",
      color: "#fff",
      padding: "30px 0 20px 0",
      textAlign: "left",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      zIndex: 10,
    },
    headerContent: {
      width: "90%",
      maxWidth: "900px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    headerTop: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "10px",
    },
    headerTitleWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    backBtn: {
      background: "rgba(255,255,255,0.15)",
      border: "none",
      borderRadius: "20px",
      padding: "10px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    searchBarBelow: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      marginTop: "12px",
      width: "100%",
      maxWidth: "400px",
    },
    searchIconBelow: {
      position: "absolute",
      left: "12px",
      color: "#1e40af",
    },
    searchInputBelow: {
      padding: "10px 12px 10px 36px",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      outline: "none",
      width: "100%",
      background: "white",
      color: "#1e293b",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    },
    headerTitle: { fontSize: "1.8rem", fontWeight: 700 },
    walletBalance: {
      fontSize: "1rem",
      opacity: 0.9,
      marginTop: "5px",
      fontWeight: 500,
    },
    listContainer: {
      width: "90%",
      maxWidth: "700px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      marginTop: "20px",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px",
      color: "#64748b",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#64748b",
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "16px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      padding: "18px 22px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 8px 20px rgba(37,99,235,0.2)",
    },
    userInfo: { display: "flex", flexDirection: "column", color: "#1e293b" },
    walletId: {
      fontSize: "0.85rem",
      color: "#64748b",
      marginTop: "4px",
    },
    sendBtn: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 14px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontWeight: 500,
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    modal: {
      background: "white",
      borderRadius: "18px",
      padding: "28px",
      width: "90%",
      maxWidth: "380px",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalTitle: {
      color: "#1e3a8a",
      fontSize: "1.3rem",
      fontWeight: 700,
      marginBottom: "15px",
    },
    errorMessage: {
      background: "#fee2e2",
      border: "1px solid #ef4444",
      borderRadius: "8px",
      padding: "12px",
      color: "#dc2626",
      fontSize: "14px",
      marginBottom: "16px",
    },
    presets: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "18px",
    },
    presetBtn: (active, hovered) => ({
      padding: "10px 18px",
      borderRadius: "10px",
      border: "1px solid #cbd5e0",
      background: active ? "#2563eb" : hovered ? "#3b82f6" : "#f1f5f9",
      color: active || hovered ? "#fff" : "#1e293b",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: active ? "0 4px 12px rgba(37,99,235,0.4)" : hovered ? "0 4px 10px rgba(59,130,246,0.25)" : "none",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    }),
    inputWrapper: { position: "relative", width: "100%", marginBottom: "12px" },
    currencySymbol: {
      position: "absolute",
      top: "50%",
      left: "12px",
      transform: "translateY(-50%)",
      color: "#475569",
      fontWeight: 600,
    },
    input: {
      width: "100%",
      padding: "12px 12px 12px 30px",
      borderRadius: "10px",
      border: "1px solid #cbd5e0",
      outline: "none",
      textAlign: "center",
      fontSize: "1rem",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #cbd5e0",
      outline: "none",
      minHeight: "70px",
      resize: "none",
      fontSize: "1rem",
    },
    infoBox: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "10px",
      fontSize: "0.9rem",
      color: "#1e293b",
      textAlign: "left",
      marginBottom: "12px",
    },
    summaryCard: {
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "12px",
      marginTop: "15px",
      fontSize: "0.95rem",
      textAlign: "left",
      color: "#1e293b",
    },
    modalBtns: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "20px",
    },
    confirmBtn: {
      flex: 1,
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "12px 0",
      borderRadius: "10px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    cancelBtn: {
      flex: 1,
      background: "#e2e8f0",
      color: "#1e293b",
      border: "none",
      padding: "12px 0",
      borderRadius: "10px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    toast: {
      position: "fixed",
      bottom: "25px",
      right: "25px",
      color: "white",
      padding: "14px 20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      animation: "slideInRight 0.4s ease, fadeOut 0.5s ease 3.5s forwards",
      zIndex: 200,
      fontWeight: 500,
      maxWidth: "400px",
    },
  };

  const styleSheet = document.styleSheets[0];
  if (styleSheet && ![...styleSheet.cssRules].some(r => r.name === "slideInRight")) {
    const slideIn = `@keyframes slideInRight { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }`;
    const fadeOut = `@keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; transform: translateY(20px); } }`;
    styleSheet.insertRule(slideIn, styleSheet.cssRules.length);
    styleSheet.insertRule(fadeOut, styleSheet.cssRules.length);
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <div style={styles.headerTitleWrapper}>
              <button style={styles.backBtn} onClick={() => navigate(-1)}>
                <FaArrowLeft size={16} color="white" />
              </button>
              <h2 style={styles.headerTitle}>Send Money</h2>
            </div>

            <div style={styles.searchBarBelow}>
              <FaSearch style={styles.searchIconBelow} />
              <input
                style={styles.searchInputBelow}
                type="text"
                placeholder="Search beneficiary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <p style={styles.walletBalance}>
            Wallet Balance: {formatCurrency(walletBalance)} available
          </p>
        </div>
      </div>

      {/* Beneficiary List */}
      <div style={styles.listContainer}>
        {loadingBeneficiaries ? (
          <div style={styles.loadingContainer}>
            <FaSpinner className="animate-spin" size={32} color="#2563eb" />
            <p style={{ marginTop: "16px" }}>Loading beneficiaries...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((user) => (
            <div
              key={user.id}
              style={styles.card}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, { transform: "", boxShadow: styles.card.boxShadow })
              }
            >
              <div style={styles.userInfo}>
                <strong>{user.name}</strong>
                <span style={{ color: "#475569", fontSize: "0.9rem" }}>{user.email}</span>
                <span style={styles.walletId}>Wallet: {user.wallet_id}</span>
              </div>
              <button
                style={styles.sendBtn}
                onClick={() => handleSendClick(user)}
              >
                <FaPaperPlane /> Send
              </button>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <p style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
              {search ? "No beneficiaries found" : "No beneficiaries yet"}
            </p>
            <p style={{ fontSize: "0.9rem" }}>
              {search ? "Try a different search term" : "Add a beneficiary to get started"}
            </p>
            {!search && (
              <button
                style={{ ...styles.sendBtn, marginTop: "16px", padding: "12px 24px" }}
                onClick={() => navigate("/user/add-beneficiary")}
              >
                Add Beneficiary
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Send to {selectedUser?.name}</h3>

            {error && <div style={styles.errorMessage}>{error}</div>}

            {!confirming ? (
              <>
                <div style={styles.infoBox}>
                  <p><strong>Wallet Balance:</strong> {formatCurrency(walletBalance)}</p>
                  <p><strong>Transaction Fee:</strong> 1.5% ({formatCurrency(totalCharge)})</p>
                </div>

                <div style={styles.presets}>
                  {presetAmounts.map((val, i) => (
                    <button
                      key={val}
                      onMouseEnter={() => setHoveredPreset(i)}
                      onMouseLeave={() => setHoveredPreset(null)}
                      onClick={() => setAmount(val.toString())}
                      style={styles.presetBtn(parseFloat(amount) === val, hoveredPreset === i)}
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>

                <div style={styles.inputWrapper}>
                  <span style={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError('');
                    }}
                    style={styles.input}
                  />
                </div>

                <textarea
                  placeholder="Add an optional note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={styles.textarea}
                />

                <div style={styles.modalBtns}>
                  <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button style={styles.confirmBtn} onClick={confirmSend} disabled={!amount || loading}>
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ marginBottom: "12px", color: "#1e3a8a" }}>Transaction Summary</h4>
                <div style={styles.summaryCard}>
                  <p><strong>Recipient:</strong> {selectedUser?.name}</p>
                  <p><strong>Wallet ID:</strong> {selectedUser?.wallet_id}</p>
                  <p><strong>Amount:</strong> {formatCurrency(amount)}</p>
                  <p><strong>Fee (1.5%):</strong> {formatCurrency(totalCharge)}</p>
                  <p><strong>Total Payable:</strong> {formatCurrency(totalPayable)}</p>
                  <p><strong>Wallet Remaining:</strong> {formatCurrency(walletBalance - totalPayable)}</p>
                  {note && <p><strong>Note:</strong> {note}</p>}
                </div>

                <div style={styles.modalBtns}>
                  <button style={styles.cancelBtn} onClick={() => setConfirming(false)} disabled={loading}>
                    Back
                  </button>
                  <button style={styles.confirmBtn} onClick={finalizeSend} disabled={loading}>
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Confirm & Send"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          ...styles.toast,
          background: toast.type === "error" ? "#ef4444" : "#2563eb"
        }}>
          {toast.type === "success" ? <FaCheckCircle size={20} /> : <span>⚠️</span>}
          {toast.message}
        </div>
      )}

      <UserBottomNavbar />

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SendMoney;