import React from 'react';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  align = 'center',
  theme = 'light'
}) => {
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={`mb-10 sm:mb-12 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'}`}>
      {subtitle && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-50 text-gold-700 border border-gold-200 mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
          {subtitle}
        </span>
      )}

      <h2
        className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 leading-tight ${
          isDark ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>

      {/* Decorative Golden Divider */}
      <div className={`flex items-center gap-2 mb-4 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <div className="h-[2px] w-8 bg-gold-500 rounded-full" />
        <div className="w-2 h-2 rotate-45 bg-gold-600 rounded-[1px]" />
        <div className="h-[2px] w-8 bg-gold-500 rounded-full" />
      </div>

      {description && (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
