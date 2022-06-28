const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const foroSchema = new Schema({
  titulo: String, // String is shorthand for {type: String}
  autor: String,
  descripcion: String,
  fecha: { type: Date, default: Date.now }
})

// crear modelo
const Foro = mongoose.model('Foro', foroSchema, 'foro');

module.exports = Foro;