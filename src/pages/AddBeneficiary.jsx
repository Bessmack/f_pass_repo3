import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { beneficiaryAPI } from '../services/api'; // ✅ import from your api.js
import './AddBeneficiary.css';
import UserBottomNavbar from '../components/UserBottomNavbar';

const AddBeneficiary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    wallet_id: '',
    relationship: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const relationships = [
    'Family',
    'Friend',
    'Colleague',
    'Business Partner',
    'Service Provider',
    'Other'
  ];

  const handleBack = () => navigate('/user/contacts');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateInitials = (name) =>
    name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);

  const validateForm = () => {
    if (!formData.name.trim()) return alert('Please enter a name');
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      return alert('Please enter a valid email address');
    if (!formData.wallet_id.trim())
      return alert('Please enter a valid wallet ID');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const newBeneficiary = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        wallet_id: formData.wallet_id.trim(),
        relationship: formData.relationship || 'Other'
      };

      // ✅ Send to backend using api.js
      const response = await beneficiaryAPI.create(newBeneficiary);
      console.log('✅ Beneficiary created successfully:', response);

      setShowSuccess(true);

      setTimeout(() => {
        navigate('/user/contacts', {
          state: { message: 'Beneficiary added successfully!' }
        });
      }, 2500);
    } catch (error) {
      console.error('❌ Error creating beneficiary:', error);
      alert(error.message || 'Failed to add beneficiary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="add-beneficiary-success">
        <div className="success-content">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#10B981" />
              <path
                d="M8 12L11 15L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Beneficiary Added!</h2>
          <p>{formData.name} has been added to your contacts</p>
          <div className="success-details">
            <p>You can now send money to this contact</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="add-beneficiary">
      {/* Header */}
      <div className="add-beneficiary-header">
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
        <h1 className="header-title">Add New Beneficiary</h1>
      </div>

      {/* Form */}
      <div className="add-beneficiary-form">
        <form onSubmit={handleSubmit}>
          {/* Avatar Preview */}
          {formData.name && (
            <div className="avatar-preview">
              <div
                className="preview-avatar"
                style={{ backgroundColor: '#3B82F6' }}
              >
                {generateInitials(formData.name)}
              </div>
              <p className="avatar-label">Profile Preview</p>
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="form-input"
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="form-input"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label className="form-label">Wallet Number *</label>
            <input
              type="text"
              name="wallet_id"
              value={formData.wallet_id}
              onChange={handlePhoneChange}
              placeholder="(e.g. WALLET123)"
              className="form-input"
              required
            />
          </div>

          {/* Relationship Field */}
          <div className="form-group">
            <label className="form-label">Relationship (Optional)</label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select relationship</option>
              {relationships.map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>

          {/* Info Card */}
          <div className="info-card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#3B82F6" strokeWidth="2" />
              <path
                d="M12 16V12"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8H12.01"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h4>Secure & Private</h4>
              <p>
                Your beneficiary information is encrypted and stored securely.
                We never share your contacts with third parties.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`add-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Adding Beneficiary...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8.5" cy="7" r="4" stroke="white" strokeWidth="2" />
                  <path
                    d="M20 8V14M23 11H17"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add Beneficiary
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    <UserBottomNavbar/>
    </>
  );
};

export default AddBeneficiary;