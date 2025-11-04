import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/fonts.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AmedPage from "./pages/AmedPage";

export default function App() {
  return (
    <div className="App">
      {/* Routes */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/amed"
            element={
              <ProtectedRoute>
                <AmedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
