import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Card,
  Typography,
  Divider,
} from "@mui/material";
import {
  Add,
  LocalDrink,
  LocalFireDepartment,
  Opacity,
} from "@mui/icons-material";
import { useConsumption } from "../contexts/ConsumptionContext";
import Gauge from "../components/Gauge/Gauge";
import ConsumptionModal from "../components/Modals/ConsumptionModal";
import ConsumptionRecap from "../components/ConsumptionsCards/ConsumptionRecap";

export default function HomePage() {
  const { totals, loading, error } = useConsumption();
  const [modalOpen, setModalOpen] = useState(false);

  const limits = {
    sugar: 50,
    calories: 2000,
    caffeine: 400,
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        flexDirection: "column",
        justifyContent: "center",
        mt: 10,
        mb: 2,
      }}
    >
      {/* Today's consumptions card  */}
      <Card sx={{ mx: 2, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Consos du jour
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Sucre"
              amount={totals?.sugar ?? 0}
              max={limits.sugar}
              unit="g"
              icon={<Opacity />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Calories"
              amount={totals?.calories ?? 0}
              max={limits.calories}
              unit="kcal"
              icon={<LocalFireDepartment />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Caféine"
              amount={totals?.caffeine ?? 0}
              max={limits.caffeine}
              unit="mg"
              icon={<LocalDrink />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 4, width: "100%" }}
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
        >
          Ajouter une consommation
        </Button>

        {/* Modal to add consumption  */}
        <ConsumptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Card>

      {/* Consumptions recap card */}
      <ConsumptionRecap />
    </Box>
  );
}
