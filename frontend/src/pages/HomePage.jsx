import { Box } from "@mui/material";
import ConsumptionToday from "../components/ConsumptionsCards/ConsumptionToday";
import ConsumptionRecap from "../components/ConsumptionsCards/ConsumptionRecap";

export default function HomePage() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        flexDirection: "column",
        justifyContent: "center",
        mt: 10,
        mb: 2,
      }}
    >
      {/* Today's consumptions card  */}
      <ConsumptionToday />
      {/* Consumptions recap card */}
      <ConsumptionRecap />
    </Box>
  );
}
