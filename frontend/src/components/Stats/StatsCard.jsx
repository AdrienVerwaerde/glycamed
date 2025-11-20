import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatsCard({ 
  icon, 
  label, 
  value, 
  subtitle,
  color = "#1976d2" 
}) {
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
        <Box display="flex" alignItems="center" mb={2} gap={1.5}>
          <Box
            sx={{
              color,
              fontSize: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#ffffff",
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" }
            }}
          >
            {label}
          </Typography>
        </Box>
        <Typography 
          variant="h3" 
          component="div" 
          fontWeight="bold"
          sx={{ 
            color: "#ffffff",
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" }
          }}
        >
          {value}
        </Typography>
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: "#ffffff",
              opacity: 0.8,
              mt: 1,
              display: "block"
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}