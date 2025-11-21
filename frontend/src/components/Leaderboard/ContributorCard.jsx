import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import BadgeChip from "./BadgeChip";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function ContributorCard({ contributor, rank }) {
  const { username, totalContributions, lastContribution, badges } =
    contributor;

  const safeBadges = badges || {
    isTopMonthly: false,
    streakDays: 0,
    isFirstToday: false,
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "gold";
    if (rank === 2) return "silver";
    if (rank === 3) return "#cd7f32"; // bronze
    return "grey.500";
  };

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "visible",
        minHeight: 180,
        // minWidth: 275,
        // width: 290,
        "&:hover": { transform: "scale(1.02)", transition: "0.2s" },
      }}
    >
      {/* Numéro de classement */}
      <Box
        sx={{
          position: "absolute",
          top: -10,
          left: -10,
          bgcolor: getRankColor(rank),
          color: "white",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: 18,
          boxShadow: 2,
        }}
      >
        {rank}
      </Box>

      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: getRankColor(rank), width: 56, height: 56 }}>
            {username[0]?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h6" fontWeight="bold">
              {username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalContributions} contribution
              {totalContributions > 1 ? "s" : ""}
            </Typography>
          </Box>
        </Stack>

        {/* Badges */}
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mb={2} minHeight={36}>
          {badges.isTopMonthly && <BadgeChip type="topMonthly" />}
          {badges.streakDays >= 3 && (
            <BadgeChip type="streak" value={badges.streakDays} />
          )}
          {badges.isFirstToday && <BadgeChip type="firstToday" />}
        </Stack>

        {/* Dernière contribution */}
        <Typography variant="caption" color="text.secondary">
          Dernière contribution :{" "}
          {formatDistanceToNow(new Date(lastContribution), {
            addSuffix: true,
            locale: fr,
          })}
        </Typography>
      </CardContent>
    </Card>
  );
}
