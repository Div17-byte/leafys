const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post("/signup",(req,res,next)=>{
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email:req.body.email,
      password:hash,
      username:req.body.username,
      banStatus:false


    });
    user.save()
    .then(result=>{
      res.status(201).json({
        message: 'User created!',
        result: result
      })
    }).catch(err=>{
      res.status(500).json({
        error:err
      })
    })
  });
});


router.get("/uname/:id", (req, res)=>{
User.findById(req.params.id).then(user=>{
  if(user){
    let uname = user.username;
    res.status(200).json({uname:uname});
  }
  else{
    res.status(404).json({message:'Not Found'});
  }
})
})

router.get("/Check_ban_status/:email",(req,res)=>{
  User.findOne({email:req.params.email}).then(user =>{
    if(user){
      var isBanned = user['banStatus'];
     return res.status(200).json({isBanned:isBanned});
    }
    // else  res.status(404).json({message:' User Not found'})
  })
})

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId:fetchedUser._id, username:fetchedUser.username },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn:3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});


module.exports = router;
