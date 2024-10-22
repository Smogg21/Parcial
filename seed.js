// seed.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
const News = require('./models/News'); 

mongoose.connect('mongodb://localhost/techgames', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const products = [
  {
    name: 'PS5',
    price: 499,
    image: '/images/ps5.png',
    description: 'La última consola de videojuegos con gráficos de alta definición.',
    category: 'Consolas',
    stock: 10
  },
  {
    name: 'God of War Ragnarok',
    price: 59,
    image: '/images/GOWR.png',
    description: 'El juego más esperado del año.',
    category: 'Videojuegos',
    stock: 50
  },
  {
    name: 'The Last of Us Part II',
    price: 49,
    image: '/images/thelastofus2.png',
    description: 'Una emotiva y poderosa historia de supervivencia y redención.',
    category: 'Videojuegos',
    stock: 30
  },
  {
    name: 'Elden Ring',
    price: 59,
    image: '/images/eldenring.png',
    description: 'Un juego de rol de acción en un vasto mundo abierto.',
    category: 'Videojuegos',
    stock: 25
  },
  {
    name: 'Cyberpunk 2077',
    price: 39,
    image: '/images/cyberpunk2077.png',
    description: 'Un RPG de mundo abierto ambientado en una metrópoli futurista.',
    category: 'Videojuegos',
    stock: 40
  },

  {
    name: 'Assassin\'s Creed Valhalla',
    price: 59,
    image: '/images/acvalhalla.png',
    description: 'Embárcate en una aventura vikinga épica llena de acción y exploración.',
    category: 'Videojuegos',
    stock: 45
  },
  {
    name: 'Minecraft',
    price: 26,
    image: '/images/minecraft.png',
    description: 'Un juego de construcción y aventura en un mundo generado por bloques.',
    category: 'Videojuegos',
    stock: 100
  },
  {
    name: 'FIFA 24',
    price: 59,
    image: '/images/fifa24.png',
    description: 'La última edición del popular juego de fútbol con mejoras en gráficos y jugabilidad.',
    category: 'Videojuegos',
    stock: 60
  },
  {
    name: 'Call of Duty: Modern Warfare II',
    price: 69,
    image: '/images/codmw2.png',
    description: 'La nueva entrega de la franquicia de disparos en primera persona con modos multijugador mejorados.',
    category: 'Videojuegos',
    stock: 55
  },
  {
    name: 'Nintendo Switch',
    price: 299,
    image: '/images/switch.png',
    description: 'La versátil consola de Nintendo para jugar en casa o en movimiento.',
    category: 'Consolas',
    stock: 20
  },
  {
    name: 'Xbox Series X',
    price: 499,
    image: '/images/xboxseriesx.png',
    description: 'La consola más potente de Xbox con gráficos de última generación.',
    category: 'Consolas',
    stock: 15
  },
  {
    name: 'Animal Crossing: New Horizons',
    price: 59,
    image: '/images/animalcrossing.png',
    description: 'Crea y personaliza tu propia isla paradisíaca en este encantador juego de simulación.',
    category: 'Videojuegos',
    stock: 70
  },
  {
    name: 'Red Dead Redemption 2',
    price: 59,
    image: '/images/rdr2.png',
    description: 'Una épica aventura en el Viejo Oeste con una historia envolvente y mundo abierto.',
    category: 'Videojuegos',
    stock: 40
  },
  {
    name: 'Spider-Man: Miles Morales',
    price: 49,
    image: '/images/milesmorales.png',
    description: 'Acompaña a Miles Morales en su viaje para convertirse en el nuevo Spider-Man.',
    category: 'Videojuegos',
    stock: 35
  },
  {
    name: 'Horizon Forbidden West',
    price: 59,
    image: '/images/horizonfw.png',
    description: 'Explora un mundo postapocalíptico lleno de máquinas y maravillas naturales.',
    category: 'Videojuegos',
    stock: 30
  },
];

const news = [
  {
    title: 'Lanzamiento de la Nueva Consola PS6',
    content: 'La empresa Sony ha anunciado el lanzamiento de la PS6, que promete revolucionar el mercado con sus innovadoras características.',
    image: '/images/ps6.png',
    date: new Date('2024-04-01')
  },
  {
    title: 'Actualización Importante para World of Warcraft',
    content: 'El juego World of Warcraft ha recibido una actualización que incluye nuevos niveles, personajes y mejoras gráficas.',
    image: '/images/wow.png',
    date: new Date('2024-04-15')
  },
  // Agrega más noticias según sea necesario
];

async function seedDB() {
  await Product.deleteMany({});
  await News.deleteMany({});
  await Product.insertMany(products);
  await News.insertMany(news);
  console.log('Base de datos poblada poblada con productos y noticias');
  mongoose.connection.close();
}

seedDB();
