import Cart from "../models/cart.model.js";

class CartDAO {
  async findByUser(userId) {
    return Cart.findOne({ user: userId }).populate("items.product");
  }

  async createForUser(userId) {
    const cart = new Cart({ user: userId, items: [] });
    return cart.save();
  }

  async save(cart) {
    return cart.save();
  }
}

export default new CartDAO();
