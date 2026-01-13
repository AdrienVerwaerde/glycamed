import { useState } from "react";
import {
  Card,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Gauge from "../Gauge/Gauge";
import DownloadCSVButton from "../Buttons/DownloadCSVButton";
import { consumptionAPI } from "../../services/api";
import { useLocation } from "react-router-dom";
import { HEALTH_LIMITS } from "../../config";

export default function ConsumptionRecap({ showDownloadButtons = false }) {
  const location = useLocation();
  const isReportsPage = location.pathname === "/reports";
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
    sugar: HEALTH_LIMITS.SUGAR_MAX,
    calories: HEALTH_LIMITS.CALORIES_MAX,
    caffeine: HEALTH_LIMITS.CAFFEINE_MAX,
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
        const now = new Date();
        days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
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
          <CircularProgress
            sx={{ color: "var(--color-background)" }}
            size={24}
          />
        </Box>
      );
    }

    const data = recapData[period];
    if (!data) return null;

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

  const renderAccordion = (period, title) => {
    return (
      <Accordion
        expanded={expanded === period}
        onChange={() => handleAccordionChange(period)}
        square={true}
        disableGutters
        sx={{ borderRadius: "12px" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            "& .MuiAccordionSummary-content": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            },
          }}
        >
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderAccordionContent(period)}
          {showDownloadButtons && (
            <DownloadCSVButton
              data={recapData[period]}
              period={period}
              disabled={loading[period]}
            />
          )}
        </AccordionDetails>
      </Accordion>
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
        {isReportsPage ? ("Consommations quotidiennes") : ("Récap consos")}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {renderAccordion("last3Days", "3 derniers jours")}
      {renderAccordion("weekly", "Cette semaine")}
      {renderAccordion("monthly", "Ce mois-ci")}
    </Card>
  );
}
