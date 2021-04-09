const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  admin_name: { type: String, required: true },
  admin_email: { type: String, required: true },
  admin_pass: { type: String, required: true },
  joinDate:{type:Date, required:true}
});

module.exports = mongoose.model("Admin", adminSchema);
