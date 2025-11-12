import { Alert, Box, Typography } from "@mui/material";
import { CheckCircle, Warning, Error } from "@mui/icons-material";

export default function HealthStatus({ sugarPercent, caffeinePercent }) {
  const getStatus = () => {
    const sugarOver = sugarPercent >= 100;
    const caffeineOver = caffeinePercent >= 100;

    if (sugarOver && caffeineOver) {
      return {
        severity: "error",
        icon: <Error />,
        message: "🚨 Toutes les limites dépassées",
      };
    }

    if (sugarOver) {
      return {
        severity: "warning",
        icon: <Warning />,
        message: "⚠️ Limite de sucre dépassée",
      };
    }

    if (caffeineOver) {
      return {
        severity: "warning",
        icon: <Warning />,
        message: "⚠️ Limite de caféine dépassée",
      };
    }

    return {
      severity: "success",
      icon: <CheckCircle />,
      message: "✅ Sous les limites",
    };
  };

  const status = getStatus();

  return (
    <Alert
      severity={status.severity}
      icon={status.icon}
      sx={{
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderRadius: 2,
        "& .MuiAlert-icon": {
          fontSize: "2rem",
        },
      }}
    >
      <Box>
        <Typography variant="h6" component="span">
          {status.message}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Sucre: {sugarPercent.toFixed(1)}% • Caféine:{" "}
          {caffeinePercent.toFixed(1)}%
        </Typography>
      </Box>
    </Alert>
  );
}
