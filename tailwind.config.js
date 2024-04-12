/** @type {import('tailwindcss').Config} */
export default {
  content: ["./views/**/*.{ejs,js}"],
  theme: {
    screens: {
      mobile: "576px",
      tablet: "768px",
      desktop: "992px",
      wide: "1200px",
      huge: "1800px"
    },
    colors: {
        primary: "#06402A",
        colorFont: "#3C3C3C",
        background: "#FFFDF3",
        white: "#fff",
        gold: "#A68448",
        gray: "#BFBFBF"
    },
    extend: {
      boxShadow: {
        card: "0 3px 20px rgb(0 0 0 / 4%)",
        header: "0 .5rem 1rem rgba(0,0,0,.15)"
    },
    },
  },
  plugins: [],
}

