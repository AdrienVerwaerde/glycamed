import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const titles = {
  fontFamily: "Rubik Mono One",
};

let theme = createTheme({
  typography: {
    fontFamily: "Work Sans",

    h1: { ...titles },
    h2: { ...titles },
    h3: { ...titles },
    h5: {
      fontFamily: "Golos Text",
      fontSize: "20px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-yellow)",
          borderRadius: "12px",
          padding: "12px 14px",
          color: "var(--color-background)",
          "&:hover": {
            boxShadow: "0px 0px 8px var(--color-yellow)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "var(--color-background)",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--color-yellow)",
              borderRadius: "12px",
            },
            "&:hover fieldset": {
              borderColor: "var(--color-yellow)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--color-yellow)",
            },
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
