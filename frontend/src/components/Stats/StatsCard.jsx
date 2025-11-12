import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatsCard({ icon, label, value, color = "#1976d2" }) {
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              color,
              fontSize: "2rem",
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
