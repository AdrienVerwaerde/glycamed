import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

export default function AnchorTemporaryDrawer() {
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
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider variant="middle" sx={{ borderColor: "var(--color-white)" }} />
      <List>
        {["Profil", "Deconnexion"].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} sx={{ textAlign: "center" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      {["right"].map((anchor) => (
        <Box key={anchor}>
          <Button
            onClick={toggleDrawer(anchor, true)}
            sx={{
              color: "var(--color-yellow)",
              backgroundColor: "transparent",
              minWidth: "auto",
            }}
            disableFocusRipple
            disableRipple
            disableTouchRipple
          >
            <MenuIcon sx={{ fontSize: "30px" }} />
          </Button>
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
