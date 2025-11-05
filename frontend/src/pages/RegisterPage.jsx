import Box from "@mui/material/Box";
import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <RegisterForm />
    </Box>
  );
}
