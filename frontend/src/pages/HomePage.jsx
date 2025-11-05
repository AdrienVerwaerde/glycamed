import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Gauge from "../components/Gauge/Gauge";

export default function HomePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        my: 3,
      }}
    >
      <Card
        sx={{
          borderRadius: "12px",
          minHeight: "80%",
          width: "380px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid var(--color-yellow)",
        }}
      >
        <Gauge />
      </Card>
    </Box>
  );
}
