import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 20 }}>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
      >
        <MoreVertical size={20} />
      </button>
      
      {open && (
        <div style={{ position: 'absolute', right: 0, top: '24px', background: 'white', border: '1px solid #e5e7eb', borderRadius: 'var(--radius)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '4px', width: '120px' }}>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onEdit(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', color: 'var(--color-text)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Edit2 size={14} /> Edit
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(false); onDelete(); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', borderRadius: '4px', color: '#DC2626' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
