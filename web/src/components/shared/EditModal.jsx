import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlareHover from '../GlareHover';

export default function EditModal({ title, initialName, initialDescription, onSave, onCancel }) {
  const [name, setName] = useState(initialName || '');
  const [description, setDescription] = useState(initialDescription || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onSave({ name: name.trim(), description: description.trim() });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--color-primary)' }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Description (Optional)</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              style={{ minHeight: '80px', padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid #d1d5db', width: '100%', fontSize: '15px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
            <GlareHover>
              <button type="submit" className="btn" disabled={!name.trim()}>Save</button>
            </GlareHover>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
