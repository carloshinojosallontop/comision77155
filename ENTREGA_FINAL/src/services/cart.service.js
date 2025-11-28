import cartRepository from "../repositories/cart.repository.js";
import productRepository from "../repositories/product.repository.js";
import ticketRepository from "../repositories/ticket.repository.js";
import { generateCode } from "../utils/generateCode.js";

class CartService {
  async getOrCreateCartForUser(userId) {
    let cart = await cartRepository.getByUser(userId);
    if (!cart) {
      cart = await cartRepository.createForUser(userId);
    }
    return cart;
  }

  async addProductToCart(userId, productId, quantity = 1) {
    const product = await productRepository.getById(productId);
    if (!product || !product.status) {
      throw new Error("Producto no disponible");
    }

    const cart = await this.getOrCreateCartForUser(userId);

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cartRepository.save(cart);
    return cart;
  }

  async purchaseCart(user) {
    const cart = await cartRepository.getByUser(user._id);
    if (!cart || cart.items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    let totalAmount = 0;
    const itemsToKeep = [];
    const processedItems = [];

    for (const item of cart.items) {
      const product = await productRepository.getById(item.product);
      if (!product || product.stock < item.quantity) {
        // No hay stock suficiente: se deja en el carrito
        itemsToKeep.push(item);
        continue;
      }

      // Hay stock suficiente: se descuenta y se agrega al ticket
      product.stock -= item.quantity;
      totalAmount += product.price * item.quantity;

      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      await productRepository.update(product._id, { stock: product.stock });
    }

    if (totalAmount === 0 || processedItems.length === 0) {
      throw new Error(
        "No hay productos con stock suficiente para completar la compra"
      );
    }

    // Se actualiza el carrito con los productos que NO se pudieron comprar
    cart.items = itemsToKeep;
    await cartRepository.save(cart);

    const ticket = await ticketRepository.create({
      code: generateCode(),
      amount: totalAmount,
      purchaser: user.email,
      products: processedItems,
    });

    return { ticket, cart };
  }
}

export default new CartService();
