import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import links from "../../../lib/data/links";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useAuth } from "../../../contexts/AuthContext";
import Button from "@mui/material/Button";

export default function AnchorTemporaryDrawer() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "var(--color-background)",
        color: "var(--color-yellow)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 8,
      }}
      role="presentation"
    >
      <CloseIcon
        onClick={toggleDrawer(anchor, false)}
        sx={{
          color: "var(--color-yellow)",
          position: "absolute",
          top: 15,
          right: 25,
          fontSize: "32px",
          "&:hover": { cursor: "pointer" },
        }}
      />
      <List sx={{ width: "100%" }}>
        {links.map((link) => (
          <ListItem
            key={link.id}
            disablePadding
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <ListItemButton
              component={RouterLink}
              to={link.url}
              onClick={toggleDrawer(anchor, false)}
            >
              <ListItemText primary={link.title} sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider
        sx={{
          backgroundColor: "var(--color-yellow)",
          borderWidth: "1px",
          width: "80%",
          mt: 2,
          mb: 4,
        }}
      />

      <List>
        <ListItem
          disablePadding
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isAuthenticated ? (
            <Button
              variant="cancel"
              onClick={(e) => {
                handleLogout();
                toggleDrawer(anchor, false)(e);
              }}
            >
              Déconnexion
            </Button>
          ) : (
            <Button
              sx={{ width: "100%", mt: 1 }}
              component={Link}
              to="/login"
              onClick={toggleDrawer(anchor, false)}
            >
              Connexion
            </Button>
          )}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box>
      {["right"].map((anchor) => (
        <Box key={anchor} sx={{ display: "flex", alignItems: "center" }}>
          <MenuIcon
            onClick={toggleDrawer(anchor, true)}
            sx={{
              color: "var(--color-yellow)",
              fontSize: "32px",
              mr: "22px",
              "&:hover": { cursor: "pointer" },
            }}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              "& .MuiDrawer-paper": {
                borderRadius: "0px",
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </Box>
      ))}
    </Box>
  );
}
