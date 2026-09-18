import React from 'react';
import { motion } from 'framer-motion';

export default function ConfirmDeleteModal({ itemName, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 16px 0', color: '#DC2626' }}>Delete {itemName}?</h3>
        <p style={{ margin: '0 0 24px 0', color: 'var(--color-text)' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button 
            type="button" 
            onClick={onConfirm}
            className="btn"
            style={{ background: '#DC2626', color: 'white', border: 'none' }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
