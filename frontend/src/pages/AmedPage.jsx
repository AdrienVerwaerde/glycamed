import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Opacity,
  LocalFireDepartment,
  LocalDrink,
  Assessment,
  AccessTime,
  Warning,
} from "@mui/icons-material";
import Gauge from "../components/Gauge/Gauge";
import StatsCard from "../components/Stats/StatsCard";
import HealthStatus from "../components/Health/HealthStatus";
import AlertBadge from "../components/Alerts/AlertBadge";
import { consumptionAPI, alertAPI } from "../services/api";

export default function AmedPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertStats, setAlertStats] = useState(null);

  const limits = {
    sugar: 50,
    calories: 2000,
    caffeine: 400,
  };

  useEffect(() => {
    fetchStats();
    fetchAlertStats();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      fetchStats();
      fetchAlertStats();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await consumptionAPI.getAmedTodayStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des statistiques");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const sugarPercent = ((stats?.totals?.sugar || 0) / limits.sugar) * 100;
  const caffeinePercent =
    ((stats?.totals?.caffeine || 0) / limits.caffeine) * 100;

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "1400px",
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 }, 
        mt: { xs: 10, sm: 11, md: 8 }
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* En-tête avec badge d'alerte */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ mb: 3 }}
        flexWrap="wrap"
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          color="#ffffff"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
          }}
        >
          Dashboard d'Amed
        </Typography>
        <AlertBadge />
      </Box>

      <Typography 
        variant="subtitle1" 
        color="#ffffff" 
        sx={{ 
          mb: 4,
          fontSize: { xs: "0.875rem", sm: "1rem" }
        }}
      >
        Suivi en temps réel de la consommation d'aujourd'hui
      </Typography>

      {/* Statut de santé */}
      <Box sx={{ mb: 4 }}>
        <HealthStatus
          sugarPercent={sugarPercent}
          caffeinePercent={caffeinePercent}
        />
      </Box>

      {/* Cartes de statistiques rapides */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<Assessment />}
            label="Consommations"
            value={stats?.consumptionsCount || 0}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<Opacity />}
            label="Sucre total"
            value={`${(stats?.totals?.sugar || 0).toFixed(1)}g`}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<LocalDrink />}
            label="Caféine totale"
            value={`${(stats?.totals?.caffeine || 0).toFixed(0)}mg`}
            color="#f44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatsCard
            icon={<LocalFireDepartment />}
            label="Calories totales"
            value={`${(stats?.totals?.calories || 0).toFixed(0)}`}
            color="#4caf50"
          />
        </Grid>

        {/* Nouvelle carte : Jours consécutifs en alerte */}
        {alertStats && (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatsCard
              icon={<Warning />}
              label="Jours d'alerte consécutifs"
              value={alertStats.consecutiveDays}
              subtitle={
                alertStats.currentStreak
                  ? "⚠️ Série en cours"
                  : "✅ Pas d'alerte aujourd'hui"
              }
              color={alertStats.currentStreak ? "#f44336" : "#4caf50"}
            />
          </Grid>
        )}

        {/* Carte : Nombre de contributeurs */}
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

      {/* Jauges principales */}
      <Card sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          fontWeight="bold" 
          sx={{ 
            mb: 3,
            fontSize: { xs: "1.25rem", sm: "1.5rem" }
          }}
        >
          Limites quotidiennes recommandées
        </Typography>
        <Grid container spacing={{ xs: 3, sm: 4 }}>
          <Grid item xs={12} md={4}>
            <Gauge
              label="Sucre"
              amount={stats?.totals?.sugar || 0}
              max={limits.sugar}
              unit="g"
              icon={<Opacity />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Gauge
              label="Calories"
              amount={stats?.totals?.calories || 0}
              max={limits.calories}
              unit="kcal"
              icon={<LocalFireDepartment />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Gauge
              label="Caféine"
              amount={stats?.totals?.caffeine || 0}
              max={limits.caffeine}
              unit="mg"
              icon={<LocalDrink />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Dernières consommations */}
      {stats?.consumptions && stats.consumptions.length > 0 && (
        <Card sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight="bold"
            sx={{ 
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" }
            }}
          >
            Dernières consommations 🥤
          </Typography>
          <List>
            {stats.consumptions.map((consumption, index) => (
              <Box key={consumption._id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column", sm: "row" }
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: { xs: 0, sm: 56 }, mb: { xs: 1, sm: 0 } }}>
                    <Avatar sx={{ bgcolor: "#2196f3" }}>
                      {consumption.product?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        flexWrap="wrap"
                      >
                        <Typography variant="body1" fontWeight="bold">
                          {consumption.product || "Produit inconnu"}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${consumption.sugar?.toFixed(1) || 0}g sucre`}
                          color="warning"
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`${
                            consumption.caffeine?.toFixed(0) || 0
                          }mg caféine`}
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {/* Afficher le contributeur */}
                        {consumption.userId?.username && (
                          <Typography
                            variant="body2"
                            color="primary"
                            fontWeight="medium"
                            sx={{ mb: 0.5 }}
                          >
                            👤 Ajouté par {consumption.userId.username}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {consumption.location && `📍 ${consumption.location}`}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={0.5}
                          sx={{ mt: 0.5 }}
                        >
                          <AccessTime sx={{ fontSize: "0.9rem" }} />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(consumption.createdAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>
                        {consumption.notes && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontStyle: "italic",
                              display: "block",
                              mt: 0.5,
                            }}
                          >
                            💬 {consumption.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < stats.consumptions.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </Box>
            ))}
          </List>
        </Card>
      )}

      {/* Message si aucune consommation */}
      {(!stats?.consumptions || stats.consumptions.length === 0) && (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Aucune consommation enregistrée aujourd'hui 🎉
          </Typography>
        </Card>
      )}
    </Box>
  );
}
