const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/404');
const User = require('./models/user');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('601862a72863182a548cd694')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://zX56ssTp6hp2ZhEs:zX56ssTp6hp2ZhEs@cluster0.lbial.mongodb.net/shop?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({ username: 'Viktor', email: 'viktor@gmail.com', cart: { items: [] } });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
