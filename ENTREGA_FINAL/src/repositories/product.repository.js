import productDAO from "../daos/product.dao.js";

class ProductRepository {
  async getAll() {
    return productDAO.findAll();
  }

  async getById(id) {
    return productDAO.findById(id);
  }

  async create(data) {
    return productDAO.create(data);
  }

  async update(id, data) {
    return productDAO.update(id, data);
  }

  async delete(id) {
    return productDAO.delete(id);
  }
}

export default new ProductRepository();
