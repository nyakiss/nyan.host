const exphbs  = require('express-handlebars');
const express = require('express');
const expressLess = require('express-less');
const fs = require('fs');
const path = require('path');
const app = express();
app.enable('trust proxy');

const data = {
  about:       require('./data/about.json'),
  links:       require('./data/links.json'),
  doporders:   require('./data/doporders.json'),
  hetzner:     require('./data/hetzner.json'),
  kimsufi:     require('./data/kimsufi.json'),
  ovh:         require('./data/ovh.json'),
  ovhausgp:    require('./data/ovhausgp.json'),
  ovhus:       require('./data/ovhus.json'),
  ovhvps:      require('./data/ovhvps.json'),
  soyoustart:  require('./data/soyoustart.json')
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
app.get('/about',   (req, res) => res.render('about',   { about: data.about, links: data.links}));
app.use((req, res) => res.status(404).render('404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(3000, () => console.log('Ok, dude, i`m on: http://localhost:3000/'));
