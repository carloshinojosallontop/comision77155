import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);

router.post("/", requireAuth, requireRole("admin"), createProduct);
router.put("/:pid", requireAuth, requireRole("admin"), updateProduct);
router.delete("/:pid", requireAuth, requireRole("admin"), deleteProduct);

export default router;
