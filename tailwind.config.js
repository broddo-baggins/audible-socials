/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Custom tablet breakpoint for iPad
      'tablet': {'min': '768px', 'max': '1023px'},
    },
    extend: {
      colors: {
        audible: {
          // Audible Brand Colors - Exact Match
          orange: '#FF6B35',              // Audible's signature orange
          'orange-dark': '#E55A2B',       // Darker orange for hovers
          'orange-light': '#FF855A',      // Lighter orange for highlights

          // Background Colors - Clean and Minimal
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },

          // Text Colors
          'text-primary': '#111827',      // Dark text for readability
          'text-secondary': '#6B7280',    // Medium gray for secondary text
          'text-tertiary': '#9CA3AF',     // Light gray for muted text
          'text-inverse': '#FFFFFF',      // White text for dark backgrounds

          // Player Text Colors
          'player-text': '#FFFFFF',       // White text for player
          'player-text-muted': '#9CA3AF', // Muted text for player
          'player-subtitle': '#D1D5DB',   // Subtitle text for player

          // UI Element Colors
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
          divider: '#E5E7EB',
          'surface': '#F9FAFB',
          'surface-hover': '#F3F4F6',

          // Interactive States
          hover: '#F3F4F6',
          focus: '#FF6B35',
          active: '#E55A2B',

          // Status Colors
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',

          // Content Type Colors
          original: '#8B5CF6',            // Purple for originals
          podcast: '#3B82F6',            // Blue for podcasts
          'new-release': '#10B981',      // Green for new releases
          bestseller: '#F59E0B',         // Gold for bestsellers

          // Legacy EchoRead colors
          echo: {
            orange: '#F27024',
            'orange-dark': '#E55A2B',
            cream: '#FEFDFB',
            beige: '#F5F1ED',
            charcoal: '#15191E',

            // Echo Text Colors
            'text-primary': '#111827',
            'text-secondary': '#6B7280',
            'text-tertiary': '#9CA3AF',

            // Echo UI Colors
            border: '#E5E7EB',
            divider: '#E5E7EB',

            // Echo Status Colors
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6',
          },

          // Player Component Colors (Dark Theme)
          'player-bg': '#0A0E13',
          'player-surface': '#15191E',
          'player-elevated': '#1A1E23',
          'player-border': '#2A3038',
          'player-hover': 'rgba(255, 255, 255, 0.1)',
          charcoal: '#15191E',
        },
      },
      fontFamily: {
        // Clean sans-serif for UI
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Friendly serif for book titles
        serif: ['Literata', 'Georgia', 'Cambria', 'serif'],
        // Alternative rounded sans
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'header': '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}





