// src/components/NutrientGauge.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const StyledLinearProgress = styled(LinearProgress)(({ theme, severity }) => ({
  height: 10,
  borderRadius: 5,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundColor:
      severity === "high"
        ? theme.palette.error.main
        : severity === "medium"
        ? theme.palette.warning.main
        : theme.palette.success.main,
  },
}));

export default function Gauge({
  label,
  amount = 0, // Default to 0
  max,
  unit = "mg",
  thresholds = { low: 50, medium: 75 },
  icon,
}) {
  // Ensure amount is a valid number
  const safeAmount = Number(amount) || 0;
  const percentage = Math.min((safeAmount / max) * 100, 100);

  const getSeverity = () => {
    if (percentage >= thresholds.medium) return "high";
    if (percentage >= thresholds.low) return "medium";
    return "low";
  };

  const severity = getSeverity();

  const getColor = () => {
    switch (severity) {
      case "high":
        return "#d32f2f";
      case "medium":
        return "#ed6c02";
      default:
        return "#2e7d32";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        {icon && <Box sx={{ mr: 1, color: getColor() }}>{icon}</Box>}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {safeAmount.toFixed(1)} / {max} {unit}
        </Typography>
      </Box>

      <StyledLinearProgress
        variant="determinate"
        value={percentage}
        severity={severity}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {percentage.toFixed(1)}% de la limite quotidienne
        </Typography>
        {percentage >= 100 && (
          <Typography variant="caption" color="error" fontWeight="bold">
            ⚠️ Limite dépassée
          </Typography>
        )}
      </Box>
    </Box>
  );
}
