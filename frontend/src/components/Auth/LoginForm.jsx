import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function LoginForm() {
  return (
    <Box>
      <Card
        sx={{
          borderRadius: "12px",
          height: "405px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
        <Stack spacing={2} sx={{ p: 5 }}>
          <TextField label="Email" />
          <TextField label="Mot de passe" />
          <Button>
            <Typography variant="h5">Se connecter</Typography>
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
