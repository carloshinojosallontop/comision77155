import cartService from "../services/cart.service.js";

export const getMyCart = async (req, res, next) => {
  try {
    const cart = await cartService.getOrCreateCartForUser(req.user._id);
    res.status(200).json({ success: true, payload: cart });
  } catch (err) {
    next(err);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const { quantity = 1 } = req.body;
    const cart = await cartService.addProductToCart(req.user._id, pid, quantity);
    res.status(200).json({ success: true, payload: cart });
  } catch (err) {
    next(err);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const result = await cartService.purchaseCart(req.user);
    res.status(200).json({
      success: true,
      ticket: result.ticket,
      cart: result.cart,
    });
  } catch (err) {
    next(err);
  }
};
