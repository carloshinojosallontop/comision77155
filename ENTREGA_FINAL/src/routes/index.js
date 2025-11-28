import { Router } from "express";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import cartRouter from "./cart.routes.js";
import adminRouter from "./admin.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/admin", adminRouter);

export default router;
