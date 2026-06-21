'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function CustomSelect({
  id,
  value,
  onChange,
  options = [],
  disabled = false,
  className = '',
  required = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : '';

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (val) => {
    if (onChange) {
      // Mimic a standard HTML event object so we don't break existing handlers
      onChange({
        target: {
          id,
          name: id,
          value: val
        }
      });
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
      style={{ position: 'relative', width: '100%' }}
    >
      <button
        type="button"
        id={id}
        className={`custom-select-trigger ${className} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          width: '100%',
          paddingRight: '2.5rem', // space for arrow
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          height: 'auto',
          minHeight: '2.8rem',
        }}
      >
        <span className="custom-select-value">{displayLabel}</span>
        <i
          className="fa-solid fa-chevron-down custom-select-arrow"
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '50%',
            transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
            transition: 'transform 0.2s ease',
            pointerEvents: 'none',
            fontSize: '0.85rem',
            color: disabled ? '#8c8c8c' : 'currentColor'
          }}
        ></i>
      </button>

      {isOpen && (
        <ul
          className="custom-select-options-list"
          role="listbox"
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            width: '100%',
            zIndex: 1000,
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--border-radius-sm, 6px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxHeight: '250px',
            overflowY: 'auto',
            padding: '4px 0',
            margin: 0,
            listStyle: 'none'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`custom-select-option-item ${isSelected ? 'selected' : ''}`}
                style={{
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: isSelected ? '#1e3a2b' : '#334155',
                  backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
