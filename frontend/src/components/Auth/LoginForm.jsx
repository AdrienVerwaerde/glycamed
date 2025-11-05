import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      let errorMessage = "Une erreur s'est produite";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message === "Network Error") {
        errorMessage = "Impossible de se connecter au serveur";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card
        sx={{
          borderRadius: "12px",
          minHeight: "405px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid var(--color-yellow)",
        }}
      >
        <Stack sx={{ alignSelf: "flex-start", pt: 5 }}>
          <Typography
            variant="h4"
            sx={{
              alignSelf: "flex-start",
              pl: 5,
              fontFamily: "Rubik Vinyl",
              color: "var(--color-yellow)",
            }}
          >
            ParAmedic
          </Typography>
          <Typography variant="h3" sx={{ pl: 5 }}>
            Connexion
          </Typography>
        </Stack>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          noValidate
          spacing={2}
          sx={{ p: 5 }}
        >
          {successMessage && (
            <Alert
              severity="success"
              sx={{ borderRadius: "12px", maxWidth: "248px" }}
            >
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "12px", maxWidth: "248px" }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            fullWidth
            autoComplete="email"
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            fullWidth
            autoComplete="current-password"
          />
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            sx={{ mt: 2, width: "280px" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h5">Se connecter</Typography>
            )}
          </Button>
          <Typography variant="body1">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--color-blue)",
                fontWeight: "bold",
                fontFamily: "Golos Text",
              }}
            >
              S'inscrire !
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
