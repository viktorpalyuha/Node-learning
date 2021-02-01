const Product = require('../models/product');

module.exports.getProduct = (_, res) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

module.exports.postProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect('/');
};

module.exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  console.log(editMode);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
  });
};

module.exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
  updatedProduct.save();
  res.redirect('/admin/products');
};

module.exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', { prods: products, pageTitle: 'Admin Products', path: '/admin/products' });
  });
};

module.exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};
