import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E50914',
          hover: '#F40612',
        },
        dark: {
          DEFAULT: '#141414',
          lighter: '#181818',
          light: '#222222',
        },
        sword: {
          DEFAULT: '#E8E9EB',
          muted: '#C8C9CB',
          glow: '0 0 3px rgba(255,255,255,0.3)',
        },
      },
      spacing: {
        '128': '32rem',
      },
      height: {
        'screen-90': '90vh',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-to-b-dark': 'linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0.8) 60%, rgba(20, 20, 20, 1) 100%)',
      },
    },
  },
  plugins: [],
}

export default config 