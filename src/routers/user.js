const express = require('express')
const User = require('../models/users') 
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelEmail} = require('../emails/account')

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  // user.save().then(()=>{
  //     res.status(201).send(user)
  // }).catch((e)=>{
  //     res.status(400).send(e)
  //     // res.send(e)
  // })
  try {
    await user.save();
    sendWelcomeEmail(user.email,user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({user,token});
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/users/login',async (req,res)=>{
  
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);  
    const token = await user.generateAuthToken()
    res.send({user,token})
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/users/logout',auth, async (req,res)=>{
  try {
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get("/users/me", auth,async (req, res) => {
  //   User.find({})
  //     .then((users) => {
  //       res.send(users);
  //     })
  //     .catch((e) => {
  //       res.status(500).send(e);
  //     });
  res.send(req.user)
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   //   User.findById(_id)
//   //     .then((user) => {
//   //       if (!user) {
//   //         return res.status(404).send();
//   //       }

//   //       res.send(user);
//   //     })
//   //     .catch((e) => {
//   //       req.status(500).send(e);
//   //     });

//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();

//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.patch("/users/me",auth , async (req, res) => {
  const allowedUpdates = ["name", "email", "age","password"];
  const Updates = Object.keys(req.body);
  const isValidOperation = Updates.every((updates) =>
    allowedUpdates.includes(updates)
  );


  if (!isValidOperation)
    return res.status(400).send({ error: "Invalid Updates!" });

  try {
    // const user = await User.findById(req.params.id)
    const user = req.user
    Updates.forEach((update)=>{

      user[update] = req.body[update]
    })

    await user.save()
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me",auth , async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    await req.user.remove()
    sendCancelEmail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

const upload = multer({     //type of middleware
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){

    if(!file.originalname.match(/\.(jpg|jpeg|png)$/))   //original expression, $ checks the string at end
    {
      return cb(new Error('File should be an image'))
    } 
    cb(undefined,true)
  }
})

router.post('/users/me/avatar', auth ,upload.single('avatar'), async (req,res)=>{

  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save() 
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar', auth , async (req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
try {
  const user =await User.findById(req.params.id);

  if (!user || !user.avatar) {
    throw new Error()
  }
  
  res.set('Content-Type','image/png')
  res.send(user.avatar)
} catch (e) {
  res.status(404).send()
}

})

module.exports = router