/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
