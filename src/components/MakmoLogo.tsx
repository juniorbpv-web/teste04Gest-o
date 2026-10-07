import React from 'react';

export const MAKMO_BRAND = {
  navy: '#113861', // Azul Marinho Oficial Makmo
  teal: '#20b4a7', // Verde Água / Turquesa Oficial Makmo
  navyDark: '#0a233d',
  navyLight: '#1b4d82',
  tealLight: '#2dd4c4',
  tealDark: '#178a7f',
};

interface MakmoLogoProps {
  className?: string;
  theme?: 'light' | 'dark' | 'auto' | 'brand';
  showSubtitle?: boolean;
  showSubBrand?: boolean;
  compact?: boolean;
}

export const MakmoLogo: React.FC<MakmoLogoProps> = ({
  className = 'h-8 sm:h-9 w-auto',
  theme = 'auto',
  showSubtitle = true,
  showSubBrand = true,
  compact = false,
}) => {
  // Standardized official brand colors
  // Light / Brand: Authentic Navy Blue #113861 + Teal #20b4a7
  // Dark: Crisp White #ffffff + Teal #20b4a7
  // Auto: Switches based on system / Tailwind dark mode
  const isDarkClass =
    theme === 'brand' || theme === 'light'
      ? 'fill-[#113861]'
      : theme === 'dark'
        ? 'fill-white'
        : 'fill-[#113861] dark:fill-white';

  const textClass =
    theme === 'brand' || theme === 'light'
      ? 'fill-[#113861]'
      : theme === 'dark'
        ? 'fill-slate-100'
        : 'fill-[#113861] dark:fill-slate-100';

  const tealFill = 'fill-[#20b4a7]';

  if (compact) {
    // Compact glyph version for mobile or small icon slots
    return (
      <svg
        viewBox="0 0 395 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Makmo Logo"
      >
        <g id="makmo-letters">
          {/* Letter 1: 'm' */}
          <path
            className={isDarkClass}
            fillRule="evenodd"
            d="M 34 15 L 82 15 A 14 14 0 0 1 96 29 L 96 85 L 82 85 L 82 33 A 4 4 0 0 0 78 29 L 65 29 A 4 4 0 0 0 61 33 L 61 85 L 47 85 L 47 33 A 4 4 0 0 0 43 29 L 30 29 A 4 4 0 0 0 26 33 L 26 85 L 12 85 L 12 29 A 14 14 0 0 1 26 15 Z"
          />
          {/* Letter 2: 'a' */}
          <path
            className={tealFill}
            fillRule="evenodd"
            d="M 124 15 L 148 15 A 14 14 0 0 1 162 29 L 162 85 L 148 85 L 148 78 A 14 14 0 0 1 134 85 L 124 85 A 14 14 0 0 1 110 71 L 110 29 A 14 14 0 0 1 124 15 Z M 125 30 A 4 4 0 0 0 124 34 L 124 66 A 4 4 0 0 0 128 70 L 134 70 A 4 4 0 0 0 138 66 L 138 34 A 4 4 0 0 0 134 30 Z"
          />
          {/* Letter 3: 'k' Chevron */}
          <path
            className={tealFill}
            d="M 198 15 L 178 48 A 4 4 0 0 0 178 52 L 198 85 L 214 85 L 193 51 A 1.5 1.5 0 0 1 193 49 L 214 15 Z"
          />
          {/* Letter 4: 'm' */}
          <path
            className={isDarkClass}
            fillRule="evenodd"
            d="M 248 15 L 296 15 A 14 14 0 0 1 310 29 L 310 85 L 296 85 L 296 33 A 4 4 0 0 0 292 29 L 279 29 A 4 4 0 0 0 275 33 L 275 85 L 261 85 L 261 33 A 4 4 0 0 0 257 29 L 244 29 A 4 4 0 0 0 240 33 L 240 85 L 226 85 L 226 29 A 14 14 0 0 1 240 15 Z"
          />
          {/* Letter 5: 'o' */}
          <path
            className={isDarkClass}
            fillRule="evenodd"
            d="M 338 15 L 366 15 A 14 14 0 0 1 380 29 L 380 71 A 14 14 0 0 1 366 85 L 338 85 A 14 14 0 0 1 324 71 L 324 29 A 14 14 0 0 1 338 15 Z M 340 30 A 4 4 0 0 0 338 34 L 338 66 A 4 4 0 0 0 342 70 L 362 70 A 4 4 0 0 0 366 66 L 366 34 A 4 4 0 0 0 362 30 Z"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox={showSubBrand ? '0 0 460 155' : '0 0 400 130'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Makmo Infraestrutura Logo"
    >
      <g id="makmo-main-group">
        {/* Letter 1: 'm' (Navy Blue) */}
        <path
          className={isDarkClass}
          fillRule="evenodd"
          d="M 34 15 L 82 15 A 14 14 0 0 1 96 29 L 96 85 L 82 85 L 82 33 A 4 4 0 0 0 78 29 L 65 29 A 4 4 0 0 0 61 33 L 61 85 L 47 85 L 47 33 A 4 4 0 0 0 43 29 L 30 29 A 4 4 0 0 0 26 33 L 26 85 L 12 85 L 12 29 A 14 14 0 0 1 26 15 Z"
        />

        {/* Letter 2: 'a' (Teal/Cyan) */}
        <path
          className={tealFill}
          fillRule="evenodd"
          d="M 124 15 L 148 15 A 14 14 0 0 1 162 29 L 162 85 L 148 85 L 148 78 A 14 14 0 0 1 134 85 L 124 85 A 14 14 0 0 1 110 71 L 110 29 A 14 14 0 0 1 124 15 Z M 125 30 A 4 4 0 0 0 124 34 L 124 66 A 4 4 0 0 0 128 70 L 134 70 A 4 4 0 0 0 138 66 L 138 34 A 4 4 0 0 0 134 30 Z"
        />

        {/* Letter 3: 'k' Chevron (Teal/Cyan) */}
        <path
          className={tealFill}
          d="M 198 15 L 178 48 A 4 4 0 0 0 178 52 L 198 85 L 214 85 L 193 51 A 1.5 1.5 0 0 1 193 49 L 214 15 Z"
        />

        {/* Letter 4: 'm' (Navy Blue) */}
        <path
          className={isDarkClass}
          fillRule="evenodd"
          d="M 248 15 L 296 15 A 14 14 0 0 1 310 29 L 310 85 L 296 85 L 296 33 A 4 4 0 0 0 292 29 L 279 29 A 4 4 0 0 0 275 33 L 275 85 L 261 85 L 261 33 A 4 4 0 0 0 257 29 L 244 29 A 4 4 0 0 0 240 33 L 240 85 L 226 85 L 226 29 A 14 14 0 0 1 240 15 Z"
        />

        {/* Letter 5: 'o' (Navy Blue) */}
        <path
          className={isDarkClass}
          fillRule="evenodd"
          d="M 338 15 L 366 15 A 14 14 0 0 1 380 29 L 380 71 A 14 14 0 0 1 366 85 L 338 85 A 14 14 0 0 1 324 71 L 324 29 A 14 14 0 0 1 338 15 Z M 340 30 A 4 4 0 0 0 338 34 L 338 66 A 4 4 0 0 0 342 70 L 362 70 A 4 4 0 0 0 366 66 L 366 34 A 4 4 0 0 0 362 30 Z"
        />
      </g>

      {/* Subtitle: INFRAESTRUTURA */}
      {showSubtitle && (
        <text
          x="14"
          y="116"
          className={`${textClass} font-sans font-normal`}
          style={{ letterSpacing: '0.42em', fontSize: '24px' }}
        >
          INFRAESTRUTURA
        </text>
      )}

      {/* Sub-brand: macchina */}
      {showSubBrand && (
        <g id="macchina-group" transform="translate(305, 131)">
          {/* M Wave mark */}
          <path
            className={textClass}
            d="M 4 13 L 10 2 C 10.5 1 11.8 1 12.3 2 L 16 9 L 19.7 2 C 20.2 1 21.5 1 22 2 L 28 13 C 28.5 14 27.8 15 26.7 15 L 24 15 C 23.3 15 22.8 14.5 22.4 13.8 L 20.9 9.8 L 17.6 15.2 C 17.2 15.8 16.2 16 15.6 15.6 L 14.4 13.8 L 11.2 9.8 L 9.6 13.8 C 9.2 14.5 8.7 15 8 15 L 5.3 15 C 4.2 15 3.5 14 4 13 Z"
          />
          <text
            x="32"
            y="13"
            className={`${textClass} font-sans font-bold`}
            style={{ fontSize: '15px' }}
          >
            macchina
          </text>
        </g>
      )}
    </svg>
  );
};
