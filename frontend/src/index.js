import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
import { AuthProvider } from "./contexts/AuthContext";
import React from "react";
import { ConsumptionProvider } from "./contexts/ConsumptionContext";
import { SnackbarProvider } from "./contexts/SnackbarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <ConsumptionProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </ConsumptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
