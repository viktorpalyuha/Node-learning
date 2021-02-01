const Product = require('../models/product');

module.exports.getProduct = (_, res) => {
  res.render('admin/edit-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

module.exports.postProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;

  const product = new Product({ title, imageUrl, price, description, userId });
  product
    .save()
    .then((result) => {
      console.log('Created product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  console.log(editMode);
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.postEditProduct = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then((products) => {
      res.render('admin/products', { prods: products, pageTitle: 'Admin Products', path: '/admin/products' });
    })
    .catch((err) => console.log(err));
};

module.exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};
