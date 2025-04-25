
export const animations = {
  keyframes: {
    "fade-up": {
      "0%": {
        opacity: "0",
        transform: "translateY(20px)",
      },
      "100%": {
        opacity: "1",
        transform: "translateY(0)",
      },
    },
    "fade-in": {
      "0%": {
        opacity: "0",
      },
      "100%": {
        opacity: "1",
      },
    },
    "slide-in": {
      "0%": {
        transform: "translateX(-100%)",
      },
      "100%": {
        transform: "translateX(0)",
      },
    },
    "slide-out": {
      "0%": {
        transform: "translateX(0)",
      },
      "100%": {
        transform: "translateX(-100%)",
      },
    },
  },
  animation: {
    "fade-up": "fade-up 0.5s ease-out",
    "fade-in": "fade-in 0.3s ease-out",
    "slide-in": "slide-in 0.3s ease-out",
    "slide-out": "slide-out 0.3s ease-out",
  },
};

