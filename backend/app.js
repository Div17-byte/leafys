const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const Post = require('./models/post');
const User = require('./models/user');
const Admin = require('./models/admin');
const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const checkAuth = require("./middleware/check-auth");

const app = express();

const server = app.listen(3001, () => {
  console.log('Server has been started!')
});
console.log(__dirname);




mongoose
.connect(
  "mongodb+srv://Tryabb:KUtkXowK2CWevima@cluster0.knumk.mongodb.net/test?authSource=admin&replicaSet=atlas-n0d5np-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
  ,{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:false})
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

  mongoose.set('returnOriginal',false);

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/images',express.static(__dirname + '/images'));




app.get('/download',function(req,res){
  const file = __dirname +"/images/"+req.query.filename;
  console.log(file);
  res.download(file);
  })

  app.get('/chk',(req, res, next)=>{
    res.status(200).json({
      message:'yeeehaaaawww'
    })
  })

  app.delete('/Delete-userUploads/:id',checkAuth,(req, res)=>{
    let userId = {creator:req.params.id}
    let imgId = {_id:req.userData.userId}
    Post.deleteOne(userId,imgId).then(doc=>{
      if(doc.n>0){return res.status(201).end()}
      else return res.status(404).send({message:"Not Authorized"})

    })
  })
  app.get('/userUploads/:id',(req, res)=>{
    let userId = {creator:req.params.id}
    Post.find(userId).then(post=>{
      if(post)
      {
        return res.status(200).json({usrpost:post})
      }
      else
      {
        return res.status(404).send({message:"Post not found !"})
      }

    })
  })
/// admin routes

  app.get('/admin_ban/:id',(req, res, next)=>{
    var id = { _id:req.params.id };
    User.findByIdAndUpdate(id,{"banStatus":true}).then(doc=>{
      if(!doc){return res.status(404).end()}
      else return res.status(200).send({doc:doc})
    })

    })

    app.get('/admin_Unban/:id',(req, res, next)=>{
      let id = { _id:req.params.id };

      User.findByIdAndUpdate(id,{"banStatus":false}).then(doc=>{
        if(!doc){return res.status(404).end()}
        else return res.status(200).json(doc)
      })

      })
      app.delete('/admin_Deleteuser/:id',(req, res, next)=>{
        let id = { _id:req.params.id };

        User.findByIdAndRemove(id).then(doc=>{
          if(!doc){return res.status(404).end()}
          else return res.status(200).json(doc)
        })

        })
        app.delete('/admin_DeletePost/:id',(req, res, next)=>{
          let id = { _id:req.params.id };

          Post.findByIdAndRemove(id).then(doc=>{
            if(!doc){return res.status(404).end()}
            else return res.status(200).json(doc)
          })

          })



  app.get('/admin_get',(req, res, next)=>{
    Post.find().then(post=>{
      if(post){
        res.status(200).json({msg:post})
      } else {
        res.status(404).json({message:'Post not found'})
      }
    })
  })
  app.get('/admin_get_users',(req, res, next)=>{
    User.find().then(users=>{
      if(users)
      { res.status(200).json({res:users})}
        else
         { res.status(404).json({message:'User not found'})}
    })

  })

  app.post('/admin_login',(req, res, next)=>{
    Admin.findOne({admin_name:req.body.admin_name,admin_pass:req.body.admin_pass})
    .then(adminRes=>{
      if(!adminRes){
        return res.status(401).json({message:'Auth failed'})
      } else {res.status(200).json({message:'Login authorized',doc:adminRes})
    }
    }).catch(err=>{
      return res.status(401).json({message:'Auth Failed'})
    })

  })

  app.post('/admin_register',(req, res, next)=>{
    const admin = new Admin({
      admin_name:req.body.admin_name,
      admin_email:req.body.admin_email,
      admin_pass:req.body.admin_pass,
      joinDate:Date.now()
    });
    admin.save().then(result=>{
      res.status(201).json({
        message:'Admin created!',
        result:result
      })
    })
  })




app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
