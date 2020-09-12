const exphbs  = require('express-handlebars');
const express = require('express');
const expressLess = require('express-less');
const fs = require('fs');
const path = require('path');
const app = express();
app.enable('trust proxy');

const data = {
  about:   require('./data/about.json')
};

app.use('/static/css', expressLess(path.resolve(__dirname, 'less')));
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.engine('.hbs', exphbs({
  defaultLayout:  'main',
  extname:        '.hbs',
  partialsDir:    'views/pieces',
}));
app.set('view engine', '.hbs');
app.get('/',        (req, res) => res.redirect('/about'));
app.get('/about',   (req, res) => res.render('about',   { objects: data.about, }));
app.use((req, res) => res.status(404).render('404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(3000, () => console.log('Listening on: http://localhost:3000/'));
