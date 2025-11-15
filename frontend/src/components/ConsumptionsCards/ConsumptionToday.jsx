import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  CircularProgress,
  Card,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Add,
  LocalDrink,
  LocalFireDepartment,
  Opacity,
} from "@mui/icons-material";
import { useConsumption } from "../../contexts/ConsumptionContext";
import ConsumptionModal from "../../components/Modals/ConsumptionModal";
import Gauge from "../Gauge/Gauge";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ConsumptionToday() {
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { totals, loading, count, consumptions } = useConsumption();

  const handleAccordionChange = async (panel) => {
    const isExpanding = expanded !== panel;
    setExpanded(isExpanding ? panel : false);
  };

  const limits = {
    sugar: 50,
    calories: 2000,
    caffeine: 400,
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} sx={{ color: "var(--color-background)" }} />
      </Box>
    );
  }

  console.log("Consumptions structure:", consumptions[0]);

  return (
    <>
      <Card sx={{ mx: 2, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Consos du jour
        </Typography>

        <Divider sx={{ mb: 2 }} />
        <Accordion
          expanded={expanded === "today"}
          onChange={() => handleAccordionChange("today")}
          square={true}
          disableGutters
          sx={{ borderRadius: "12px", mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {count} consommation{count > 1 ? "s" : ""}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {count === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 2 }}
              >
                Personne n'a balancé Amed pour le moment
              </Typography>
            ) : (
              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {consumptions.map((consumption, index) => (
                  <ListItem
                    key={consumption._id}
                    sx={{
                      borderRadius: 1,
                      mb: index < consumptions.length - 1 ? 1 : 0,
                      bgcolor: "action.hover",
                    }}
                  >
                    {/* <ListItemAvatar>
                      <Avatar
                        src={consumption.productImage || ""}
                        alt={consumption.product}
                        variant="rounded"
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {!consumption.productImage && <LocalDrink />}
                      </Avatar>
                    </ListItemAvatar> */}
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {consumption.product}
                        </Typography>
                      }
                      secondary={
                        <Box component="span">
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {formatTime(consumption.createdAt)}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            <b>Lieu :</b> {consumption.location}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            Sucre: {consumption.sugar}g • Calories:{" "}
                            {consumption.calories}kcal • Caféine:{" "}
                            {consumption.caffeine}mg
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </AccordionDetails>
        </Accordion>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Sucre"
              amount={totals?.sugar ?? 0}
              max={limits.sugar}
              unit="g"
              icon={<Opacity />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Calories"
              amount={totals?.calories ?? 0}
              max={limits.calories}
              unit="kcal"
              icon={<LocalFireDepartment />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: "100%" }}>
            <Gauge
              label="Caféine"
              amount={totals?.caffeine ?? 0}
              max={limits.caffeine}
              unit="mg"
              icon={<LocalDrink />}
              thresholds={{ low: 60, medium: 80 }}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 4, width: "100%" }}
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
        >
          Ajouter une consommation
        </Button>

        {/* Modal to add consumption  */}
        <ConsumptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Card>
    </>
  );
}
