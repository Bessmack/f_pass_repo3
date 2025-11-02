import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { beneficiaryAPI } from '../services/api'; // ✅ import from api.js
import './UserContacts.css';

const UserContacts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch beneficiaries from API
  useEffect(() => {
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const data = await beneficiaryAPI.getAll();

      // ✅ ensure beneficiaries is always an array
      const list = Array.isArray(data)
        ? data
        : data?.beneficiaries || data?.data || [];

      setBeneficiaries(list);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
      setError('Failed to load beneficiaries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  fetchBeneficiaries();
}, []);


  // ✅ Handle new beneficiary coming from add page
  useEffect(() => {
    if (location.state?.newBeneficiary) {
      const newBeneficiary = location.state.newBeneficiary;
      setBeneficiaries(prev => [newBeneficiary, ...prev]);
      setSuccessMessage(location.state.message || 'Beneficiary added successfully!');

      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

      // Clear location state
      navigate('/user/contacts', { replace: true });
    }
  }, [location.state, navigate]);

  // ✅ Search filter
  const filteredBeneficiaries = beneficiaries.filter(
    b =>
      b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.wallet_id?.includes(searchTerm)
  );

  const handleBack = () => window.history.back();

  const handleAddBeneficiary = () => navigate('/user/add-beneficiary');

  const handleSendMoney = (beneficiary) =>
    navigate('/user/send-money', { state: { beneficiary } });

  const handleDeleteBeneficiary = async (id) => {
    try {
      await beneficiaryAPI.delete(id);
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete beneficiary:', err);
      setError('Failed to delete beneficiary.');
    }
  };

  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', wallet_id: '', relationship: '' });

  const handleEdit = (beneficiary) => {
    setEditing(beneficiary.id);
    setFormData({
      name: beneficiary.name,
      email: beneficiary.email,
      wallet_id: beneficiary.wallet_id || '',
      relationship: beneficiary.relationship || '',
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const updated = await beneficiaryAPI.update(id, formData);
      setBeneficiaries(prev =>
        prev.map(b => (b.id === id ? updated.beneficiary : b))
      );
      setEditing(null);
      setSuccessMessage('Beneficiary updated successfully!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      console.error('Failed to update beneficiary:', err);
      setError('Failed to update beneficiary.');
    }
  };


  return (
    <div className="user-contacts">
      {/* Header */}
      <div className="contacts-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M15 18L9 12L15 6" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="header-title">Beneficiaries</h1>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="success-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#10B981"/>
            <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search beneficiaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Add button */}
      <div className="add-beneficiary-container">
        <button className="add-beneficiary-btn" onClick={handleAddBeneficiary}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 5V19M5 12H19" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Add New Beneficiary
        </button>
      </div>

      {/* Beneficiaries list */}
      <div className="beneficiaries-section">
        <h2 className="section-title">
          All Beneficiaries ({filteredBeneficiaries.length})
        </h2>

        {loading ? (
          <p>Loading beneficiaries...</p>
        ) : (
          <div className="beneficiaries-list">
            {filteredBeneficiaries.map((b) => (
              <div key={b.id} className="beneficiary-card">
                {editing === b.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={formData.wallet_id}
                      onChange={(e) => setFormData({ ...formData, wallet_id: e.target.value })}
                      placeholder="Wallet ID"
                    />
                    <input
                      type="text"
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      placeholder="Relationship"
                    />
                    <button onClick={() => handleSaveEdit(b.id)}>Save</button>
                    <button onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="beneficiary-info">
                      <div className="beneficiary-avatar" style={{ backgroundColor: '#3B82F6' }}>
                        {b.name ? b.name.slice(0, 2).toUpperCase() : '?'}
                      </div>
                      <div className="beneficiary-details">
                        <h3 className="beneficiary-name">{b.name}</h3>
                        <p className="beneficiary-email">{b.email}</p>
                        <p className="beneficiary-wallet">Wallet ID: {b.wallet_id}</p>
                      </div>
                    </div>
                    <div className="beneficiary-actions">
                      <button className="action-btn edit-btn" onClick={() => handleEdit(b)}>✏️</button>
                      <button className="action-btn delete-btn" onClick={() => handleDeleteBeneficiary(b.id)}>🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && filteredBeneficiaries.length === 0 && (
          <div className="no-results">
            <p>No beneficiaries found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContacts;


// <button className="action-btn send-btn" onClick={() => handleSendMoney(b)} title="Send Money">
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                     <path 
//                       d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
//                       stroke="#3B82F6" 
//                       strokeWidth="2" 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   </button>