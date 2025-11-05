import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Gauge from "./Gauge";
import Stack from "@mui/material/Stack";

export default function SugarTracker() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [sugarContent, setSugarContent] = useState("");

  const totalSugar = products.reduce((sum, product) => sum + product.sugar, 0);

  const addProduct = () => {
    if (productName && sugarContent) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          name: productName,
          sugar: parseFloat(sugarContent),
        },
      ]);
      setProductName("");
      setSugarContent("");
    }
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <Box>
      <Gauge sugarAmount={totalSugar} maxSugar={100} />

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Nom du produit"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Sucre (mg)"
            type="number"
            value={sugarContent}
            onChange={(e) => setSugarContent(e.target.value)}
            fullWidth
          />
        </Stack>
        <Button onClick={addProduct}>Ajouter</Button>
      </Box>

      <List sx={{ mt: 3 }}>
        {products.map((product) => (
          <ListItem
            key={product.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => removeProduct(product.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={product.name}
              secondary={`${product.sugar}mg de sucre`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
