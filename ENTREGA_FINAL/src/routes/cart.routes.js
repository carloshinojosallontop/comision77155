import { Router } from "express";
import {
  getMyCart,
  addProductToCart,
  purchaseCart,
} from "../controllers/cart.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/mine", requireAuth, requireRole("user"), getMyCart);
router.post("/mine/product/:pid", requireAuth, requireRole("user"), addProductToCart);
router.post("/mine/purchase", requireAuth, requireRole("user"), purchaseCart);

export default router;
