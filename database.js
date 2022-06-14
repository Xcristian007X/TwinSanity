const mongoose = require('mongoose');

const pass = 'HOUzT8lr8l8ywPQT';
const uri = `mongodb+srv://root:${pass}@twinsanity.2ovgpc1.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
})
   .then(db => console.log('Base de datos conectada'))
   .catch(err => console.error(err));