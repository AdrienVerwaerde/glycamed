import { Request, Response } from "express";
import { fetchProductByBarcode, searchProducts } from "../services/openFoodFacts.service";

export class ProductsController {
  async getByBarcode(req: Request, res: Response) {
    try {
      const { barcode } = req.params;
      if (!barcode) return res.status(400).json({ error: "barcode requis" });

      const product = await fetchProductByBarcode(barcode);
      return res.json(product);
    } catch (e: any) {
      return res.status(404).json({ error: e.message ?? "Produit introuvable" });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const q = String(req.query.q ?? "").trim();
      if (!q) return res.status(400).json({ error: "paramètre q requis" });

      const page = parseInt(String(req.query.page ?? "1"), 10);
      const pageSize = parseInt(String(req.query.pageSize ?? "10"), 10);

      const results = await searchProducts(q, page, pageSize);
      return res.json(results);
    } catch (e: any) {
      return res.status(500).json({ error: e.message ?? "Erreur recherche OFF" });
    }
  }
}
