export const toProductDTO = (product) => ({
  id: product._id,
  title: product.title,
  description: product.description,
  code: product.code,
  price: product.price,
  stock: product.stock,
  category: product.category,
  status: product.status,
});
