const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const comentarioSchema = new Schema({
  autor: String,
  comentario: String,
  id2: String,
  fecha: { type: Date, default: Date.now }
})

// crear modelo
const Comentario = mongoose.model('Comentario', comentarioSchema, 'comentario');

module.exports = Comentario;