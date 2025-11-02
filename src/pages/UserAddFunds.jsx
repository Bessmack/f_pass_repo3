// src/pages/UserAddFunds.jsx - PESAPAY VERSION
import React, { useState, useEffect } from "react";
import { FaCreditCard, FaUniversity, FaMobileAlt, FaCheckCircle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { walletAPI, validateAmount, validatePhone } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AddFunds = () => {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState("USD"); // New for Pesapay
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredPreset, setHoveredPreset] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState(null); // New for Pesapay polling
  const navigate = useNavigate();
  const { user, refreshWallet } = useAuth();

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const methods = [
    { 
      id: "mobile", 
      name: "Mobile Money (Pesapay)", // Updated name
      icon: <FaMobileAlt size={28} color="#2563eb" />, 
      fee: 0 
    },
  ];

  // Set default phone from user profile
  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  // Poll for Pesapay payment status
  useEffect(() => {
    if (paymentData) {
      startPolling(paymentData.reference);
    }
  }, [paymentData]);

  const handlePreset = (val) => {
    setAmount(val.toString());
    setError('');
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (val === "" || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
      setAmount(val);
      setError('');
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate amount
    const amountValidation = validateAmount(amount);
    if (!amountValidation.valid) {
      setError(amountValidation.error);
      return;
    }
    
    if (!method) {
      setError('Please select a payment method');
      return;
    }
    
    setShowModal(true);
  };

  const confirmAddFunds = async () => {
    if (!amount) {
      showToastMessage('Please enter an amount', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (method.id === 'mobile') {
        // Pesapay deposit
        if (!phone) {
          showToastMessage('Phone number is required for Pesapay', 'error');
          setLoading(false);
          return;
        }

        // Validate phone
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          showToastMessage(phoneValidation.error, 'error');
          setLoading(false);
          return;
        }

        const response = await walletAPI.deposit(
          parseFloat(amount), 
          phoneValidation.formatted,
          currency
        );
        
        if (response.success) {
          showToastMessage(
            `✅ Payment initiated! Redirecting to Pesapay...`,
            'success'
          );
          
          // Store payment data for polling
          setPaymentData(response);
          
          // Redirect to Pesapay payment page
          if (response.payment_url) {
            window.open(response.payment_url, '_blank');
          }
          
          setShowModal(false);
          setAmount('');
          setPhone(user?.phone || '');
        } else {
          showToastMessage(response.error || 'Payment initiation failed', 'error');
        }
      } else {
        // Other payment methods (unchanged)
        const response = await walletAPI.addFunds(parseFloat(amount), '', method.id);
        
        if (response.success) {
          showToastMessage(`✅ Successfully added ${formatCurrency(amount)}!`, 'success');
          
          // Refresh wallet balance
          await refreshWallet();
          
          setShowModal(false);
          setAmount('');
        } else {
          showToastMessage(response.error || 'Transaction failed', 'error');
        }
      }
    } catch (err) {
      console.error('Add funds error:', err);
      const errorMessage = err.data?.error || err.message || 'Failed to add funds';
      showToastMessage(`❌ ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = async (reference, attempts = 0) => {
    if (attempts >= 20) { // Stop after 20 attempts (100 seconds)
      showToastMessage('Payment timeout. Please check your Pesapay account.', 'error');
      setPaymentData(null);
      return;
    }

    setTimeout(async () => {
      try {
        const response = await walletAPI.checkPaymentStatus(reference);
        
        if (response.status === 'completed') {
          showToastMessage('✅ Payment completed successfully!', 'success');
          await refreshWallet();
          setPaymentData(null);
        } else if (response.status === 'failed') {
          showToastMessage('❌ Payment failed or was cancelled', 'error');
          setPaymentData(null);
        } else {
          // Still pending, poll again
          startPolling(reference, attempts + 1);
        }
      } catch (err) {
        console.error('Status check error:', err);
        // Continue polling on error
        startPolling(reference, attempts + 1);
      }
    }, 5000); // Check every 5 seconds
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const formatCurrency = (val) => `$${parseFloat(val || 0).toFixed(2)}`;

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
    errorMessage: {
      background: "#fee2e2",
      border: "1px solid #ef4444",
      borderRadius: "8px",
      padding: "12px",
      color: "#dc2626",
      fontSize: "14px",
      marginBottom: "16px",
      display: error ? "block" : "none",
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
      boxShadow: active ? "0 4px 12px rgba(37,99,235,0.4)" : hovered ? "0 4px 10px rgba(59,130,246,0.25)" : "none",
      transform: hovered ? "translateY(-3px)" : "translateY(0)",
    }),
    inputWrapper: {
      position: "relative",
      width: "100%",
      marginBottom: "16px",
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
    select: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #cbd5e0",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      background: "white",
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
      background: active ? "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)" : hovered ? "#f8fafc" : "#fff",
      border: active ? "2px solid #2563eb" : hovered ? "1px solid #93c5fd" : "1px solid #e2e8f0",
      boxShadow: active ? "0 4px 12px rgba(37,99,235,0.3)" : hovered ? "0 4px 10px rgba(59,130,246,0.15)" : "0 3px 10px rgba(0,0,0,0.06)",
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
      boxShadow: loading || !(numericAmount > 0 && method) ? "none" : "0 4px 16px rgba(37,99,235,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
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
      background: toastType === 'success' ? "#2563eb" : "#ef4444",
      color: "#fff",
      borderRadius: "10px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      animation: "fadeInOut 5s ease forwards",
      zIndex: 200,
      maxWidth: "400px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTitleWrapper}>
            <button
              style={styles.backBtn}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft size={16} color="white" />
            </button>
            <h2 style={styles.headerTitle}>Add Funds</h2>
          </div>
          <p style={styles.headerSubtext}>
            Select or enter the amount you want to add.
          </p>
        </div>
      </div>

      {/* Error Message */}
      <div style={styles.errorMessage}>{error}</div>

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
        
        {/* Currency Selection for Pesapay */}
        {method?.id === 'mobile' && (
          <>
            <div style={styles.inputWrapper}>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                style={styles.select}
              >
                <option value="KES">KES</option>
              </select>
            </div>
            <div style={styles.inputWrapper}>
              <input
                type="tel"
                placeholder="Enter phone number (e.g. 254712345678)"
                value={phone}
                onChange={handlePhoneChange}
                style={styles.input}
              />
            </div>
          </>
        )}
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
          <span>{formatCurrency(numericAmount)}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Fee ({method ? method.fee : 0}%)</span>
          <span>{formatCurrency(fee)}</span>
        </div>
        <div style={{ ...styles.totalRow, ...styles.totalHighlight }}>
          <span>Total Charged</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || !(numericAmount > 0 && method)}
        style={styles.button}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing...
          </>
        ) : (
          `Add ${formatCurrency(amount || 0)} ${method ? `via ${method.name}` : ""}`
        )}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ color: "#1e3a8a", marginBottom: "15px" }}>Confirm Top-Up</h3>
            <p>
              Add <strong>{formatCurrency(numericAmount)}</strong> using{" "}
              <strong>{method?.name}</strong>?
            </p>
            {method?.id === 'mobile' && (
              <>
                <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
                  Phone: <strong>{phone}</strong>
                </p>
                <p style={{ marginTop: "5px", fontSize: "14px", color: "#64748b" }}>
                  Currency: <strong>{currency}</strong>
                </p>
              </>
            )}
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button style={styles.confirmBtn} onClick={confirmAddFunds} disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div style={styles.toast}>
          {toastType === 'success' ? (
            <FaCheckCircle size={22} />
          ) : (
            <span style={{ fontSize: "22px" }}>⚠️</span>
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(30px); }
          10% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
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

export default AddFunds;