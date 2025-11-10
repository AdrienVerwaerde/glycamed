import LoginForm from "../components/Auth/LoginForm";
import Box from "@mui/material/Box";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoginForm />
    </Box>
  );
}
