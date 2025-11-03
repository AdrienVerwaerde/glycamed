import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function LoginForm() {
  return (
    <Box>
      <Card>
        <Stack>
          <Typography variant="h2">Connexion</Typography>
          <TextField label="Email" />
          <TextField label="Mot de passe" />
        </Stack>
      </Card>
    </Box>
  );
}
