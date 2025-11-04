import Box from "@mui/material/Box";
import Header from "../components/Header/Header";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Header />
    </Box>
  );
}
