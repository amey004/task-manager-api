const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Task = require('./tasks');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error('Password cannot conatin the word "password" .');
      }
    },
  },
  age: {
    default: 0,
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }],
  avatar:{
    type:Buffer
  }
},{
  timestamps:true
});

//middleware

userSchema.virtual('tasks',{
  ref:'Tasks',
  localField : '_id',
  foreignField: 'Author'
})

userSchema.methods.toJSON = function () {     //this gets called everytime res.send is used
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({token})
  user.save()
  return token;
};

userSchema.statics.findByCredentials = async (email,password)=>{
  const user = await User.findOne({email})      //shorthand syntax
  if(!user){
    throw new Error("Unable to login!")
  }

  const isMatch = await bcrypt.compare(password,user.password)

  if(!isMatch){
    throw new Error("Unable to login!")
  }
  return user
}

userSchema.pre('save',async function (next){
  const user = this   //this gives access to properties of users

  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }
  next()
})

userSchema.pre('remove',async function (next) {
    const user = this
    await Task.deleteMany({Author:user._id})
    next()
})


const User = mongoose.model("Users",userSchema);

module.exports = User