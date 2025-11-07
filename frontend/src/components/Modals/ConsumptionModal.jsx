import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography,
  Alert,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Search, LocalCafe, Place, Notes } from "@mui/icons-material";
import { productsAPI } from "../../services/api";
import { useConsumption } from "../../contexts/ConsumptionContext";

export default function ConsumptionModal({ open, onClose }) {
  const { addConsumption } = useConsumption();

  // Step 1: Product search
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Step 2: Consumption details
  const [quantity, setQuantity] = useState(100);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search products from OpenFoodFacts
  const handleSearchProducts = async (query) => {
    if (!query || query.length < 2) {
      setProducts([]);
      return;
    }

    try {
      setLoadingProducts(true);
      setError(null);
      const { data } = await productsAPI.search(query, 1, 20);
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error searching products:", err);
      setError("Erreur lors de la recherche des produits");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle product selection
  const handleProductSelect = (event, value) => {
    setSelectedProduct(value);
    setError(null);
  };

  // Calculate nutrients based on quantity
  const getCalculatedNutrients = () => {
    if (!selectedProduct) return null;

    const nutriments = selectedProduct.nutriments || {};
    const factor = quantity / 100; // OpenFoodFacts data is per 100g

    return {
      caffeine: (nutriments.caffeine_100g || 0) * factor,
      sugar: (nutriments.sugars_100g || 0) * factor,
      calories: (nutriments["energy-kcal_100g"] || 0) * factor,
    };
  };

  const calculatedNutrients = getCalculatedNutrients();

  // Submit consumption
  const handleAddConsumption = async () => {
    if (!selectedProduct) {
      setError("Veuillez sélectionner un produit");
      return;
    }

    if (!location.trim()) {
      setError("Veuillez indiquer un lieu");
      return;
    }

    if (quantity <= 0) {
      setError("La quantité doit être supérieure à 0");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await addConsumption({
        product_name: selectedProduct.product_name,
        quantity,
        location: location.trim(),
        notes: notes.trim(),
        nutriments: selectedProduct.nutriments,
      });

      // Reset form and close
      handleClose();
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout de la consommation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setProducts([]);
    setSelectedProduct(null);
    setQuantity(100);
    setLocation("");
    setNotes("");
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "60vh" },
      }}
    >
      <DialogTitle>Ajouter une consommation</DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Step 1: Search Product */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            1. Rechercher un produit
          </Typography>
          <Autocomplete
            freeSolo
            options={products}
            loading={loadingProducts}
            value={selectedProduct}
            onChange={handleProductSelect}
            onInputChange={(e, value) => {
              setSearchQuery(value);
              handleSearchProducts(value);
            }}
            getOptionLabel={(option) =>
              option.product_name ||
              option.product_name_fr ||
              "Produit sans nom"
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Ex: Coca-Cola, Red Bull..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loadingProducts ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id || option.code}>
                <Box>
                  <Typography variant="body1">
                    {option.product_name || option.product_name_fr}
                  </Typography>
                  {option.brands && (
                    <Typography variant="caption" color="text.secondary">
                      {option.brands}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            noOptionsText={
              searchQuery.length < 2
                ? "Tapez au moins 2 caractères..."
                : "Aucun produit trouvé"
            }
          />
        </Box>

        {/* Step 2: Product Details (shown when product is selected) */}
        {selectedProduct && (
          <>
            <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Produit sélectionné
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {selectedProduct.product_name ||
                  selectedProduct.product_name_fr}
              </Typography>
              {selectedProduct.brands && (
                <Typography variant="body2" color="text.secondary">
                  {selectedProduct.brands}
                </Typography>
              )}

              {calculatedNutrients && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Sucre
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {calculatedNutrients.sugar.toFixed(1)} g
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Calories
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {calculatedNutrients.calories.toFixed(0)} kcal
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">
                      Caféine
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {calculatedNutrients.caffeine.toFixed(1)} mg
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>

            {/* Step 3: Consumption Details */}
            <Typography variant="subtitle2" gutterBottom>
              2. Détails de la consommation
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantité (ml)"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseFloat(e.target.value) || 0))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalCafe />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Quantité consommée en millilitres"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Lieu"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Maison, Bureau, Café..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Place />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Notes (optionnel)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Notes />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Annuler
        </Button>
        <Button
          onClick={handleAddConsumption}
          variant="contained"
          disabled={!selectedProduct || !location.trim() || submitting}
          startIcon={submitting && <CircularProgress size={20} />}
        >
          {submitting ? "Ajout..." : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
