import { ProductModel } from "../models/Product";
import type {
  OffProduct,
  OffProductResponse,
  OffSearchResponse,
} from "../types/dtos/open-food-facts";

const OFF_BASE_URL =
  process.env.OFF_BASE_URL ?? "https://world.openfoodfacts.org";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function normalize(off: OffProduct) {
  const nutr = off.nutriments ?? {};
  return {
    code: off.code,
    name: off.product_name ?? "Produit sans nom",
    brand: off.brands,
    imageUrl: off.image_url,
    servingSize: off.serving_size,
    nutriments: {
      sugars_100g: nutr.sugars_100g,
      caffeine_100g: nutr.caffeine_100g,
      energy_kcal_100g: (nutr as any)["energy-kcal_100g"],
    },
    categories: off.categories_tags ?? [],
  };
}

export async function fetchProductByBarcode(barcode: string) {
  // 1) Cache
  const existing = await ProductModel.findOne({ code: barcode });
  if (existing) {
    const tooOld =
      Date.now() - existing.lastFetchedAt.getTime() > REFRESH_TTL_MS;
    if (!tooOld) return existing;
  }

  // 2) OFF
  const url = `${OFF_BASE_URL}/api/v0/product/${encodeURIComponent(
    barcode
  )}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OFF error: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as OffProductResponse;

  if (data.status !== 1 || !data.product) {
    throw new Error("Produit introuvable sur Open Food Facts");
  }

  const normalized = normalize(data.product);

  // 3) Upsert cache
  const saved = await ProductModel.findOneAndUpdate(
    { code: normalized.code },
    { ...normalized, lastFetchedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return saved;
}

export async function searchProducts(query: string, page = 1, pageSize = 10) {
  // Utilise le moteur de recherche OFF simple
  const url = new URL(`${OFF_BASE_URL}/cgi/search.pl`);
  url.searchParams.set("search_terms", query);
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));

  const res = await fetch(url.toString());
  if (!res.ok)
    throw new Error(`OFF search error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as OffSearchResponse;

  // On ne sauvegarde pas tout en base ici; on renvoie un échantillon normalisé light
  return {
    count: data.count,
    page: data.page,
    pageCount: data.page_count,
    products: (data.products ?? []).map((p) => ({
      code: p.code,
      name: p.product_name ?? "Produit",
      brand: p.brands,
      imageUrl: p.image_url,
      nutriments: {
        sugars_100g: p.nutriments?.sugars_100g,
        caffeine_100g: p.nutriments?.caffeine_100g,
        energy_kcal_100g: (p.nutriments as any)?.["energy-kcal_100g"],
      },
    })),
  };
}
