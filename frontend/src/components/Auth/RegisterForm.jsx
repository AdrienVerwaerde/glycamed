import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Frontend validation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/users",
        {
          email,
          password,
          username,
          role: "user",
        }
      );

      if (response.data.success) {
        // Registration successful, redirect to login
        navigate("/login", {
          state: {
            message:
              "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
          },
        });
      }
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Une erreur s'est produite";

      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.messages) {
        errorMessage = err.response.data.messages.join(", ");
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
      <CloseIcon
        sx={{
          color: "var(--color-yellow)",
          position: "absolute",
          top: 15,
          right: 25,
          fontSize: "32px",
        }}
        onClick={() => navigate("/")}
      />
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
          <Typography variant="h3" sx={{ pl: 5, fontSize: "28px" }}>
            Inscription
          </Typography>
        </Stack>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          noValidate
          spacing={2}
          sx={{ p: 5 }}
        >
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
            label="Nom d'utilisateur"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            fullWidth
            autoComplete="username"
          />
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
            autoComplete="new-password"
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            fullWidth
            autoComplete="new-password"
          />
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            sx={{ mt: 2, width: "280px" }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{ color: "var(--color-background)" }}
              />
            ) : (
              <Typography variant="h5">S'inscrire</Typography>
            )}
          </Button>
          <Typography variant="body1">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              style={{
                color: "var(--color-blue)",
                fontWeight: "bold",
                fontFamily: "Golos Text",
              }}
            >
              Se connecter !
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
