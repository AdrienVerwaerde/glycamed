import { Router } from "express";
import { ProductsController } from "../controllers/productsController";
// import { authMiddleware } from "../middlewares/auth"; // à activer quand l’auth est prête

const router = Router();
const controller = new ProductsController();

// router.use(authMiddleware); // toutes les routes protégées (plus tard)
router.get("/products/barcode/:barcode", controller.getByBarcode.bind(controller));
router.get("/products/search", controller.search.bind(controller));

export default router;
