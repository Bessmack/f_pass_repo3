import { useState, useEffect } from 'react';
import UserTopNavbar from '../components/UserTopNavbar';
import { userAPI } from '../services/api';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  });

  const [tempData, setTempData] = useState({ ...profileData });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await userAPI.getProfile();
      const userData = response.user || response.data || response;
      
      setProfileData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || ''
      });
      setTempData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile data');
      const defaultData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        country: 'United States'
      };
      setProfileData(defaultData);
      setTempData(defaultData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...profileData });
    setError('');
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const updateData = {
        first_name: tempData.firstName,
        last_name: tempData.lastName,
        phone: tempData.phone,
        country: tempData.country
      };

      const response = await userAPI.updateProfile(updateData);
      const updatedUser = response.user || response.data || response;
      setProfileData({
        firstName: updatedUser.first_name || updatedUser.firstName,
        lastName: updatedUser.last_name || updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country
      });
      setIsEditing(false);
      
      console.log('Profile updated successfully:', updatedUser);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Password Modal Functions
  const openPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    try {
      setIsLoading(true);
      setPasswordError('');
      
      const response = await userAPI.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });

      setPasswordSuccess('Password changed successfully!');
      
      // Clear form and close modal after success
      setTimeout(() => {
        closePasswordModal();
      }, 2000);

    } catch (err) {
      console.error('Failed to change password:', err);
      setPasswordError(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData.firstName) {
    return (
      <>
        <UserTopNavbar />
        <div className="profile-page">
          <div className="profile-container">
            <div className="loading">Loading profile...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserTopNavbar />
      <div className="profile-page">
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-header-content">
              <h1>My Profile</h1>
              <p>Manage your personal information and account settings</p>
            </div>
            {!isEditing && (
              <button className="btn-edit" onClick={handleEdit} disabled={isLoading}>
                Edit Profile
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Profile Content */}
          <div className="profile-content">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div className="avatar-large">
                <span>{profileData.firstName?.[0]}{profileData.lastName?.[0]}</span>
              </div>
              <div className="avatar-info">
                <h3>{profileData.firstName} {profileData.lastName}</h3>
                <p>{profileData.email}</p>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={true}
                      className="readonly-input"
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
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="field-value">{profileData.phone}</div>
                  )}
                </div>
                <div className="form-field">
                  <label>Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={tempData.country}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="field-value">{profileData.country}</div>
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
                  <button className="btn-secondary-small" onClick={openPasswordModal}>
                    Change Password
                  </button>
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
                <button 
                  className="btn-cancel" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Saving...'
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={closePasswordModal}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="modal-content">
              {passwordError && (
                <div className="error-message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="success-message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {passwordSuccess}
                </div>
              )}

              <div className="form-field">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="form-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                  placeholder="Confirm your new password"
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={closePasswordModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}