const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');
require('dotenv/config');

global.__basedir = __dirname;
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'app/views');
// app.use(morgan('combined'));
app.use(express.static('app/public'));
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.get('', (req, res) => {
  res.render('index', { layout: '../views/auth/layoutAuth.ejs', title: 'Introduction' });
});

app.get('/', (req, res) => {
  res.render('index', {
    layout: '../views/auth/layoutAuth.ejs',
    title: 'Introduction',
  });
});

// app.get('/password/reset', (req, res) => {
//   res.render('auth/passwords/email', {
//     layout: '../views/auth/layoutAuth.ejs',
//     title: 'Quên mật khẩu',
//   });
// });
// app.get('/password/reset/:email', (req, res) => {
//   res.render('auth/passwords/reset', {
//     layout: '../views/auth/layoutAuth.ejs',
//     title: 'Khôi phục mật khẩu',
//   });
// });
app.get('/500', (req, res) => {
  res.render('err', {
    layout: '../views/auth/layoutAuth.ejs',
    title: 'Lỗi Server',
  });
});
app.get('/404', (req, res) => {
  res.render('404', {
    layout: '../views/auth/layoutAuth.ejs',
    title: 'Lỗi Client',
  });
});

require('./app/routes/route')(app);

app.listen(process.env.PORT, function () {
  console.log(`server running: http://localhost:${process.env.PORT}`);
});
