const exphbs  = require('express-handlebars');
const express = require('express');
const expressLess = require('express-less');
const fs = require('fs');
const path = require('path');
const app = express();
app.enable('trust proxy');

const directory_video = path.resolve(__dirname, 'static', 'webm', 'a');
const data = {
  about:   require('./data/about.json'),
  friends: require('./data/friends.json'),
  anime:   require('./data/anime.json'),
  movies:  require('./data/movies.json'),
  nice:    require('./data/nice.json'),
  webm:    fs.readdirSync(directory_video),
};

app.use('/static/css', expressLess(path.resolve(__dirname, 'less')));
app.use('/static', express.static(path.resolve(__dirname, 'static')));
app.use('/jquery', express.static(path.resolve(__dirname, 'node_modules', 'jquery', 'dist')));
app.engine('.hbs', exphbs({
  defaultLayout:  'main',
  extname:        '.hbs',
  partialsDir:    'views/pieces',
}));
app.set('view engine', '.hbs');
app.get('/',        (req, res) => res.redirect('/about'));
app.get('/about',   (req, res) => res.render('about',   { objects: data.about, }));
app.get('/friends', (req, res) => res.render('friends', { objects: data.friends, }));
app.get('/soc',     (req, res) => res.render('soc'));
app.get('/anime',   (req, res) => res.render('anime',   { objects: data.anime, }));
app.get('/movies',  (req, res) => res.render('movies',  { objects: data.movies, }));
app.get('/music',   (req, res) => res.render('music'));
app.get('/nice',    (req, res) => res.render('nice',    { objects: data.nice, }));
app.get('/webm',    (req, res) => res.redirect('/webm/1'));
app.get('/webm/:page', (req, res, next) => {
  const page_size = 10;
  const page_count = Math.ceil(data.webm.length / page_size);
  const page_current = parseInt(req.params.page);
  if (page_current < 1 || page_current > page_count)
    return next();
  res.render('webm', {
    pages: (
      new Array(7)
        .fill()
        .map((item, index) => page_current + (index - 3))
        .filter(page => page > 0)
        .filter(page => page <= page_count)
        .map(page => ({
          page,
          active: page === page_current,
        }))
    ),
    page_show_previous: page_current > 1          ? page_current - 1 : undefined,
    page_show_next:     page_current < page_count ? page_current + 1 : undefined,
    objects: data.webm.slice((page_current - 1) * page_size, page_current * page_size),
  });
});
app.use((req, res) => res.status(404).render('404'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500');
});

app.listen(3000, () => console.log('Listening on: http://localhost:3000/'));
