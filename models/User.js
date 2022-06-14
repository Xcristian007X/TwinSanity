const mongoose = require('mongoose');
const {Schema , model} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
{
    name: {type: String, required: true},
    email: {type: String, required: true},
    pass: {type: String, required: true},
    date: {type: Date, default: Date.now}
},
{
    timestamps: true,
    versionKey: false,
}
);

UserSchema.methods.encryptPwd = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(pass, salt);
};

UserSchema.methods.matchPwd = async function (pass) {
    return await bcrypt.compare(pass, this.pass);
};

module.exports = mongoose.model("User", UserSchema);