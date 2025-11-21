import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import ContributorCard from "../components/Leaderboard/ContributorCard";
import { useConsumption } from "../contexts/ConsumptionContext";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function ContributorsPage() {
  const { leaderboard, loading } = useConsumption();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <EmojiEventsIcon
          sx={{ marginTop: 5, fontSize: 80, color: "warning.main", mb: 2 }}
        />
        <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
          Classement des Contributeurs
        </Typography>
        <Typography variant="body1" color="white">
          Les héros qui veillent sur Amed
        </Typography>
      </Box>

      {/* Leaderboard */}
      {!leaderboard || leaderboard.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          Aucun contributeur pour le moment
        </Typography>
      ) : (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="flex-start"
        >
          {leaderboard.map((contributor, index) => (
            <Grid
              item
              xs={12}
              sm={10}
              md={6}
              lg={4}
              display="flex"
              justifyContent="center"
              key={contributor.userId}
            >
              <ContributorCard contributor={contributor} rank={index + 1} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
