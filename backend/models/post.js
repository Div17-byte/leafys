const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  imageName: { type: String, required: true },
  creatorName:{type: String, required:true},
  creator:{ type:mongoose.Schema.Types.ObjectId,ref:"User", required:true},
  createDate:{type:Date, required:true}
});

module.exports = mongoose.model("Post", postSchema);
