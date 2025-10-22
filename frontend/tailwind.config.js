/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'champagne-peach': '#F2CDBF',
        'champagne-contrast': '#111111',
        'champagne-accent': '#8B5E4B',
        'champagne-100': '#FBF1EE',
        'champagne-200': '#F7D7C8',
      }
    },
  },
  plugins: [],
}
