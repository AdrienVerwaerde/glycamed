import { Router } from "express";
import { ProductsController } from "../controllers/productsController";
// import { authMiddleware } from "../middlewares/auth"; // à activer quand l’auth est prête

const router = Router();
const controller = new ProductsController();

// router.use(authMiddleware); // toutes les routes protégées (plus tard)
router.get("/search", (req, res) => controller.search(req, res));
router.get("/barcode/:barcode", (req, res) =>
  controller.getByBarcode(req, res)
);

export default router;
