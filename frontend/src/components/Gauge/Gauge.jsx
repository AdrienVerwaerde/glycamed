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
        ? "var(--color-red)"
        : severity === "medium"
        ? "var(--color-yellow)"
        : "var(--color-blue)",
  },
}));

export default function Gauge({
  label,
  amount = 0,
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
        return "var(--color-red)";
      case "medium":
        return "var(--color-yellow)";
      default:
        return "var(--color-blue)";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 1.5,
          gap: 1
        }}
      >
        {icon && <Box sx={{ color: getColor(), fontSize: "1.5rem" }}>{icon}</Box>}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: "1rem", sm: "1.15rem" }
          }}
        >
          {label}
        </Typography>
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" }
          }}
        >
          {safeAmount.toFixed(1)}
          <Typography 
            component="span" 
            variant="h6" 
            color="text.secondary"
            sx={{ ml: 0.5 }}
          >
            / {max} {unit}
          </Typography>
        </Typography>
      </Box>

      <StyledLinearProgress
        variant="determinate"
        value={percentage}
        severity={severity}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, flexWrap: "wrap", gap: 1 }}>
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