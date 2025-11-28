import productService from "../services/product.service.js";
import { toProductDTO } from "../dtos/product.dto.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.status(200).json({
      success: true,
      payload: products.map(toProductDTO),
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productService.getById(pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, payload: toProductDTO(product) });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, payload: toProductDTO(product) });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const updated = await productService.update(pid, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, payload: toProductDTO(updated) });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const deleted = await productService.delete(pid);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, message: "Producto eliminado" });
  } catch (err) {
    next(err);
  }
};
