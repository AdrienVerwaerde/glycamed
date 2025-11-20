import Chip from "@mui/material/Chip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function BadgeChip({ type, value }) {
  const badges = {
    topMonthly: {
      icon: <EmojiEventsIcon />,
      label: "Top du mois",
      color: "warning",
    },
    streak: {
      icon: <LocalFireDepartmentIcon />,
      label: `${value} jours`,
      color: "error",
    },
    firstToday: {
      icon: <VisibilityIcon />,
      label: "Première contribution",
      color: "info",
    },
  };

  const badge = badges[type];
  if (!badge) return null;

  return (
    <Chip
      icon={badge.icon}
      label={badge.label}
      color={badge.color}
      size="small"
      sx={{ fontWeight: 600 }}
    />
  );
}