import React, { useState, useEffect } from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddFunds = () => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(""); // new state for phone number
  const [defaultPhone, setDefaultPhone] = useState(""); // 🟢 store user’s default number
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const methods = [
    { id: "card", name: "Credit / Debit Card", icon: <FaCreditCard size={28} color="#2563eb" />, fee: 2.5 },
    { id: "bank", name: "Bank Transfer", icon: <FaUniversity size={28} color="#2563eb" />, fee: 1.2 },
    { id: "mobile", name: "Mobile Money", icon: <FaMobileAlt size={28} color="#2563eb" />, fee: 1.8 },
  ];

  const handlePreset = (val) => setAmount(val.toString());

  const handleInput = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
      setAmount(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !method) return;
    setShowModal(true);
  };

  useEffect(() => {
    const fetchUserPhone = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.user.phone) {
          setDefaultPhone(data.user.phone);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserPhone();
  }, []);

  // 🟢 Updated confirmAddFunds
  const confirmAddFunds = async () => {
    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    const finalPhone = phone.trim() !== "" ? phone : defaultPhone; // ✅ use input if provided, else fallback

    if (!finalPhone) {
      alert("No phone number available — please enter one manually.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:5000/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phone: finalPhone.startsWith("254")
            ? finalPhone
            : `254${finalPhone.slice(-9)}`, // ensure 254 format
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`✅ STK Push sent! Check your phone (${finalPhone}) and enter your M-Pesa PIN.\n\nTransaction ID: ${data.transaction_id}`);
      
        // Optional: Redirect to wallet or transactions page
        // setTimeout(() => navigate('/dashboard/wallet'), 2000);
      } else {
        // ✅ IMPROVED: Show detailed error
        const errorMsg = data.error?.errorMessage || data.error || "Something went wrong.";
        alert(`❌ Error: ${errorMsg}`);
      }
    } catch (error) {
      alert("⚠️ Error connecting to the server.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const numericAmount = parseFloat(amount) || 0;
  const fee = method ? (numericAmount * method.fee) / 100 : 0;
  const total = numericAmount + fee;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e2e8f0 0%, #f8fafc 40%, #dbeafe 100%)",
      fontFamily: "Inter, sans-serif",
      paddingBottom: "40px",
      gap: "25px",
      position: "relative",
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
    },
    headerTitle: {
      fontSize: "1.8rem",
      fontWeight: 700,
      marginBottom: "8px",
    },
    headerSubtext: {
      fontSize: "1rem",
      opacity: 0.9,
    },
    card: {
      backdropFilter: "blur(8px)",
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "18px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      padding: "28px",
      width: "440px",
      maxWidth: "95%",
      transition: "all 0.3s ease",
    },
    title: {
      fontSize: "1.2rem",
      fontWeight: 600,
      marginBottom: "16px",
      color: "#1e293b",
      textAlign: "center",
    },
    presets: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "20px",
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
      boxShadow: active
        ? "0 4px 12px rgba(37,99,235,0.4)"
        : hovered
        ? "0 4px 10px rgba(59,130,246,0.25)"
        : "none",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    }),
    inputWrapper: {
      position: "relative",
      width: "100%",
    },
    currencySymbol: {
      position: "absolute",
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
      fontWeight: 500,
    },
    input: {
      width: "100%",
      padding: "14px 14px 14px 32px",
      borderRadius: "12px",
      border: "1px solid #cbd5e0",
      fontSize: "1rem",
      textAlign: "center",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    },
    methodsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      width: "440px",
      maxWidth: "95%",
    },
    methodCard: (active, hovered) => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "14px",
      padding: "18px 20px",
      background: active
        ? "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)"
        : hovered
        ? "#f8fafc"
        : "#fff",
      border: active
        ? "2px solid #2563eb"
        : hovered
        ? "1px solid #93c5fd"
        : "1px solid #e2e8f0",
      boxShadow: active
        ? "0 4px 12px rgba(37,99,235,0.3)"
        : hovered
        ? "0 4px 10px rgba(59,130,246,0.15)"
        : "0 3px 10px rgba(0,0,0,0.06)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    }),
    methodInfo: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
    },
    fee: {
      fontSize: "0.9rem",
      color: "#475569",
    },
    totalCard: {
      background: "#fff",
      borderRadius: "14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      padding: "18px 24px",
      width: "440px",
      maxWidth: "95%",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      textAlign: "center",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      color: "#334155",
      fontWeight: 500,
    },
    totalHighlight: {
      fontSize: "1.1rem",
      fontWeight: 700,
      color: "#1e40af",
    },
    button: {
      width: "440px",
      maxWidth: "95%",
      padding: "16px",
      border: "none",
      borderRadius: "12px",
      background: "#2563eb",
      color: "#fff",
      fontSize: "1.05rem",
      fontWeight: "600",
      cursor: loading || !(numericAmount > 0 && method) ? "not-allowed" : "pointer",
      opacity: loading || !(numericAmount > 0 && method) ? 0.6 : 1,
      transition: "all 0.25s ease",
      marginTop: "10px",
      boxShadow:
        loading || !(numericAmount > 0 && method)
          ? "none"
          : "0 4px 16px rgba(37,99,235,0.4)",
    },
    footer: {
      marginTop: "30px",
      fontSize: "0.9rem",
      color: "#475569",
      textAlign: "center",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      padding: "30px",
      width: "90%",
      maxWidth: "380px",
      textAlign: "center",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    },
    modalButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "25px",
      gap: "10px",
    },
    confirmBtn: {
      flex: 1,
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    cancelBtn: {
      flex: 1,
      background: "#e2e8f0",
      color: "#1e293b",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
      toast: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#2563eb",
      color: "#fff",
      borderRadius: "10px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      animation: "fadeInOut 3s ease forwards",
      zIndex: 200,
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
    padding: "10px 10px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    },
    backBtnHover: {
    background: "rgba(255,255,255,0.25)",
    transform: "translateX(-2px)",
    },
  };

const styleSheet = document.styleSheets[0] || (() => {
  const style = document.createElement("style");
  document.head.appendChild(style);
  return style.sheet;
})();

const fadeInOut = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(30px); }
    10% { opacity: 1; transform: translateX(0); }
    80% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateY(20px); }
  }
`;

if (![...styleSheet.cssRules].some(r => r.name === "fadeInOut")) {
  styleSheet.insertRule(fadeInOut, styleSheet.cssRules.length);
}

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
            <div style={styles.headerTitleWrapper}>
                <button
                style={styles.backBtn}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.backBtnHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.backBtn)}
                onClick={() => navigate(-1)}
                >
                <FaArrowLeft size={16} color="white" />
                </button>
                <h2 style={styles.headerTitle}>Add Funds</h2>
            </div>
          <p style={styles.headerSubtext}>
            Select or enter the amount you want to add, then choose your payment method.
          </p>
        </div>
      </div>

      {/* Preset & Input */}
      <div style={styles.card}>
        <h3 style={styles.title}>Select or Enter Amount</h3>
        <div style={styles.presets}>
          {presetAmounts.map((val, i) => (
            <button
              key={val}
              onMouseEnter={() => setHoveredPreset(i)}
              onMouseLeave={() => setHoveredPreset(null)}
              onClick={() => handlePreset(val)}
              style={styles.presetBtn(parseFloat(amount) === val, hoveredPreset === i)}
            >
              ${val}
            </button>
          ))}
        </div>
        <div style={styles.inputWrapper}>
          <span style={styles.currencySymbol}>$</span>
          <input
            type="text"
            placeholder="Enter custom amount"
            value={amount}
            onChange={handleInput}
            style={styles.input}
          />
          
        </div>
        <br />
        <input
            type="tel"
            placeholder="Enter M-Pesa number (e.g. 0712345678)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
      </div>

      {/* Methods */}
      <div style={styles.methodsContainer}>
        {methods.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setMethod(m)}
            onMouseEnter={() => setHoveredMethod(i)}
            onMouseLeave={() => setHoveredMethod(null)}
            style={styles.methodCard(method && method.id === m.id, hoveredMethod === i)}
          >
            <div style={styles.methodInfo}>
              {m.icon}
              <div>
                <div style={{ fontWeight: 600 }}>{m.name}</div>
                <div style={styles.fee}>Fee: {m.fee}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={styles.totalCard}>
        <div style={styles.totalRow}>
          <span>Amount</span>
          <span>${numericAmount.toFixed(2)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Fee ({method ? method.fee : 0}%)</span>
          <span>${fee.toFixed(2)}</span>
        </div>
        <div style={{ ...styles.totalRow, ...styles.totalHighlight }}>
          <span>Total Charged</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !(numericAmount > 0 && method)}
        style={styles.button}
      >
        {loading
          ? "Processing..."
          : `Add $${amount || "0"} ${method ? `via ${method.name}` : ""}`}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ color: "#1e3a8a", marginBottom: "15px" }}>Confirm Top-Up</h3>
            <p>
              Add <strong>${numericAmount.toFixed(2)}</strong> using{" "}
              <strong>{method?.name}</strong>?
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={styles.confirmBtn} onClick={confirmAddFunds}>
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div style={styles.toast}>
          <FaCheckCircle size={22} color="white" />
          <span>Successfully added funds!</span>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        🔒 Secure payment processing &nbsp; | &nbsp; ⚡ Instant fund availability &nbsp; | &nbsp;
        💰 Industry-leading low fees
      </div>
    </div>
  );
};

export default AddFunds;