/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        myblue: "var(--myblue)",
        mybeige: "var(--mybeige)",
        myred: "var(--myred)",
        myorange: "var(--myorange)",
        myyellow: "var(--myyellow)",
      },
    },
  },
  plugins: [],
};
