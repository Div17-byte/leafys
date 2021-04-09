const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const fs = require("fs");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      imageName:req.file.filename,
      creator:req.userData.userId,
      creatorName:req.userData.username,
      createDate:Date.now(),

    });
    console.log(req.file.filename);
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    }).catch(err=>{console.log(err)});
  }
);

router.put(
  "/:id",checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      imageName:req.file.filename,
      creator:req.userData.userId,
      creatorName:req.userData.username
    });
    Post.updateOne({ _id: req.params.id, creator:req.userData.userId }, post).then(result => {
      if(result.nModified> 0){
        res.status(200).json({message:"Update successful!"});
      }else{
      res.status(401).json({ message: "Not authorized" });
    }
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find().sort("-createDate");
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id",checkAuth, (req, res, next) => {
  var ImgpathforDeletion = "name";
  Post.findById({_id:req.params.id}).then(r=>{
    if(res){
      ImgpathforDeletion = r["imageName"];
      res.status(200).send({message:"File Found"})
    }
  }).then(()=>{
    var pathToFile = "backend/images/"+ ImgpathforDeletion;
    Post.deleteOne({ _id:req.params.id,creator:req.userData.userId }).then(result => {
      if(result.n> 0){
        try{
          fs.unlinkSync(pathToFile).then((pr)=>{
            if(pr){
              res.status(200).json({message:"Deletion successful!"});
            }
            else
            {
              res.status(500).json({message:"File deletion error"});
            }
          });
          console.log("Successfully deleted the file.")
        } catch(err){
          console.log(err)
        }
      }else{
      res.status(401).json({ message: "Not authorized" });
    }
    });
  })
});

router.get('/chk',(req, res, next)=>{
  res.status(200).json({
    message:'yeeehaaaawww'
  })
})


module.exports = router;
