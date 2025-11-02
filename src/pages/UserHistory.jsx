import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowDownToLine, Send, Download } from "lucide-react";
import { walletAPI, transactionAPI, formatCurrency } from "../services/api";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import ReceiptDownloadButton from '../components/ReceiptDownloadButton';

export default function UserHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0 });
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch wallet
        const walletResponse = await walletAPI.getWallet();
        const wallet = walletResponse?.wallet || walletResponse;
        setWalletData(wallet);

        // Fetch transactions
        const txResponse = await transactionAPI.getTransactions("all", 50);
        const transactionsData = txResponse?.transactions || txResponse?.data || txResponse || [];

        if (!Array.isArray(transactionsData)) {
          console.warn("Unexpected transactions format:", transactionsData);
          setTransactions([]);
        } else {
          setTransactions(transactionsData);
        }

        // Calculate totals using correct logic
        const sent = (transactionsData || [])
          .filter(t => t.sender_id === user?.id && t.type === 'transfer')
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        const received = (transactionsData || [])
          .filter(t => (t.receiver_id === user?.id && t.type === 'transfer') || t.type === 'add_funds')
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        setStats({ totalSent: sent, totalReceived: received });
      } catch (err) {
        console.error("Error fetching transactions data:", err);
        setError(err.message || "Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Add user to dependencies

  // Correct filtering logic
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
      date: dateTime.toLocaleDateString("en-US"),
      time: dateTime.toLocaleTimeString("en-US"),
      status: transaction.status || "Completed",
      fee: parseFloat(transaction.fee || 0),
      transactionId: transaction.transaction_id || transaction.id
    };
  };

  const closeModal = () => setSelectedTransaction(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading transactions...</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Transactions</h2>
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

  const currency = walletData?.currency || "USD";

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col">
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
        </div>

        {/* Transaction Summary */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-blue-500 rounded-2xl p-5">
            <p className="text-blue-100 text-sm mb-1">Total Sent</p>
            <p className="text-white font-bold text-2xl">{formatCurrency(stats.totalSent, currency)}</p>
          </div>
          <div className="flex-1 bg-blue-500 rounded-2xl p-5">
            <p className="text-blue-100 text-sm mb-1">Total Received</p>
            <p className="text-white font-bold text-2xl">{formatCurrency(stats.totalReceived, currency)}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="flex-1 bg-gray-50 rounded-t-3xl px-4 py-6 overflow-y-auto">
        {/* Tabs */}
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
                  onClick={() => setSelectedTransaction(formattedTx)}
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
                    <p className="font-semibold text-gray-900">{formattedTx.name}</p>
                    <p className="text-sm text-gray-500">{formattedTx.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        formattedTx.type === "sent" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formattedTx.type === "sent" ? "-" : "+"}
                      {formatCurrency(Math.abs(formattedTx.amount), currency)}
                    </p>
                    <p className="text-xs text-gray-500">{formattedTx.status}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative">
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            {/* Icon and Amount */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                selectedTransaction.type === "sent" ? "bg-red-100" : "bg-green-100"
              }`}>
                {selectedTransaction.type === "sent" ? (
                  <Send size={28} className="text-red-600" />
                ) : (
                  <ArrowDownToLine size={28} className="text-green-600" />
                )}
              </div>
              <p className={`text-3xl font-bold mb-2 ${
                selectedTransaction.type === "sent" ? "text-red-600" : "text-green-600"
              }`}>
                {selectedTransaction.type === "sent" ? "-" : "+"}
                {formatCurrency(Math.abs(selectedTransaction.amount), currency)}
              </p>
              <p className="text-gray-500">{selectedTransaction.status}</p>
              
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Type</span>
                <span className="font-semibold text-gray-900 capitalize">{selectedTransaction.type}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">{selectedTransaction.type === "sent" ? "To" : "From"}</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Date</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Time</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.time}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Transaction Fee</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(selectedTransaction.fee, currency)}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.transactionId}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <ReceiptDownloadButton 
                  transactionId={selectedTransaction.transactionId} 
                  variant="button" 
                />
                <button 
                  onClick={closeModal}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
