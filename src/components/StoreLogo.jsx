import React from 'react';

const brandMarks = {
  dmart: {
    background: '#f0f8ed',
    label: <><tspan fill="#13843b">D</tspan><tspan fill="#13843b">Mart</tspan></>,
  },
  blinkit: {
    background: '#fff5a8',
    label: <><tspan fill="#18221c">blink</tspan><tspan fill="#168b50">it</tspan></>,
  },
  bigbasket: {
    background: '#fff1ef',
    label: <><tspan fill="#d83b3b">big</tspan><tspan fill="#a62028">basket</tspan></>,
  },
  amazon: {
    background: '#f4fbf2',
    label: <><tspan fill="#202a35">amazon</tspan><tspan x="32" dy="13" fill="#318b45">fresh</tspan></>,
  },
  reliance: {
    background: '#eef5ff',
    label: <><tspan fill="#173e87">Reliance</tspan><tspan x="32" dy="13" fill="#28954b">SMART</tspan></>,
  },
};

function getBrandKey(storeName = '') {
  const name = storeName.toLowerCase().replace(/[^a-z]/g, '');
  if (name.includes('dmart')) return 'dmart';
  if (name.includes('blinkit') || name.includes('grofers')) return 'blinkit';
  if (name.includes('bigbasket')) return 'bigbasket';
  if (name.includes('amazon')) return 'amazon';
  if (name.includes('reliance') || name.includes('smartbazaar')) return 'reliance';
  return null;
}

export default function StoreLogo({ storeName = '', className = 'w-full h-full' }) {
  const brandKey = getBrandKey(storeName);
  const brand = brandMarks[brandKey];

  if (!brand) {
    const initials = storeName.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase() || '?';
    return (
      <svg className={className} viewBox="0 0 64 64" role="img" aria-label={`${storeName} logo`}>
        <rect width="64" height="64" rx="14" fill="#ecfdf5" />
        <text x="32" y="40" textAnchor="middle" fill="#047857" fontSize="23" fontWeight="800" fontFamily="Arial, sans-serif">{initials}</text>
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label={`${storeName} logo`}>
      <rect width="64" height="64" rx="14" fill={brand.background} />
      {brandKey === 'bigbasket' && (
        <g fill="none" stroke="#c82e36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21h24l-3 17H23l-3-17Z" />
          <path d="m26 21 6-7 6 7M26 27v7m6-7v7m6-7v7" />
        </g>
      )}
      {brandKey === 'dmart' && (
        <g fill="none" stroke="#13843b" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 19h22M24 25h16M27 31h10" />
          <path d="M32 12v3m-2-2 2 2 2-2" />
        </g>
      )}
      {brandKey === 'amazon' && (
        <g fill="none" stroke="#318b45" strokeWidth="2.5" strokeLinecap="round">
          <path d="M20 35c7 5 17 5 24 0" />
          <path d="m41 32 4 3-5 2" />
          <path d="M44 18c-6 0-10 3-11 9 6 0 10-3 11-9Z" fill="#69b96a" stroke="none" />
        </g>
      )}
      {brandKey === 'reliance' && (
        <g fill="none" stroke="#244c9a" strokeWidth="2.5" strokeLinecap="round">
          <path d="m24 17 8-5 8 5v11H24z" />
          <path d="M28 28v-6h8v6" />
        </g>
      )}
      <text
        x="32"
        y={brandKey === 'amazon' || brandKey === 'reliance' ? '43' : brandKey === 'blinkit' ? '40' : '50'}
        textAnchor="middle"
        fontSize={brandKey === 'amazon' || brandKey === 'reliance' ? '8.5' : brandKey === 'bigbasket' ? '8' : brandKey === 'blinkit' ? '10' : '11'}
        fontWeight="800"
        fontFamily="Arial, sans-serif"
      >
        {brand.label}
      </text>
    </svg>
  );
}
