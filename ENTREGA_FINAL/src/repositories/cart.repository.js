import cartDAO from "../daos/cart.dao.js";

class CartRepository {
  async getByUser(userId) {
    return cartDAO.findByUser(userId);
  }

  async createForUser(userId) {
    return cartDAO.createForUser(userId);
  }

  async save(cart) {
    return cartDAO.save(cart);
  }
}

export default new CartRepository();
