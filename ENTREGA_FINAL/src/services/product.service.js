import productRepository from "../repositories/product.repository.js";

class ProductService {
  async getAll() {
    return productRepository.getAll();
  }

  async getById(id) {
    return productRepository.getById(id);
  }

  async create(data) {
    return productRepository.create(data);
  }

  async update(id, data) {
    return productRepository.update(id, data);
  }

  async delete(id) {
    return productRepository.delete(id);
  }
}

export default new ProductService();
