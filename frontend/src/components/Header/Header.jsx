import Box from "@mui/material/Box";
import AnchorTemporaryDrawer from "./Drawer/Drawer";
import Typography from "@mui/material/Typography";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "62px",
        position: "fixed",
        zIndex: 100,
        top: 0,
        backgroundColor: "var(--color-blue)",
        borderBottom: "1px solid var(--color-yellow)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "var(--color-yellow)",
          ml: 3,
          fontFamily: "Rubik Vinyl",
        }}
      >
        ParAmedic
      </Typography>
      <AnchorTemporaryDrawer />
    </Box>
  );
}
