const colors = {
  gray: {
    100: "#F8F9FA",
    200: "#F0F2F3",
    300: "#D1D3D5",
    400: "#0b0e1366",
    500: "#757678",
    600: "#525457",
  },
  black: {
    base: "#000000",
    hover: "#3B3E43",
  },
  blue: {
    active: "#F6FAFF",
    base: "#0E62FF",
    hover: "#2079FF",
    light: "#5993FC;",
  },
  violet: {
    base: "#5B2DDF",
    light: "#A085E7",
  },
  red: {
    base: "#EA1A1A",
    hover: "#FF1A27",
    active: "#DE2020",
  },
  green: {
    base: "#008847",
    hover: "#00A857",
  },
}

const fontSize = {
  titleLarge: [
    "54px",
    {
      lineHeight: "64px",
    },
  ],
  title: [
    "42px",
    {
      lineHeight: "50px",
    },
  ],
  titleMobile: [
    "32px",
    {
      lineHeight: "40px",
    },
  ],
}

const fontFamily = {
  inter: ["Inter", "sans-serif"],
}

const dropShadow = {
  blue: "0 0px 2px rgba(14,98,255,1)",
  red: "0 0px 2px rgba(234,26,26,1)",
}

module.exports = require("tailwindcss/plugin")(function () {}, {
  theme: { extend: { colors, fontSize, fontFamily, dropShadow } },
})
