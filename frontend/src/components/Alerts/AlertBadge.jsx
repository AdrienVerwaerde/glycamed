import { Badge, Tooltip } from "@mui/material";
import { Warning, Error as ErrorIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { alertAPI } from "../../services/api";

export default function AlertBadge() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayAlert();
  }, []);

  const fetchTodayAlert = async () => {
    try {
      const response = await alertAPI.getToday();
      setAlert(response.data.data);
    } catch (error) {
      console.error("Error fetching today's alert:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !alert) return null;

  const getAlertConfig = () => {
    switch (alert.type) {
      case "both":
        return {
          icon: <ErrorIcon sx={{ color: "#f44336" }} />,
          message: "⚠️ Sucre ET caféine dépassés",
          color: "error",
        };
      case "sugar":
        return {
          icon: <Warning sx={{ color: "#ff9800" }} />,
          message: "⚠️ Limite de sucre dépassée",
          color: "warning",
        };
      case "caffeine":
        return {
          icon: <Warning sx={{ color: "#ff9800" }} />,
          message: "⚠️ Limite de caféine dépassée",
          color: "warning",
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  return (
    <Tooltip title={config.message} arrow>
      <Badge
        badgeContent=" "
        color={config.color}
        variant="dot"
        sx={{
          "& .MuiBadge-badge": {
            right: -3,
            top: 3,
            width: 12,
            height: 12,
            borderRadius: "50%",
          },
        }}
      >
        {config.icon}
      </Badge>
    </Tooltip>
  );
}