export function parseMlOrG(input: string | number): number {
  if (typeof input === "number") return input;
  const m = input.toLowerCase().match(/([\d.,]+)\s*(ml|g)/);
  if (!m) return NaN;
  const val = parseFloat(m[1].replace(",", "."));
  return val;
}

// Hypothèse densité ≈ 1g/ml pour boissons
export function computePerQuantity(nutr_100g: number | undefined, quantityMlOrG: number) {
  if (!nutr_100g || !isFinite(nutr_100g)) return 0;
  return (nutr_100g * quantityMlOrG) / 100;
}
