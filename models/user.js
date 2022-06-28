const {Schema, model}= require('mongoose');
//const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
      name: { type: String, trim: true },
      username: { type: String, required: true, unique: true, trim: true },
      email: { type: String, required: true, unique: true, trim: true },
      password: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
  UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
//export default mongoose.model("user", UserSchema);

const User = model('User', UserSchema, 'user');

module.exports = User;