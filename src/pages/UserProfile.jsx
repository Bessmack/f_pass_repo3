import { useState } from 'react';
import UserTopNavbar from '../components/UserTopNavbar';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    address: '123 Main Street',
    city: 'New York',
    zipCode: '10001'
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    console.log('Profile updated:', tempData);
    // Add your API call here
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
    <UserTopNavbar/>
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <h1>My Profile</h1>
            <p>Manage your personal information and account settings</p>
          </div>
          {!isEditing && (
            <button className="btn-edit" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <div className="avatar-large">
              <span>JD</span>
            </div>
            <div className="avatar-info">
              <h3>{profileData.firstName} {profileData.lastName}</h3>
              <p>{profileData.email}</p>
              <button className="btn-change-photo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Change Photo
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Personal Information
            </h2>
            <div className="profile-grid">
              <div className="form-field">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={tempData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.firstName}</div>
                )}
              </div>
              <div className="form-field">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={tempData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.lastName}</div>
                )}
              </div>
              <div className="form-field">
                <label>Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.email}</div>
                )}
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.phone}</div>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="profile-section">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Address Information
            </h2>
            <div className="profile-grid">
              <div className="form-field">
                <label>Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={tempData.country}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.country}</div>
                )}
              </div>
              <div className="form-field">
                <label>Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={tempData.address}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.address}</div>
                )}
              </div>
              <div className="form-field">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={tempData.city}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.city}</div>
                )}
              </div>
              <div className="form-field">
                <label>Zip Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={tempData.zipCode}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">{profileData.zipCode}</div>
                )}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="profile-section">
            <h2 className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Account Security
            </h2>
            <div className="security-options">
              <div className="security-item">
                <div className="security-info">
                  <h4>Password</h4>
                  <p>Last changed 3 months ago</p>
                </div>
                <button className="btn-secondary-small">Change Password</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary-small">Enable 2FA</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="profile-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}