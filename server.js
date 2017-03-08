const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const webpackConfig = require('./webpack.dev.config');
const compiler = require('webpack')(webpackConfig);


io.on('connection', (socket) => {
  console.log('hotreload socket server started ,connectid' + socket.id);
  socket.on('change', () => {
    socket.broadcast.emit('onchange');
  });
});

const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:8060',
  optionsSuccessStatus: 200,
  credentials: true,
};
const codingPackage = require('./package.json').codingIdePackage;


app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (process.env.VERSION === 'platform') {
    res.set(
    'Content-Type', 'application/vnd.coding.v2+json;charset=UTF-8'
    );
  }
  return next();
});


app.get('/', (req, res) => {
  res.send('it works');
});


app.get('/packages', (req, res) => {
  res.json({ [codingPackage.name]: codingPackage });
});

app.get('/packages/:pkgId', (req, res) => {
  res.json(codingPackage);
});

const webpackDevInstance = require('webpack-dev-middleware')(compiler, {
  publicPath: '/static',
  headers: { "Access-Control-Allow-Origin": "http://localhost:8060" },
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  inline: true,
  stats: {
    color: true,
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: true,
    chunkModules: false,
  },
});

app.use(webpackDevInstance);
compiler.watch({}, (err) => {
  if (!err) {
    console.log('send reload command to frontend');
    io.emit('change');
  }
});

server.listen(PORT, () => {
  console.log(`plugin script folder served at localhost:${PORT}/static/`);
  console.log(`plugin list api served at localhost:${PORT}/packages`);
});

module.exports = { emitChange: io.emit };
