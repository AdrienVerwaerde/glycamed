import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

export default function Gauge({ sugarAmount, maxSugar = 100 }) {
  const percentage = (sugarAmount / maxSugar) * 100;

  const getColor = () => {
    if (percentage < 50) return "var(--color-blue)";
    if (percentage < 75) return "var(--color-yellow)";
    return "var(--color-red)";
  };

  // Marks for the slider
  const marks = [
    { value: 0, label: "0" },
    { value: maxSugar * 0.25, label: `${maxSugar * 0.25}` },
    { value: maxSugar * 0.5, label: `${maxSugar * 0.5}` },
    { value: maxSugar * 0.75, label: `${maxSugar * 0.75}` },
    { value: maxSugar, label: `${maxSugar}` },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mb: 2,
        }}
      >
        <Typography variant="h6">Sucre total: {sugarAmount}mg</Typography>
        <Typography variant="caption">
          {percentage.toFixed(1)}% de la limite recommandée
        </Typography>
      </Box>

      <Slider
        value={sugarAmount}
        min={0}
        max={maxSugar}
        marks={marks}
        disabled
        sx={{
          minWidth: "280px",
          pointerEvents: "none",
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            backgroundColor: getColor(),
            border: "3px solid #fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          },
          "& .MuiSlider-track": {
            backgroundColor: getColor(),
            border: "none",
            height: 10,
            transition: "background-color 0.3s ease",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#e0e0e0",
            height: 10,
            opacity: 1,
          },
          "& .MuiSlider-mark": {
            backgroundColor: "#bdbdbd",
            height: 12,
            width: 2,
          },
          "& .MuiSlider-markLabel": {
            fontSize: "0.75rem",
            color: "text.secondary",
          },
        }}
      />
    </Box>
  );
}
