/**
 * Parse serving size from various formats:
 * - "330ml" → 330
 * - "330 ml" → 330
 * - "33cl" → 330
 * - "0.33l" → 330
 * - "250g" → 250
 * - "1.5L" → 1500
 * - "500 mL" → 500
 */
export function parseServingSize(servingSize) {
  if (!servingSize || typeof servingSize !== "string") {
    return null;
  }

  const cleaned = servingSize.toLowerCase().trim();

  // Remove common words
  const withoutWords = cleaned
    .replace(/portion|serving|can|bottle|bouteille|cannette/gi, "")
    .trim();

  // Try to match number + unit patterns
  const patterns = [
    // Milliliters: "330ml", "330 ml", "330mL"
    { regex: /(\d+(?:\.\d+)?)\s*ml/i, multiplier: 1 },

    // Centiliters: "33cl", "33 cl"
    { regex: /(\d+(?:\.\d+)?)\s*cl/i, multiplier: 10 },

    // Liters: "0.33l", "0.33 l", "1.5L"
    { regex: /(\d+(?:\.\d+)?)\s*l(?:\s|$)/i, multiplier: 1000 },

    // Grams: "250g", "250 g"
    { regex: /(\d+(?:\.\d+)?)\s*g(?:\s|$)/i, multiplier: 1 },

    // Kilograms: "1.5kg", "1.5 kg"
    { regex: /(\d+(?:\.\d+)?)\s*kg/i, multiplier: 1000 },

    // Just a number: "330"
    { regex: /^(\d+(?:\.\d+)?)$/, multiplier: 1 },
  ];

  for (const { regex, multiplier } of patterns) {
    const match = withoutWords.match(regex);
    if (match) {
      const value = parseFloat(match[1]) * multiplier;
      // Round to nearest integer
      return Math.round(value);
    }
  }

  // If nothing matched, return null
  return null;
}

// Helper to format quantity back to readable format
export function formatQuantity(quantity) {
  if (!quantity) return "";

  if (quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)}L`;
  }

  return `${quantity}ml`;
}
