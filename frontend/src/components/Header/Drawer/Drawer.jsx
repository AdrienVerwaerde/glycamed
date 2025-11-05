import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import links from "../../../lib/data/links";
import { Link, Link as RouterLink, useNavigate } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useAuth } from "../../../contexts/AuthContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function AnchorTemporaryDrawer() {
  const { user, logout, isAuthenticated } = useAuth();
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
        justifyContent: "center",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {links.map((link) => (
          <ListItem
            key={link.id}
            disablePadding
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
          my: 2,
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
              sx={{
                backgroundColor: "var(--color-red)",
                color: "var(--color-white)",
                width: "100%",
                mt: 1,
              }}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          ) : (
            <Button sx={{ width: "100%", mt: 1 }} component={Link} to="/login">
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
              pr: "22px",
            }}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </Box>
      ))}
    </Box>
  );
}
