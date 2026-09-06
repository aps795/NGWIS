import React from 'react';

interface InstagramIconProps {
  className?: string;
  useGradient?: boolean;
}

export const InstagramIcon: React.FC<InstagramIconProps> = ({
  className = 'w-5 h-5',
  useGradient = false
}) => {
  if (useGradient) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ig-grad-icon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" fill="none" stroke="url(#ig-grad-icon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="url(#ig-grad-icon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad-icon)" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
};
