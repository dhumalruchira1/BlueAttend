export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        navy: '#0F172A',
        lightblue: '#EFF6FF',
        bg: '#F8FAFC',
        success: '#16A34A',
        warn: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};