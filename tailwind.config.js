/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        gray: {
          "100": "#fefefe",
          "200": "#171a1f",
          "300": "rgba(0, 0, 0, 0)",
        },
        lightslategray: "#9095a1",
        silver: {
          "100": "#bdc1ca",
          "200": "#c7bfb6",
        },
        cadetblue: {
          "100": "#62a2aa",
          "200": "#478a91",
        },
        whitesmoke: "#f0f0f0",
        lightgray: {
          "100": "#d6d6d6",
          "200": "#d0cfcf",
        },
        darkslategray: "#4a4d52",
        gainsboro: "#e6e6e6",
        dimgray: "#565d6d",
        peru: "#ac7427",
        lightsteelblue: "#a8c2d3",
        black: "#000",
      },
      spacing: {},
      fontFamily: {
        inter: "Inter",
        epilogue: "Epilogue",
      },
      borderRadius: {
        "3xl": "22px",
        "2xl": "21px",
        "41xl": "60px",
        "8xl": "27px",
        "4xs": "9px",
        smi: "13px",
        "3xs": "10px",
        mini: "15px",
      },
    },
    fontSize: {
      mini: "15px",
      sm: "14px",
      "14xl": "33px",
      xl: "20px",
      "7xl": "26px",
      "2xs": "11px",
      smi: "13px",
      lg: "18px",
      xs: "12px",
      "5xl": "24px",
      lgi: "19px",
      mid: "17px",
      "16xl": "35px",
      "2xl": "21px",
      "9xl": "28px",
      base: "16px",
      "39xl": "58px",
      "27xl": "46px",
      "12xl": "31px",
      "3xl": "22px",
      "6xl": "25px",
      "11xl": "30px",
      "13xl": "32px",
      "21xl": "40px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      mq1125: {
        raw: "screen and (max-width: 1125px)",
      },
      mq1050: {
        raw: "screen and (max-width: 1050px)",
      },
      mq1000: {
        raw: "screen and (max-width: 1000px)",
      },
      mq975: {
        raw: "screen and (max-width: 975px)",
      },
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq725: {
        raw: "screen and (max-width: 725px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
