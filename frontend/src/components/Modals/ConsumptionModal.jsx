import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Search, QrCode, LocalDrink } from "@mui/icons-material";
import { productsAPI } from "../../services/api";
import { useConsumption } from "../../contexts/ConsumptionContext";
import { parseServingSize } from "../../lib/utils/servingSizeParser";

export default function ConsumptionModal({ open, onClose }) {
  const { addConsumption } = useConsumption();

  // Step management
  const [step, setStep] = useState(1); // 1: search, 2: details

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Selected product
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    quantity: "",
    location: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset modal
  const handleClose = () => {
    setStep(1);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
    setSelectedProduct(null);
    setFormData({ quantity: 100, location: "", notes: "" });
    setFormError("");
    onClose();
  };

  // Search products via backend
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError("Veuillez entrer un terme de recherche");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const { data } = await productsAPI.search(searchQuery);

      if (data.products && data.products.length > 0) {
        setSearchResults(data.products);
      } else {
        setSearchError("Aucun produit trouvé");
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError(
        err.response?.data?.error || "Erreur lors de la recherche"
      );
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Search by barcode via YOUR backend
  const handleBarcodeSearch = async () => {
    const barcode = prompt("Entrez le code-barres du produit:");
    if (!barcode) return;

    setSearchLoading(true);
    setSearchError("");

    try {
      const { data } = await productsAPI.getByBarcode(barcode);

      if (data) {
        // Convert backend product format to expected format
        selectProduct({
          code: data.code,
          name: data.name,
          brand: data.brand,
          imageUrl: data.imageUrl,
          nutriments: {
            sugars_100g: data.nutriments?.sugars_100g || 0,
            caffeine_100g: data.nutriments?.caffeine_100g || 0,
            "energy-kcal_100g": data.nutriments?.energy_kcal_100g || 0,
          },
        });
      } else {
        setSearchError("Produit introuvable");
      }
    } catch (err) {
      console.error("Barcode search error:", err);
      setSearchError(
        err.response?.data?.error || "Produit introuvable avec ce code-barres"
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // Select product and move to step 2
  const selectProduct = (product) => {
    setSelectedProduct(product);
    const parsed = parseServingSize(product.servingSize);
    setFormData((prev) => ({
      ...prev,
      quantity: parsed ?? 100, // default to 100
    }));
    setStep(2);
  };

  // Calculate nutrients based on quantity
  const calculateNutrients = () => {
    if (!selectedProduct) return { caffeine: 0, sugar: 0, calories: 0 };

    const q = Number(formData.quantity) || 0;
    const n = selectedProduct.nutriments || {};

    // Choose the right base per 100 unit
    const sugarPer100 = n.sugars_100ml ?? n.sugars_100g ?? 0;
    const kcalPer100 = n.energy_kcal_100ml ?? n.energy_kcal_100g ?? 0;

    // Caffeine: prefer per 100ml/g, then serving; normalize to mg
    const cafUnit = (n.caffeine_unit || "mg").toLowerCase();
    const toMg = (val) => {
      if (!val) return 0;
      return cafUnit === "g" ? val * 1000 : val; // assume mg if not "g"
    };

    let caffeinePer100 = toMg(n.caffeine_100ml) || toMg(n.caffeine_100g) || 0;
    if (!caffeinePer100 && n.caffeine_serving && q > 0) {
      const per1 = toMg(n.caffeine_serving) / q;
      caffeinePer100 = per1 * 100;
    }

    const factor = q / 100;

    return {
      caffeine: caffeinePer100 * factor,
      sugar: sugarPer100 * factor,
      calories: kcalPer100 * factor,
    };
  };

  // Submit consumption
  const handleSubmit = async () => {
    // Validation
    setSubmitting(true);
    setFormError("");

    try {
      const nutrients = calculateNutrients();

      await addConsumption({
        product_name: `${selectedProduct.name}${
          selectedProduct.brand ? ` - ${selectedProduct.brand}` : ""
        }`,
        quantity: formData.quantity,
        location: formData.location,
        notes: formData.notes,
        caffeine: Number(nutrients.caffeine.toFixed(1)),
        sugar: Number(nutrients.sugar.toFixed(1)),
        calories: Math.round(nutrients.calories),
        nutriments: selectedProduct.nutriments,
      });

      handleClose();
    } catch (err) {
      console.error("Submit error:", err);
      setFormError(err.message || "Erreur lors de l'ajout");
    } finally {
      setSubmitting(false);
    }
  };

  const nutrients = calculateNutrients();

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {step === 1 ? "Rechercher un produit" : "Détails de la consommation"}
      </DialogTitle>

      <DialogContent>
        {step === 1 ? (
          <>
            {/* Search */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
            >
              <TextField
                fullWidth
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? <CircularProgress size={24} /> : "Rechercher"}
              </Button>
              {/* <Button
                onClick={handleBarcodeSearch}
                disabled={searchLoading}
                startIcon={<QrCode />}
              >
                Code-barres
              </Button> */}
            </Box>

            {searchError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {searchError}
              </Alert>
            )}

            {searchResults.length > 0 && (
              <List>
                {searchResults.map((product) => (
                  <ListItem key={product.code} disablePadding>
                    <ListItemButton onClick={() => selectProduct(product)}>
                      <ListItemAvatar>
                        <Avatar
                          src={product.imageUrl}
                          alt={product.name}
                          variant="rounded"
                        >
                          <LocalDrink />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={product.name}
                        secondary={product.brand || "Marque inconnue"}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </>
        ) : (
          <>
            {/* Details */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                {selectedProduct.imageUrl && (
                  <Avatar
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    variant="rounded"
                    sx={{ width: 80, height: 80 }}
                  />
                )}
                <Box>
                  <Typography variant="h6">{selectedProduct.name}</Typography>
                  {selectedProduct.brand && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedProduct.brand}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                required
                label="Quantité (ml)"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
                sx={{ mb: 2 }}
                inputProps={{ min: 1, step: 1 }}
              />

              <TextField
                fullWidth
                required
                label="Lieu"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Notes (optionnel)"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                sx={{ mb: 2 }}
              />

              {/* Nutrient */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Valeurs nutritionnelles ({formData.quantity}g/ml) :
                </Typography>
                <Typography variant="body2">
                  Caféine: {nutrients.caffeine.toFixed(1)} mg
                </Typography>
                <Typography variant="body2">
                  Sucre: {nutrients.sugar.toFixed(1)} g
                </Typography>
                <Typography variant="body2">
                  Calories: {nutrients.calories.toFixed(0)} kcal
                </Typography>
              </Box>

              {formError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {formError}
                </Alert>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        {step === 1 ? (
          <Button onClick={handleClose}>Annuler</Button>
        ) : (
          <>
            <Button onClick={() => setStep(1)}>Retour</Button>
            <Button onClick={handleClose}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <CircularProgress
                  sx={{ backgroundColor: "var(--color-background)" }}
                  size={24}
                />
              ) : (
                "Ajouter"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
