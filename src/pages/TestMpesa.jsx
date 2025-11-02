import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const TestMpesa = () => {
  const [phone, setPhone] = useState("254708374149");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const testAccessToken = async () => {
    addLog("Testing access token...", "info");
    setLoading(true);

    try {
      // Test via backend endpoint
      const res = await fetch("http://localhost:5000/api/wallet/test-token", {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json();
        addLog("✅ Access token retrieved successfully", "success");
        addLog(`Token: ${data.token?.substring(0, 20)}...`, "info");
        return data.token;
      } else {
        addLog("❌ Failed to get access token", "error");
        return null;
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const testStkPush = async () => {
    if (!phone || !amount) {
      addLog("❌ Please enter phone and amount", "error");
      return;
    }

    addLog(`📱 Phone: ${phone}`, "info");
    addLog(`💰 Amount: $${amount}`, "info");
    addLog("Initiating STK Push...", "info");

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        addLog("❌ No access token found. Please login first.", "error");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phone: phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addLog("✅ STK Push initiated successfully!", "success");
        addLog("👉 Check your phone for M-Pesa prompt", "success");
        setResult({ success: true, data });
      } else {
        addLog(`❌ Failed: ${data.error || "Unknown error"}`, "error");
        
        if (data.error?.errorCode) {
          addLog(`Error Code: ${data.error.errorCode}`, "error");
        }
        if (data.error?.errorMessage) {
          addLog(`Error Message: ${data.error.errorMessage}`, "error");
        }
        
        setResult({ success: false, error: data.error });
      }
    } catch (error) {
      addLog(`❌ Network Error: ${error.message}`, "error");
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testWithoutAuth = async () => {
    // Test STK Push without JWT (for debugging)
    addLog("Testing STK Push without authentication...", "info");
    
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/wallet/test-stk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          phone: phone,
        }),
      });

      const data = await res.json();
      addLog(`Response: ${JSON.stringify(data)}`, "info");
      
    } catch (error) {
      addLog(`Error: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setResult(null);
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "monospace",
    },
    header: {
      background: "#2563eb",
      color: "white",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    card: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#334155",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #cbd5e0",
      borderRadius: "6px",
      fontSize: "1rem",
      marginBottom: "16px",
    },
    button: {
      padding: "12px 24px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      marginRight: "10px",
      marginBottom: "10px",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
    },
    buttonSecondary: {
      background: "#64748b",
    },
    buttonDanger: {
      background: "#ef4444",
    },
    logContainer: {
      background: "#0f172a",
      color: "#e2e8f0",
      padding: "16px",
      borderRadius: "6px",
      maxHeight: "400px",
      overflowY: "auto",
      fontSize: "0.9rem",
    },
    logEntry: (type) => ({
      padding: "8px",
      marginBottom: "4px",
      borderLeft: `3px solid ${
        type === "success" ? "#10b981" : 
        type === "error" ? "#ef4444" : 
        "#3b82f6"
      }`,
      background: "rgba(255,255,255,0.05)",
    }),
    timestamp: {
      color: "#94a3b8",
      marginRight: "8px",
    },
    resultBox: (success) => ({
      background: success ? "#d1fae5" : "#fee2e2",
      border: `2px solid ${success ? "#10b981" : "#ef4444"}`,
      borderRadius: "8px",
      padding: "16px",
      marginTop: "20px",
    }),
    infoBox: {
      background: "#dbeafe",
      border: "1px solid #3b82f6",
      borderRadius: "6px",
      padding: "16px",
      marginBottom: "20px",
    },
    code: {
      background: "#f1f5f9",
      padding: "2px 6px",
      borderRadius: "3px",
      fontFamily: "monospace",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>🧪 M-Pesa Deposit Test</div>
        <div>Test M-Pesa STK Push integration</div>
      </div>

      <div style={styles.infoBox}>
        <strong>ℹ️ Test Instructions:</strong>
        <ol style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <li>Make sure your Flask server is running</li>
          <li>Use Safaricom test number: <span style={styles.code}>254708374149</span></li>
          <li>Test with small amount: <span style={styles.code}>1</span></li>
          <li>Check your phone for STK push prompt</li>
          <li>Enter PIN: <span style={styles.code}>1234</span> (sandbox)</li>
        </ol>
      </div>

      <div style={styles.card}>
        <h3>Test Parameters</h3>
        
        <label style={styles.label}>Phone Number (254XXXXXXXXX)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="254708374149"
          style={styles.input}
        />

        <label style={styles.label}>Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1"
          style={styles.input}
        />

        <button
          onClick={testStkPush}
          disabled={loading}
          style={styles.button}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Testing...
            </>
          ) : (
            "🚀 Test STK Push"
          )}
        </button>

        <button
          onClick={testAccessToken}
          disabled={loading}
          style={{ ...styles.button, ...styles.buttonSecondary }}
        >
          🔑 Test Access Token
        </button>

        <button
          onClick={clearLogs}
          style={{ ...styles.button, ...styles.buttonDanger }}
        >
          🗑️ Clear Logs
        </button>
      </div>

      {result && (
        <div style={styles.resultBox(result.success)}>
          <h3 style={{ marginTop: 0 }}>
            {result.success ? (
              <>
                <FaCheckCircle color="#10b981" /> Success!
              </>
            ) : (
              <>
                <FaTimesCircle color="#ef4444" /> Failed
              </>
            )}
          </h3>
          <pre style={{ fontSize: "0.85rem", overflow: "auto" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={styles.card}>
        <h3>Console Logs</h3>
        <div style={styles.logContainer}>
          {logs.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No logs yet. Run a test above.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={styles.logEntry(log.type)}>
                <span style={styles.timestamp}>[{log.timestamp}]</span>
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.infoBox}>
        <strong>🔍 Debugging Tips:</strong>
        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
          <li>Check Flask console for detailed error messages</li>
          <li>Verify your ngrok URL is correct and accessible</li>
          <li>Make sure M-Pesa credentials are valid</li>
          <li>Test phone should be a Safaricom number</li>
          <li>Callback might take 5-30 seconds to arrive</li>
        </ul>
      </div>
    </div>
  );
};

export default TestMpesa;