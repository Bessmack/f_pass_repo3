// src/pages/EditBeneficiary.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { beneficiaryAPI } from '../services/api';

const EditBeneficiary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const b = location.state?.beneficiary;

  const [formData, setFormData] = useState({
    name: b?.name || '',
    email: b?.email || '',
    phone: b?.phone || '',
    relationship: b?.relationship || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await beneficiaryAPI.update(id, formData);
      setMessage('Beneficiary updated successfully!');
      setTimeout(() => navigate('/user/contacts'), 2000);
    } catch (err) {
      setMessage('Error updating beneficiary.');
      console.error(err);
    }
  };

  return (
    <div className="edit-beneficiary">
      <h2>Edit Beneficiary</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <input name="relationship" value={formData.relationship} onChange={handleChange} placeholder="Relationship" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditBeneficiary;
