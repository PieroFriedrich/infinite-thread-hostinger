/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-paused": "spin-paused 6s linear infinite",
      },
      keyframes: {
        "spin-paused": {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(90deg)" },
          "50%": { transform: "rotate(180deg)" },
          "75%": { transform: "rotate(270deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      colors: {
        /*
        myblue: "var(--myblue)",
        mybeige: "var(--mybeige)",
        myred: "var(--myred)",
        myorange: "var(--myorange)",
        myyellow: "var(--myyellow)",
        */
        mycolor1: "var(--mycolor1)",
        mycolor2: "var(--mycolor2)",
        mycolor3: "var(--mycolor3)",
        mycolor4: "var(--mycolor4)",
        mycolor5: "var(--mycolor5)",
      },
    },
  },
  plugins: [],
};
