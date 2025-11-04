import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Function to get user-friendly error messages
  const getErrorMessage = (err) => {
    if (err.response?.data) {
      const { error, errorCode } = err.response.data;
      switch (errorCode) {
        case "USER_NOT_FOUND":
          return "Aucun compte n'existe avec cet email";

        case "INVALID_CREDENTIALS":
          return "Mot de passe incorrect. Veuillez réessayer";

        case "VALIDATION_ERROR":
          return "Veuillez remplir tous les champs correctement";

        default:
          return error || "Erreur lors de la connexion";
      }
    }
    if (err.message === "Network Error") {
      return "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.";
    }
    return "Une erreur inattendue s'est produite. Veuillez réessayer.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Login error:", err);
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
          spacing={2}
          sx={{ p: 5 }}
        >
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: "12px" }}
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
          <Button type="submit" disabled={loading} fullWidth sx={{ mt: 2 }}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Typography variant="h5">Se connecter</Typography>
            )}
          </Button>
          <Typography variant="body1">
            Pas encore de compte ?{" "}
            <a
              href="/register"
              style={{
                color: "var(--color-blue)",
                fontWeight: "bold",
                fontFamily: "Golos Text",
              }}
            >
              S'inscrire !
            </a>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
