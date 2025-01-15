/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navbar: "#eab308",
        main: "#fdb91a",
        dark: "#212121",
        "link-color": "#008934",
        "price-color": "#FF5207",
        "bg-color": "#EFEFEF",
        "pane-color": "#FFF",
      },
      aspectRatio: {
        "item-card": "3/5",
        "store-image": "3 / 1",
      },
      spacing: {
        670: "670px",
        450: "450px",
      },
    },
  },
  plugins: [],
};
