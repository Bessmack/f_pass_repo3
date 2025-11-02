import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Copy, ArrowLeft, Wallet, ArrowDownToLine, Send, History } from "lucide-react";
import { walletAPI, transactionAPI, formatCurrency } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function UserWallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0 });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ Fetch wallet
        const walletResponse = await walletAPI.getWallet();
        const wallet = walletResponse?.wallet || walletResponse;
        setWalletData(wallet);

        // ✅ Fetch transactions
        const txResponse = await transactionAPI.getTransactions("all", 50);
        const transactionsData = txResponse?.transactions || txResponse?.data || txResponse || [];

        if (!Array.isArray(transactionsData)) {
          console.warn("Unexpected transactions format:", transactionsData);
          setTransactions([]);
          setStats({ totalSent: 0, totalReceived: 0 });
        } else {
          setTransactions(transactionsData);

          // ✅ Calculate totals using correct logic (same as UserHomePage)
          const sent = transactionsData
            .filter(t => t.sender_id === user?.id && t.type === 'transfer')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

          const received = transactionsData
            .filter(t => (t.receiver_id === user?.id && t.type === 'transfer') || t.type === 'add_funds')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

          setStats({ totalSent: sent, totalReceived: received });
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setError(err.message || "Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ✅ Add the missing handleCopy function
  const handleCopy = () => {
    if (walletData?.wallet_id) {
      navigator.clipboard.writeText(walletData.wallet_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // ✅ Correct filtering logic (same as UserHistory)
  const filteredTransactions = Array.isArray(transactions)
    ? transactions.filter(t => {
        if (activeTab === "all") return true;
        
        const isSent = t.sender_id === user?.id;
        const isReceived = t.receiver_id === user?.id;
        
        if (activeTab === "sent") {
          return isSent && t.type === 'transfer';
        }
        
        if (activeTab === "received") {
          return (isReceived && t.type === 'transfer') || t.type === 'add_funds';
        }
        
        return true;
      })
    : [];

  // ✅ Correct format transaction function
  const formatTransaction = (transaction) => {
    const isSent = transaction.sender_id === user?.id && transaction.type === 'transfer';
    const isReceived = (transaction.receiver_id === user?.id && transaction.type === 'transfer') || transaction.type === 'add_funds';
    
    const dateTime = new Date(transaction.created_at);
    
    // Get display name (same as UserHomePage)
    const displayName = isReceived ? transaction.sender_name : transaction.receiver_name;
    const name = transaction.type === 'add_funds' 
      ? 'Added Funds' 
      : (isReceived ? `From ${displayName}` : `To ${displayName}`);

    return {
      id: transaction.id || transaction.transaction_id,
      type: isSent ? "sent" : "received",
      name: name,
      amount: parseFloat(transaction.amount || 0),
      date: dateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: transaction.status || "Completed",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Wallet
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const balance = walletData?.balance || 0;
  const walletId = walletData?.wallet_id || "N/A";
  const currency = walletData?.currency || "USD";

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-white">My Wallet</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-blue-500 rounded-3xl p-6 mb-4 shadow-lg relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-200 text-sm mb-2">Available Balance</p>
              {showBalance ? (
                <h2 className="text-4xl font-bold text-white">
                  {formatCurrency(balance, currency)}
                </h2>
              ) : (
                <h2 className="text-4xl font-bold text-white tracking-wider">
                  ••••••
                </h2>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
              >
                {showBalance ? (
                  <EyeOff size={20} className="text-white" />
                ) : (
                  <Eye size={20} className="text-white" />
                )}
              </button>
              <button className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                <Wallet size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              <p className="text-blue-200 text-xs mb-1">Wallet ID</p>
              <p className="text-white font-medium">{walletId}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-blue-600 rounded-lg transition"
            >
              <Copy size={18} className="text-white" />
            </button>
          </div>
          {copied && (
            <div className="absolute top-6 right-6 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              Copied!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate("/user/add-funds")}
            className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <ArrowDownToLine size={24} className="text-green-600" />
            </div>
            <span className="text-gray-800 font-medium text-sm">Add Funds</span>
          </button>

          <button
            onClick={() => navigate("/user/send-money")}
            className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Send size={24} className="text-blue-600" />
            </div>
            <span className="text-gray-800 font-medium text-sm">Send</span>
          </button>

          <button
            onClick={() => navigate("/user/transactions")}
            className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <History size={24} className="text-purple-600" />
            </div>
            <span className="text-gray-800 font-medium text-sm">History</span>
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-white">
          Transaction History
        </h1>
      </div>

      {/* ✅ Transactions Summary + Filters + List */}
      <div className="flex-1 bg-gray-50 rounded-t-3xl px-4 py-6 overflow-y-auto">
        {/* Totals Summary */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-blue-500 rounded-2xl p-4">
            <p className="text-blue-100 text-sm mb-1">Total Sent</p>
            <p className="text-white font-bold text-2xl">
              {formatCurrency(stats.totalSent, currency)}
            </p>
          </div>
          <div className="flex-1 bg-blue-500 rounded-2xl p-4">
            <p className="text-blue-100 text-sm mb-1">Total Received</p>
            <p className="text-white font-bold text-2xl">
              {formatCurrency(stats.totalReceived, currency)}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "sent", "received"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-3 pb-6">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const formattedTx = formatTransaction(tx);
              return (
                <div
                  key={formattedTx.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      formattedTx.type === "sent" ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {formattedTx.type === "sent" ? (
                      <Send size={20} className="text-red-600" />
                    ) : (
                      <ArrowDownToLine size={20} className="text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {formattedTx.name}
                    </p>
                    <p className="text-sm text-gray-500">{formattedTx.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        formattedTx.type === "sent"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formattedTx.type === "sent" ? "-" : "+"}
                      {formatCurrency(Math.abs(formattedTx.amount), currency)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formattedTx.status}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}