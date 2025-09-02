const mongoose = require("mongoose");
const UsersSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});
const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;
