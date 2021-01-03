const mongoose= require('mongoose')
const validator=require('validator')


const taskSchema = new mongoose.Schema({
  Description: {
    type: String,
    trim: true,
    required: true,
  },
  Completed: {
    type: Boolean,
    default: false,
  },
  Author:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Users'
  }
},{
  timestamps: true
})
const Task = mongoose.model("Tasks",taskSchema);


module.exports= Task