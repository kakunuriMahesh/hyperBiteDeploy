import React from 'react'

const styles = `
.spinner-wheel {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.spinner-wheel.sm { width: 20px; height: 20px; border-width: 2px; }
.spinner-wheel.lg { width: 56px; height: 56px; border-width: 4px; }
@keyframes spin { to { transform: rotate(360deg) } }
`

export default function Spinner({ size = 'md', text, fullPage, style, className = '', ...props }) {
  const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''
  return (
    <>
      <style>{styles}</style>
      <div
        className={`spinner-wrapper ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          ...(fullPage ? {
            position: 'fixed',
            inset: 0,
            backgroundColor: '#fff',
            zIndex: 9999,
          } : {}),
          ...style,
        }}
        {...props}
      >
        <div className={`spinner-wheel ${sizeClass}`} />
        {text && (
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#666' }}>
            {text}
          </span>
        )}
      </div>
    </>
  )
}
