import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Opacity,
  LocalFireDepartment,
  LocalDrink,
  Assessment,
  Warning,
} from "@mui/icons-material";
import Gauge from "../components/Gauge/Gauge";
import StatsCard from "../components/Stats/StatsCard";
import HealthStatus from "../components/Health/HealthStatus";
import AlertBadge from "../components/Alerts/AlertBadge";
import { alertAPI } from "../services/api";
import { useConsumption } from "../contexts/ConsumptionContext";
import { HEALTH_LIMITS } from "../config";

export default function AmedPage() {
  const { totals, stats, loading, error, consumptions } = useConsumption();

  const [alertStats, setAlertStats] = useState(null);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const limits = {
    sugar: HEALTH_LIMITS.SUGAR_MAX,
    calories: HEALTH_LIMITS.CALORIES_MAX,
    caffeine: HEALTH_LIMITS.CAFFEINE_MAX,
  };

  useEffect(() => {
    fetchAlertStats();
    const interval = setInterval(fetchAlertStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertStats = async () => {
    try {
      const response = await alertAPI.getConsecutive();
      setAlertStats(response.data.data);
    } catch (error) {
      console.error("Error fetching alert stats:", error);
    }
  };

  if (loading && !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const sugarPercent = ((totals?.sugar || 0) / limits.sugar) * 100;
  const caffeinePercent = ((totals?.caffeine || 0) / limits.caffeine) * 100;

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
        mt: { xs: 10, sm: 11, md: 8 },
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }} flexWrap="wrap">
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          color="#ffffff"
          sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" } }}
        >
          Dashboard d'Amed
        </Typography>
        <AlertBadge />
      </Box>

      <Typography
        variant="subtitle1"
        color="#ffffff"
        sx={{ mb: 4, fontSize: { xs: "0.875rem", sm: "1rem" } }}
      >
        Suivi en temps réel de la consommation d'aujourd'hui
      </Typography>

      <Box sx={{ mb: 4 }}>
        <HealthStatus sugarPercent={sugarPercent} caffeinePercent={caffeinePercent} />
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<Assessment />}
            label="Consommations"
            value={consumptions.length}
            color="#2196f3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<Opacity />}
            label="Sucre total"
            value={`${(totals?.sugar || 0).toFixed(1)}g`}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<LocalDrink />}
            label="Caféine totale"
            value={`${(totals?.caffeine || 0).toFixed(0)}mg`}
            color="#f44336"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<LocalFireDepartment />}
            label="Calories totales"
            value={`${(totals?.calories || 0).toFixed(0)}`}
            color="#4caf50"
          />
        </Grid>

        {alertStats && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard
              icon={<Warning />}
              label="Jours d'alerte consécutifs"
              value={alertStats.consecutiveDays}
              subtitle={
                alertStats.currentStreak ? "⚠️ Série en cours" : "✅ Pas d'alerte aujourd'hui"
              }
              color={alertStats.currentStreak ? "#f44336" : "#4caf50"}
            />
          </Grid>
        )}

        {stats?.contributorsCount !== undefined && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard
              icon="👥"
              label="Contributeurs aujourd'hui"
              value={stats.contributorsCount}
              color="#9c27b0"
            />
          </Grid>
        )}
      </Grid>

      <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Limites quotidiennes recommandées
        </Typography>

        <Grid container spacing={{ xs: 3, sm: 4 }}>
          <Grid item xs={12} md={4}>
            <Gauge
              label="Sucre"
              amount={totals?.sugar || 0}
              max={limits.sugar}
              unit="g"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Gauge
              label="Calories"
              amount={totals?.calories || 0}
              max={limits.calories}
              unit="kcal"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Gauge
              label="Caféine"
              amount={totals?.caffeine || 0}
              max={limits.caffeine}
              unit="mg"
            />
          </Grid>
        </Grid>
      </Card>

      {/* ==== LISTE DES CONSOMMATIONS ==== */}
      {consumptions.length > 0 && (
        <Card sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Consommations reportées aujourd'hui
          </Typography>

          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {consumptions.map((consumption, index) => (
              <ListItem
                key={consumption._id}
                sx={{
                  borderRadius: 1,
                  mb: index < consumptions.length - 1 ? 1 : 0,
                  bgcolor: "action.hover",
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {consumption.product}
                    </Typography>
                  }
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="text.secondary" display="block">
                        {formatTime(consumption.createdAt)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" display="block">
                        <b>Lieu :</b> {consumption.location}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Sucre: {consumption.sugar}g • Calories: {consumption.calories}kcal • Caféine: {consumption.caffeine}mg
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}

      {consumptions.length === 0 && (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Aucune consommation enregistrée aujourd'hui 🎉
          </Typography>
        </Card>
      )}
    </Box>
  );
}