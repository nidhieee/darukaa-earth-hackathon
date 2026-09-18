import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      height: '100%', 
      minHeight: '200px', 
      gap: '16px' 
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(30, 132, 73, 0.2)',
        borderTop: '4px solid var(--color-brand)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {text && (
        <p style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: '500', margin: 0 }}>
          {text}
        </p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
