/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        serenity: '#E2E8EF',
        teal: '#03AB99',
        sage: '#7FA091',
        forest: '#01413A'
      },
    }
  },
  plugins: [],
}

