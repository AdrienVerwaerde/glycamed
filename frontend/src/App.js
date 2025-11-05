import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/fonts.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AmedPage from "./pages/AmedPage";
import Layout from "./components/Layout";

export default function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/amed"
              element={
                <ProtectedRoute>
                  <AmedPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
