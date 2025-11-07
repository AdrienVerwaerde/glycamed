// src/pages/HomePage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Tableau de bord
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
          size="large"
        >
          Ajouter une consommation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Gauge
              label="Sucre"
              amount={totals?.sugar ?? 0}
              max={limits.sugar}
              unit="g"
              icon={<Opacity />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Gauge
              label="Calories"
              amount={totals?.calories ?? 0}
              max={limits.calories}
              unit="kcal"
              icon={<LocalFireDepartment />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Gauge
              label="Caféine"
              amount={totals?.caffeine ?? 0}
              max={limits.caffeine}
              unit="mg"
              icon={<LocalDrink />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Paper>
        </Grid>
      </Grid>

      <ConsumptionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Container>
  );
}
