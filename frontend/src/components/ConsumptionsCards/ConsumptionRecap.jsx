// src/components/ConsumptionRecap/ConsumptionRecap.jsx

import { useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalDrink, LocalFireDepartment, Opacity } from "@mui/icons-material";
import Gauge from "../Gauge/Gauge";
import { consumptionAPI } from "../../services/api";

export default function ConsumptionRecap() {
  const [recapData, setRecapData] = useState({
    last3Days: null,
    weekly: null,
    monthly: null,
  });
  const [loading, setLoading] = useState({
    last3Days: false,
    weekly: false,
    monthly: false,
  });
  const [expanded, setExpanded] = useState(false);

  // Daily limits
  const dailyLimits = {
    sugar: 50, // g per day
    calories: 2000, // kcal per day
    caffeine: 400, // mg per day
  };

  // Calculate limits based on period
  const getPeriodLimits = (period) => {
    let days;
    switch (period) {
      case "last3Days":
        days = 3;
        break;
      case "weekly":
        days = 7;
        break;
      case "monthly":
        days = 30;
        break;
      default:
        days = 1;
    }

    return {
      sugar: dailyLimits.sugar * days,
      calories: dailyLimits.calories * days,
      caffeine: dailyLimits.caffeine * days,
      days,
    };
  };

  const handleAccordionChange = async (panel) => {
    const isExpanding = expanded !== panel;
    setExpanded(isExpanding ? panel : false);

    if (isExpanding && !recapData[panel]) {
      await fetchRecapData(panel);
    }
  };

  const fetchRecapData = async (period) => {
    setLoading((prev) => ({ ...prev, [period]: true }));

    try {
      let response;
      switch (period) {
        case "last3Days":
          response = await consumptionAPI.getLastNDays(3);
          break;
        case "weekly":
          response = await consumptionAPI.getWeeklyConsumptions();
          break;
        case "monthly":
          response = await consumptionAPI.getMonthlyConsumptions();
          break;
        default:
          return;
      }

      setRecapData((prev) => ({
        ...prev,
        [period]: response.data.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${period} data:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [period]: false }));
    }
  };

  // Render gauges with period-specific limits
  const renderGauges = (totals, period) => {
    if (!totals) return null;

    const limits = getPeriodLimits(period);

    return (
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <Gauge
            label="Sucre"
            amount={totals.sugar}
            max={limits.sugar}
            unit="g"
          />
          <Gauge
            label="Calories"
            amount={totals.calories}
            max={limits.calories}
            unit="kcal"
          />
          <Gauge
            label="Caféine"
            amount={totals.caffeine}
            max={limits.caffeine}
            unit="mg"
          />
        </Stack>
      </Box>
    );
  };

  const renderAccordionContent = (period) => {
    if (loading[period]) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    const data = recapData[period];
    if (!data) return null;

    const limits = getPeriodLimits(period);

    return (
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {data.count} consommation{data.count > 1 ? "s" : ""} enregistrée
            {data.count > 1 ? "s" : ""}
          </Typography>
        </Box>

        {renderGauges(data.totals, period)}
      </Box>
    );
  };

  return (
    <Card
      sx={{
        mx: 2,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Récap consos
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Last 3 Days */}
      <Accordion
        expanded={expanded === "last3Days"}
        onChange={() => handleAccordionChange("last3Days")}
        square={true}
        disableGutters
        sx={{ borderRadius: "12px" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">3 derniers jours</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderAccordionContent("last3Days")}
        </AccordionDetails>
      </Accordion>

      {/* Weekly */}
      <Accordion
        expanded={expanded === "weekly"}
        onChange={() => handleAccordionChange("weekly")}
        square={true}
        disableGutters
        sx={{ borderRadius: "12px" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cette semaine</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderAccordionContent("weekly")}</AccordionDetails>
      </Accordion>

      {/* Monthly */}
      <Accordion
        expanded={expanded === "monthly"}
        onChange={() => handleAccordionChange("monthly")}
        square={true}
        disableGutters
        sx={{ borderRadius: "12px" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Ce mois-ci</Typography>
        </AccordionSummary>
        <AccordionDetails>{renderAccordionContent("monthly")}</AccordionDetails>
      </Accordion>
    </Card>
  );
}
