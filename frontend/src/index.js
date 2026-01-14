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
import ErrorBoundary from "./components/ErrorBoundary";
import * as Sentry from "@sentry/react";
import { SENTRY } from "./config";

console.log("Initializing Sentry with DSN:", SENTRY.DSN);

Sentry.init({
  dsn: SENTRY.DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ConsumptionProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </ConsumptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
