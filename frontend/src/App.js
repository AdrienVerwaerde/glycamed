import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/fonts.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ProtectedAmedRoute from "./components/Auth/ProtectedAmedRoute";
import AmedPage from "./pages/AmedPage";
import Layout from "./components/Layout";
import ContributorsPage from "./pages/ContributorsPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="/amed"
              element={
                <ProtectedAmedRoute>
                  <AmedPage />
                </ProtectedAmedRoute>
              }
            />
            <Route
              path="/contributors"
              element={
                <ProtectedRoute>
                  <ContributorsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedAmedRoute>
                  <ReportsPage />
                </ProtectedAmedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
