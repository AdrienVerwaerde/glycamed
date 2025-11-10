export interface OffNutriments {
  sugars_100g?: number;
  caffeine_100g?: number;
  "energy-kcal_100g"?: number;
  sugars_serving?: number;
  caffeine_serving?: number;
  "energy-kcal_serving"?: number;
}

export interface OffProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  serving_size?: string;
  nutriments?: OffNutriments;
  categories_tags?: string[];
  quantity?: string;
}

export interface OffProductResponse {
  status: 0 | 1;
  code: string;
  product?: OffProduct;
}

export interface OffSearchHit {
  code: string;
  product_name?: string;
  serving_size?: string;
  brands?: string;
  image_url?: string;
  nutriments?: OffNutriments;
}

export interface OffSearchResponse {
  count: number;
  page: number;
  page_count: number;
  products: OffSearchHit[];
}
